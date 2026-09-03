import { App } from '../App';
import { BossPhase, IN_COMBAT_REGEN } from '../GameConstants';
import { resolveClickDamage } from '../battle/Battle';
import { GameEvents } from '../GameEvents';
import { clamp, randomInt } from '../GameHelper';
import { getItem } from '../items/ItemList';
import { BossList, getBoss, type BossDef, type BossPhaseDef } from './BossList';

export interface BossHit {
  id: number;
  amount: number;
  critical: boolean;
  x: number;
  y: number;
}

export interface BossLogLine {
  id: number;
  text: string;
  tone: 'info' | 'damage' | 'reward' | 'phase';
}

const CRIT_CHANCE = 0.1;
const CRIT_MULTIPLIER = 2.5;

/**
 * Gestor de bossfights. Solo puede haber una activa; el jefe pega cada X ms al
 * jugador y el jugador responde a clicks mas el DPS pasivo del equipo.
 *
 * Hay dos formas de empezar una: gastando el objeto de invocacion en la zona
 * del jefe, o porque el evento lunar la impone (`summonFromEvent`). En el
 * segundo caso no hay objeto que gastar ni, por tanto, que devolver.
 */
export class Bosses {
  state: BossPhase = BossPhase.Idle;
  boss: BossDef | null = null;
  health = 0;
  hits: BossHit[] = [];
  log: BossLogLine[] = [];
  /** Fase activa y ms que faltan para el siguiente ataque, para la barra de aviso. */
  phase: BossPhaseDef | null = null;
  nextAttackIn = 0;
  /** El ultimo golpe salio flojo por falta de mana. */
  outOfMana = false;

  private hitSeq = 0;
  private logSeq = 0;
  private phaseIndex = 0;
  /**
   * Objeto que se gasto al invocar, si se gasto alguno. Es lo que se devuelve al
   * perder o al huir; una pelea impuesta por el evento no gasta nada, asi que
   * aqui queda null y no se regala una invocacion de balde.
   */
  private consumedItem: string | null = null;

  get all(): BossDef[] {
    return Object.values(BossList);
  }

  name(bossId: string): string {
    return BossList[bossId]?.name ?? bossId;
  }

  bossesOfZone(zoneId: string): BossDef[] {
    return this.all.filter((boss) => boss.zoneId === zoneId);
  }

  get isFighting(): boolean {
    return this.state === BossPhase.Fighting;
  }

  get healthPercent(): number {
    return this.boss ? (this.health / this.boss.health) * 100 : 0;
  }

  /**
   * Si se puede abandonar la pelea. Del Senor de la Luna traido por el evento no
   * se sale huyendo: por eso se llama inminente.
   */
  get canFlee(): boolean {
    if (!this.boss) return true;
    return !(this.boss.id === 'moon_lord' && this.consumedItem === null);
  }

  canSummon(bossId: string): boolean {
    return this.summonBlockedReason(bossId) === null;
  }

  /**
   * Por que no se puede invocar a un jefe ahora mismo, para que el boton diga
   * algo mejor que quedarse gris. null = se puede.
   */
  summonBlockedReason(bossId: string): string | null {
    const boss = getBoss(bossId);
    const { zones, inventory, lunar, statistics, invasions } = App.game;

    if (this.state === BossPhase.Fighting) return 'Ya estas en una pelea';

    if (boss.pillarId) {
      if (!lunar.pillarsOpen) return 'Solo durante el evento lunar';
      if (zones.current.id !== boss.zoneId) return `Tienes que estar en el ${boss.name}`;
      const kills = lunar.killsOf(boss.pillarId);
      const required = boss.shieldKills ?? 0;
      if (kills < required) return `Escudo activo: ${kills}/${required} bichos`;
      return null;
    }

    if (boss.invasionId) {
      if (invasions.active?.id !== boss.invasionId) return `Solo durante ${boss.name}`;
      if (!invasions.bossReady) {
        const wave = invasions.currentWave;
        return `Aguanta las oleadas: faltan ${invasions.killsLeft} de ${wave?.kills ?? 0}`;
      }
      return null;
    }

    if (bossId === 'lunatic_cultist') {
      if (lunar.imminent !== 'lunatic_cultist') return 'Aparece solo, en la Mazmorra';
      if (zones.current.id !== boss.zoneId) return 'Vuelve a la Mazmorra';
      return null;
    }

    // Al Senor de la Luna se llega por el evento; despues ya se le puede repetir
    // con un sello celestial, como en Terraria.
    if (bossId === 'moon_lord' && statistics.defeatsOf('moon_lord') === 0) {
      return 'Solo llega al final del evento lunar';
    }

    if (!boss.summonItem) return 'No se invoca a mano';
    if (!inventory.has(boss.summonItem)) return `Necesitas ${getItem(boss.summonItem).name}`;
    if (zones.current.id !== boss.zoneId) return `Se invoca en ${zones.nameOf(boss.zoneId)}`;
    return null;
  }

