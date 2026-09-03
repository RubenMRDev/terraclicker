import { App } from '../App';
import { GameEvents } from '../GameEvents';
import { getItem } from '../items/ItemList';
import { randomInt } from '../GameHelper';
import { allMet, progressOf, type RequirementProgress } from '../requirements/Requirement';
import {
  InvasionList,
  getInvasion,
  totalKills,
  type InvasionDef,
  type WaveDef,
} from './InvasionList';

export interface InvasionsSave {
  active: string | null;
  wave: number;
  kills: number;
  bossReady: boolean;
  cleared: string[];
  completions: Record<string, number>;
}

export interface InvasionView {
  invasion: InvasionDef;
  available: boolean;
  requirements: RequirementProgress[];
  /** Ya se ha completado alguna vez: repetirla cuesta su objeto. */
  cleared: boolean;
  completions: number;
  /** Se puede lanzar ahora mismo. */
  canStart: boolean;
  /** Por que no, si no se puede. */
  blocked: string | null;
}

/**
 * Las invasiones: ejercito de duendes, legion de escarcha, eclipse solar, luna
 * de escarcha y locura marciana.
 *
 * Mientras una esta activa sustituye la fauna de la zona en la que estes, sea
 * cual sea: el mundo entero esta invadido, y asi el evento no te obliga a
 * mudarte a una zona concreta. Se avanza por oleadas de bichos, y las que
 * tienen jefe lo dejan invocable al terminar la ultima.
 */
export class Invasions {
  active: InvasionDef | null = null;
  /** Indice de la oleada en curso. */
  wave = 0;
  /** Bichos matados en la oleada en curso. */
  kills = 0;
  /** Oleadas superadas: el jefe final ya se puede pelear. */
  bossReady = false;
  /** Invasiones completadas al menos una vez. */
  readonly cleared = new Set<string>();
  private readonly completions = new Map<string, number>();

  get all(): InvasionDef[] {
    return InvasionList;
  }

  get isActive(): boolean {
    return this.active !== null;
  }

  /** Oleada en curso, si hay invasion. */
  get currentWave(): WaveDef | null {
    if (!this.active) return null;
    return this.active.waves[Math.min(this.wave, this.active.waves.length - 1)] ?? null;
  }

  /** Bichos que faltan en la oleada actual. */
  get killsLeft(): number {
    // Con el jefe ya disponible no falta ningun bicho: la ultima oleada dejo el
    // contador a cero pero `wave` sigue apuntando a ella.
    if (this.bossReady) return 0;
    const wave = this.currentWave;
    return wave ? Math.max(0, wave.kills - this.kills) : 0;
  }

  /** Progreso total del evento, de 0 a 1. */
  get progress(): number {
    if (!this.active) return 0;
    // Al superar la ultima oleada `kills` vuelve a cero y `wave` se queda en la
    // ultima, asi que el calculo de abajo se dejaba fuera esa oleada entera y la
    // barra se quedaba clavada en el 68%.
    if (this.bossReady) return 1;
    const done =
      this.active.waves.slice(0, this.wave).reduce((sum, wave) => sum + wave.kills, 0) + this.kills;
    return Math.min(1, done / totalKills(this.active));
  }

  completionsOf(invasionId: string): number {
    return this.completions.get(invasionId) ?? 0;
  }

  /**
   * Fauna que sustituye a la de la zona. null = no hay invasion, o la invasion
   * espera a que peleen con su jefe.
   */
  enemyPool(): string[] | null {
    if (!this.active || this.bossReady) return null;
    return this.currentWave?.enemies ?? null;
  }

  /** Multiplicador de vida de la oleada en curso. */
  get healthMultiplier(): number {
    return this.currentWave?.healthMultiplier ?? 1;
  }

  // ------------------------------------------------------------------ arrancar
  views(): InvasionView[] {
    return InvasionList.map((invasion) => {
      const available = allMet(invasion.unlock);
      return {
        invasion,
        available,
        requirements: progressOf(invasion.unlock),
        cleared: this.cleared.has(invasion.id),
        completions: this.completionsOf(invasion.id),
        canStart: this.startBlockedReason(invasion.id) === null,
        blocked: this.startBlockedReason(invasion.id),
      };
    });
  }

  /** Por que no se puede lanzar una invasion, o null si se puede. */
  startBlockedReason(invasionId: string): string | null {
    const invasion = getInvasion(invasionId);
    if (this.active) return `${this.active.name} sigue en marcha`;
    if (App.game.bosses.isFighting) return 'Estas en una pelea';
    if (App.game.lunar.isActive) return 'El evento lunar tiene prioridad';
    if (!allMet(invasion.unlock)) return 'Todavia no te ha llegado el turno';
    // La primera vez la invasion "pasa" sola y sale gratis; repetirla cuesta.
    if (this.cleared.has(invasionId) && !App.game.inventory.has(invasion.triggerItem)) {
      return `Necesitas ${getItem(invasion.triggerItem).name}`;
    }
    return null;
  }

