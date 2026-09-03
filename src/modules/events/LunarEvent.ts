import { App } from '../App';
import { GameEvents } from '../GameEvents';
import {
  CULTIST_SPAWN_CHANCE,
  LunarStage,
  MOON_LORD_COUNTDOWN_MS,
  MOON_LORD_RETRY_MS,
  PILLAR_KILLS_REQUIRED,
  PillarList,
  pillarOfBoss,
  pillarOfZone,
  type PillarDef,
} from './LunarStage';

export interface LunarSave {
  stage: string;
  kills: Record<string, number>;
  defeated: string[];
  countdownMs: number;
}

export interface PillarView extends PillarDef {
  kills: number;
  required: number;
  /** El escudo ya ha caido: el pilar se puede romper. */
  vulnerable: boolean;
  defeated: boolean;
}

/** Id del jefe que hay que pelear ahora mismo, si el evento obliga a alguno. */
export type ImminentBoss = 'lunatic_cultist' | 'moon_lord' | null;

/**
 * El evento lunar, que es el final del juego.
 *
 * A partir de Golem, cada bicho de la Mazmorra tiene un 1% de traer al Cultista
 * Lunatico. Matarlo abre los cuatro pilares celestiales como zonas temporales;
 * cada uno pide mil bichos para bajarle el escudo y despues se rompe (el pilar
 * no devuelve dano: la pelea es contra el contador, no contra el). Con los
 * cuatro caidos arranca una cuenta atras y baja el Senor de la Luna, y de esa
 * pelea no se sale huyendo.
 */
export class LunarEvent {
  stage: LunarStage = LunarStage.Idle;
  /** Bichos matados en cada pilar, por id de pilar. */
  readonly kills = new Map<string, number>();
  readonly defeated = new Set<string>();
  /** Ms que faltan para que baje el Senor de la Luna. */
  countdownMs = 0;

  get pillars(): PillarDef[] {
    return PillarList;
  }

  get isActive(): boolean {
    return this.stage !== LunarStage.Idle && this.stage !== LunarStage.Done;
  }

  /** Los pilares estan abiertos como zonas. */
  get pillarsOpen(): boolean {
    return this.stage === LunarStage.Pillars;
  }

  get cleared(): boolean {
    return this.stage === LunarStage.Done;
  }

  /** Jefe que el evento obliga a pelear, con la pestana de Jefes en primer plano. */
  get imminent(): ImminentBoss {
    if (this.stage === LunarStage.CultistImminent) return 'lunatic_cultist';
    if (this.stage === LunarStage.MoonLordImminent) return 'moon_lord';
    return null;
  }

  killsOf(pillarId: string): number {
    return this.kills.get(pillarId) ?? 0;
  }

  pillarViews(): PillarView[] {
    return PillarList.map((pillar) => {
      const kills = this.killsOf(pillar.id);
      return {
        ...pillar,
        kills,
        required: PILLAR_KILLS_REQUIRED,
        vulnerable: kills >= PILLAR_KILLS_REQUIRED,
        defeated: this.defeated.has(pillar.id),
      };
    });
  }

  get pillarsDown(): number {
    return this.defeated.size;
  }

  // ------------------------------------------------------------------ disparadores
  /**
   * Se llama al matar un bicho. La Mazmorra es la que puede traer al Cultista;
   * en un pilar, cuenta para su escudo.
   */
  onEnemyDefeated(zoneId: string): void {
    if (this.stage === LunarStage.Pillars) {
      const pillar = pillarOfZone(zoneId);
      if (pillar && !this.defeated.has(pillar.id)) {
        const before = this.killsOf(pillar.id);
        if (before < PILLAR_KILLS_REQUIRED) {
          const after = before + 1;
          this.kills.set(pillar.id, after);
          if (after === PILLAR_KILLS_REQUIRED) {
            App.game.notifier.push(
              `El escudo del ${pillar.name} ha caido`,
              'achievement',
              pillar.sprite,
            );
          }
          GameEvents.notify('lunar');
        }
      }
      return;
    }

    if (this.stage !== LunarStage.Idle) return;
    if (zoneId !== 'dungeon') return;
    // El Cultista solo aparece cuando Golem ya ha caido: antes de eso la
    // Mazmorra sigue siendo una zona normal.
    if (App.game.statistics.defeatsOf('golem') === 0) return;
    if (Math.random() >= CULTIST_SPAWN_CHANCE) return;

    this.stage = LunarStage.CultistImminent;
    App.game.notifier.push(
      'Los cultistas se reunen ante la Mazmorra. El Cultista Lunatico ha aparecido.',
      'warning',
      'Lunatic_Cultist',
    );
    GameEvents.notifySync('lunar', 'boss');
  }

  /** El Cultista ha caido: se abren los cuatro pilares. */
  onCultistDefeated(): void {
    if (this.stage !== LunarStage.CultistImminent) return;
    this.stage = LunarStage.Pillars;
    this.kills.clear();
    this.defeated.clear();
    App.game.notifier.push(
      'Cuatro pilares celestiales han caido sobre el mundo. Mil bichos en cada uno.',
      'achievement',
      'Solar_Pillar',
    );
    GameEvents.notifySync('lunar', 'zone', 'boss');
  }