  /** Consume el objeto de invocacion y empieza la pelea. */
  summon(bossId: string): boolean {
    const boss = getBoss(bossId);
    if (!this.canSummon(bossId)) return false;

    // Los pilares, el Cultista y los jefes de invasion no cuestan objeto: los
    // abre el evento.
    let consumed: string | null = null;
    if (boss.summonItem && !boss.pillarId && !boss.invasionId && bossId !== 'lunatic_cultist') {
      if (!App.game.inventory.remove(boss.summonItem)) return false;
      consumed = boss.summonItem;
    }

    this.begin(boss, consumed);
    GameEvents.notifySync('boss', 'inventory', 'player');
    return true;
  }

  /**
   * Arranca una pelea impuesta por el evento lunar: sin objeto y sin mirar la
   * zona, porque es el jefe el que viene a ti.
   */
  summonFromEvent(bossId: string): boolean {
    if (this.state === BossPhase.Fighting) return false;
    this.begin(getBoss(bossId), null);
    GameEvents.notifySync('boss', 'player');
    return true;
  }

  private begin(boss: BossDef, consumedItem: string | null): void {
    App.game.player.fullHeal();
    App.game.statistics.addBossAttempt(boss.id);

    this.boss = boss;
    this.health = boss.health;
    this.state = BossPhase.Fighting;
    this.phaseIndex = 0;
    this.phase = boss.phases[0] ?? null;
    this.nextAttackIn = boss.attackIntervalMs;
    this.hits = [];
    this.log = [];
    this.consumedItem = consumedItem;
    this.pushLog(this.phase?.taunt ?? `${boss.name} aparece.`, 'phase');
  }

  /** Click del jugador sobre el jefe. */
  click(x = 50, y = 50): void {
    if (!this.isFighting || !this.boss) return;
    App.game.statistics.clicks += 1;

    const { damage, critical, outOfMana } = resolveClickDamage(CRIT_CHANCE, CRIT_MULTIPLIER);
    this.outOfMana = outOfMana;

    this.hitSeq += 1;
    this.hits = [...this.hits.slice(-14), { id: this.hitSeq, amount: damage, critical, x, y }];
    this.dealDamage(damage);
    GameEvents.notifySync('boss', 'statistics', 'player');
  }

  tick(deltaMs: number): void {
    if (!this.isFighting || !this.boss) return;

    // DPS pasivo del equipo.
    const dps = App.game.player.stats.autoDps;
    if (dps > 0) this.dealDamage((dps * deltaMs) / 1000);
    if (!this.isFighting || !this.boss) return;

    // Regeneracion reducida durante la pelea.
    const regen = IN_COMBAT_REGEN + App.game.player.stats.regen;
    App.game.player.heal((regen * deltaMs) / 1000);

    // Un pilar no responde: no hay ni ataques que contar.
    if (this.boss.harmless) {
      GameEvents.notify('boss');
      return;
    }

    // Ataque del jefe. Es un while y no un if: si un frame llega tarde (pestana
    // en segundo plano) el jefe no se salta los ataques que tocaban.
    this.nextAttackIn -= deltaMs;
    while (this.nextAttackIn <= 0 && this.isFighting) {
      const speed = this.phase?.speedMultiplier ?? 1;
      this.nextAttackIn += this.boss.attackIntervalMs / speed;
      this.attackPlayer();
    }
    GameEvents.notify('boss');
  }

  private attackPlayer(): void {
    if (!this.boss) return;
    const raw = this.boss.damage * (this.phase?.damageMultiplier ?? 1);
    const taken = App.game.player.takeDamage(raw);
    this.pushLog(`${this.boss.name} te golpea: -${taken} PV`, 'damage');
    if (App.game.player.isDead) this.lose();
  }

  private dealDamage(amount: number): void {
    if (!this.boss) return;
    this.health = clamp(this.health - amount, 0, this.boss.health);
    App.game.statistics.totalDamage += amount;
    this.checkPhase();
    if (this.health <= 0) this.win();
  }