  start(invasionId: string): boolean {
    if (this.startBlockedReason(invasionId) !== null) return false;
    const invasion = getInvasion(invasionId);

    // Solo se cobra a partir de la segunda vez.
    if (this.cleared.has(invasionId) && !App.game.inventory.remove(invasion.triggerItem)) {
      return false;
    }

    this.active = invasion;
    this.wave = 0;
    this.kills = 0;
    this.bossReady = false;
    App.game.notifier.push(`${invasion.name}: primera oleada`, 'warning', invasion.sprite);
    App.game.battle.reset();
    GameEvents.notifySync('invasions', 'battle', 'inventory');
    return true;
  }

  /** Abandona la invasion en curso. No devuelve el objeto: huir cuesta. */
  abandon(): void {
    if (!this.active) return;
    const name = this.active.name;
    this.active = null;
    this.wave = 0;
    this.kills = 0;
    this.bossReady = false;
    App.game.notifier.push(`${name} abandonada`, 'warning');
    App.game.battle.reset();
    GameEvents.notifySync('invasions', 'battle');
  }

  // ------------------------------------------------------------------ progreso
  /** Cada bicho muerto cuenta para la oleada. La llama Battle al matar algo. */
  onEnemyDefeated(): void {
    if (!this.active || this.bossReady) return;
    const wave = this.currentWave;
    if (!wave) return;

    this.kills += 1;
    if (this.kills < wave.kills) {
      GameEvents.notify('invasions');
      return;
    }

    // Oleada superada.
    this.kills = 0;
    const last = this.active.waves.length - 1;
    if (this.wave < last) {
      this.wave += 1;
      App.game.notifier.push(
        `${this.active.name}: oleada ${this.wave + 1} de ${this.active.waves.length}`,
        'warning',
        this.active.sprite,
      );
      GameEvents.notifySync('invasions', 'battle');
      return;
    }

    // Ultima oleada superada: o llega el jefe, o el evento se cierra ya.
    if (this.active.finalBoss) {
      this.bossReady = true;
      App.game.notifier.push(
        `Las oleadas han caido. Sale ${App.game.bosses.name(this.active.finalBoss)}.`,
        'achievement',
        this.active.sprite,
      );
      GameEvents.notifySync('invasions', 'battle', 'boss');
      return;
    }
    this.complete();
  }

  /** El jefe final ha caido. Lo llama Bosses al ganar. */
  onBossDefeated(bossId: string): void {
    if (!this.active || this.active.finalBoss !== bossId) return;
    this.complete();
  }

  private complete(): void {
    const invasion = this.active;
    if (!invasion) return;

    const luck = App.game.player.stats.luck;
    const coinBonus = 1 + App.game.player.stats.coinBonus;
    for (const drop of invasion.rewards) {
      const chance = drop.affectedByLuck ? drop.chance * (1 + luck) : drop.chance;
      if (Math.random() > chance) continue;
      const amount = randomInt(drop.min, drop.max);
      if (amount <= 0) continue;
      App.game.inventory.gain(drop.itemId, amount, true);
      App.game.statistics.addGathered(drop.itemId, amount);
    }
    App.game.wallet.gain(Math.floor(randomInt(invasion.coins[0], invasion.coins[1]) * coinBonus));

    this.cleared.add(invasion.id);
    this.completions.set(invasion.id, this.completionsOf(invasion.id) + 1);
    this.active = null;
    this.wave = 0;
    this.kills = 0;
    this.bossReady = false;

    App.game.notifier.push(`${invasion.name} repelida. Botin en la mochila.`, 'achievement', invasion.sprite);
    App.game.achievements.check();
    App.game.battle.reset();
    App.game.save.save();
    GameEvents.notifySync('invasions', 'battle', 'inventory', 'wallet', 'statistics');
  }

  // ------------------------------------------------------------------ save
  toJSON(): InvasionsSave {
    return {
      active: this.active?.id ?? null,
      wave: this.wave,
      kills: this.kills,
      bossReady: this.bossReady,
      cleared: [...this.cleared],
      completions: Object.fromEntries(this.completions),
    };
  }

  fromJSON(save: InvasionsSave | undefined): void {
    this.cleared.clear();
    this.completions.clear();
    for (const id of save?.cleared ?? []) {
      if (InvasionList.some((invasion) => invasion.id === id)) this.cleared.add(id);
    }
    for (const [id, count] of Object.entries(save?.completions ?? {})) {
      if (typeof count === 'number') this.completions.set(id, Math.max(0, Math.floor(count)));
    }

    const active = InvasionList.find((invasion) => invasion.id === save?.active);
    this.active = active ?? null;
    this.wave = active ? Math.min(Math.max(0, save?.wave ?? 0), active.waves.length - 1) : 0;
    this.kills = Math.max(0, save?.kills ?? 0);
    this.bossReady = Boolean(save?.bossReady) && Boolean(active?.finalBoss);
  }
}