  /** Un pilar roto. Con los cuatro arranca la cuenta atras. */
  onPillarDefeated(bossId: string): void {
    const pillar = pillarOfBoss(bossId);
    if (!pillar || this.stage !== LunarStage.Pillars) return;
    this.defeated.add(pillar.id);

    if (this.defeated.size < PillarList.length) {
      const left = PillarList.length - this.defeated.size;
      App.game.notifier.push(
        `${pillar.name} destruido. Quedan ${left}.`,
        'achievement',
        pillar.sprite,
      );
      GameEvents.notifySync('lunar', 'zone');
      return;
    }

    this.startCountdown(MOON_LORD_COUNTDOWN_MS);
  }

  /** El Senor de la Luna ha caido: fin del evento. */
  onMoonLordDefeated(): void {
    if (this.stage === LunarStage.Done) return;
    this.stage = LunarStage.Done;
    this.countdownMs = 0;
    App.game.notifier.push(
      'El Senor de la Luna ha caido. La Luna queda abierta.',
      'achievement',
      'Moon_Lord',
    );
    GameEvents.notifySync('lunar', 'zone', 'boss');
  }

  /**
   * Te ha matado. El evento se cancela entero: hay que volver a buscar al
   * Cultista en la Mazmorra y volver a tirar los cuatro pilares. Es duro a
   * proposito, y es soportable porque los pilares ya te han dejado entre 20 y 30
   * lingotes de luminita en la mochila: la siguiente intentona se hace con
   * armadura del ultimo tier.
   */
  onMoonLordFled(): void {
    if (this.stage !== LunarStage.MoonLordImminent) return;
    this.stage = LunarStage.Idle;
    this.countdownMs = 0;
    this.kills.clear();
    this.defeated.clear();
    App.game.notifier.push(
      'El Senor de la Luna se retira. El evento se ha cerrado: vuelta a empezar.',
      'warning',
      'Moon_Lord',
    );
    GameEvents.notifySync('lunar', 'zone', 'boss');
  }

  private startCountdown(ms: number): void {
    this.stage = LunarStage.MoonLordCountdown;
    this.countdownMs = ms;
    // Si el jugador esta en un pilar, esa zona ya no existe: se le saca de ahi
    // y se genera objetivo nuevo, porque el que tenia delante era del pilar.
    if (pillarOfZone(App.game.zones.current.id)) {
      App.game.zones.forceTravel('dungeon');
      App.game.battle.reset();
    }
    App.game.notifier.push(
      `El cielo se parte. El Senor de la Luna baja en ${Math.round(ms / 1000)}s.`,
      'warning',
      'Moon_Lord',
    );
    GameEvents.notifySync('lunar', 'zone', 'boss');
  }

  // ------------------------------------------------------------------ bucle
  tick(deltaMs: number): void {
    if (this.stage !== LunarStage.MoonLordCountdown) return;
    this.countdownMs -= deltaMs;
    if (this.countdownMs > 0) {
      GameEvents.notify('lunar');
      return;
    }
    this.countdownMs = 0;
    this.stage = LunarStage.MoonLordImminent;
    App.game.notifier.push('El Senor de la Luna esta aqui.', 'warning', 'Moon_Lord');
    GameEvents.notifySync('lunar', 'boss');
    // Se entra a la pelea sola: es lo que significa "inminente".
    App.game.bosses.summonFromEvent('moon_lord');
  }

  // ------------------------------------------------------------------ save
  toJSON(): LunarSave {
    return {
      stage: this.stage,
      kills: Object.fromEntries(this.kills),
      defeated: [...this.defeated],
      countdownMs: Math.round(this.countdownMs),
    };
  }

  fromJSON(save: LunarSave | undefined): void {
    const stages = Object.values(LunarStage) as string[];
    this.stage = stages.includes(save?.stage ?? '')
      ? (save?.stage as LunarStage)
      : LunarStage.Idle;
    this.kills.clear();
    for (const [id, amount] of Object.entries(save?.kills ?? {})) {
      if (PillarList.some((pillar) => pillar.id === id) && typeof amount === 'number') {
        this.kills.set(id, Math.max(0, Math.floor(amount)));
      }
    }
    this.defeated.clear();
    for (const id of save?.defeated ?? []) {
      if (PillarList.some((pillar) => pillar.id === id)) this.defeated.add(id);
    }
    this.countdownMs = Math.max(0, save?.countdownMs ?? 0);
    // Una partida guardada en mitad de la cuenta atras no debe reanudarse con
    // el jefe encima al segundo de abrir la pestana: se le devuelve el margen.
    if (this.stage === LunarStage.MoonLordCountdown && this.countdownMs < MOON_LORD_RETRY_MS) {
      this.countdownMs = MOON_LORD_RETRY_MS;
    }
    // Igual con "inminente": se vuelve a la cuenta atras en vez de arrancar la
    // pelea antes de que el jugador haya visto la pantalla.
    if (this.stage === LunarStage.MoonLordImminent) {
      this.stage = LunarStage.MoonLordCountdown;
      this.countdownMs = MOON_LORD_RETRY_MS;
    }
  }
}