  private checkPhase(): void {
    if (!this.boss) return;
    const percent = this.healthPercent;
    // Las fases van de mayor a menor umbral: avanzamos mientras se cumpla la siguiente.
    while (
      this.phaseIndex + 1 < this.boss.phases.length &&
      percent <= this.boss.phases[this.phaseIndex + 1].atHealthPercent
    ) {
      this.phaseIndex += 1;
      this.phase = this.boss.phases[this.phaseIndex];
      this.pushLog(this.phase.taunt, 'phase');
    }
  }

  private win(): void {
    const boss = this.boss;
    if (!boss) return;
    this.state = BossPhase.Won;

    const firstTime = App.game.statistics.defeatsOf(boss.id) === 0;
    const luck = App.game.player.stats.luck;
    const coinBonus = 1 + App.game.player.stats.coinBonus;

    const rolls = firstTime ? [...boss.drops, ...boss.firstClearDrops] : boss.drops;
    for (const drop of rolls) {
      const chance = drop.affectedByLuck ? drop.chance * (1 + luck) : drop.chance;
      if (Math.random() > chance) continue;
      const amount = randomInt(drop.min, drop.max);
      App.game.inventory.gain(drop.itemId, amount, true);
      App.game.statistics.addGathered(drop.itemId, amount);
      this.pushLog(`Botin: ${getItem(drop.itemId).name} x${amount}`, 'reward');
    }

    const coins = Math.floor(randomInt(boss.coins[0], boss.coins[1]) * coinBonus);
    App.game.wallet.gain(coins);
    App.game.statistics.addBossDefeat(boss.id);
    this.pushLog(`${boss.name} derrotado.`, 'reward');
    this.consumedItem = null;

    // El evento lunar avanza de etapa aqui: es su unico disparador de victoria.
    if (boss.id === 'lunatic_cultist') App.game.lunar.onCultistDefeated();
    else if (boss.pillarId) App.game.lunar.onPillarDefeated(boss.id);
    else if (boss.id === 'moon_lord') App.game.lunar.onMoonLordDefeated();
    else if (boss.invasionId) App.game.invasions.onBossDefeated(boss.id);

    App.game.achievements.check();
    App.game.save.save();
    GameEvents.notifySync(
      'boss',
      'inventory',
      'wallet',
      'statistics',
      'zone',
      'lunar',
      'invasions',
    );
  }

  private lose(): void {
    const boss = this.boss;
    this.state = BossPhase.Lost;
    App.game.statistics.deaths += 1;
    // Se devuelve el objeto de invocacion: perder cuesta tiempo, no progreso.
    // Un jefe de evento no gasto ninguno, asi que no hay nada que devolver.
    if (this.consumedItem) {
      App.game.inventory.gain(this.consumedItem, 1, true);
      this.pushLog(`Has caido. Recuperas ${getItem(this.consumedItem).name}.`, 'info');
      this.consumedItem = null;
    } else if (boss?.eventBoss) {
      this.pushLog('Has caido, pero el jefe sigue ahi fuera.', 'info');
    }
    // El Senor de la Luna no se cancela por morir: vuelve con otra cuenta atras.
    if (boss?.id === 'moon_lord') App.game.lunar.onMoonLordFled();
    GameEvents.notifySync('boss', 'inventory', 'player', 'statistics', 'lunar');
  }

  /** Abandona la pelea en curso o cierra la pantalla de resultado. */
  leave(): void {
    if (this.state === BossPhase.Fighting) {
      if (!this.canFlee) {
        App.game.notifier.push('De esta no se huye.', 'warning', this.boss?.sprite);
        return;
      }
      if (this.consumedItem) App.game.inventory.gain(this.consumedItem, 1, true);
    }
    this.consumedItem = null;
    this.state = BossPhase.Idle;
    this.boss = null;
    this.phase = null;
    this.health = 0;
    this.hits = [];
    App.game.player.fullHeal();
    GameEvents.notifySync('boss', 'inventory', 'player');
  }

  private pushLog(text: string, tone: BossLogLine['tone']): void {
    this.logSeq += 1;
    this.log = [{ id: this.logSeq, text, tone }, ...this.log].slice(0, 8);
  }

  clearHit(id: number): void {
    this.hits = this.hits.filter((hit) => hit.id !== id);
    GameEvents.notify('boss');
  }
}
