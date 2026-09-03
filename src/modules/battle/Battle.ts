import { App } from '../App';
import { EquipmentSlot, NO_MANA_DAMAGE_FACTOR, TargetKind, ToolKind } from '../GameConstants';
import { GameEvents } from '../GameEvents';
import { clamp, randomInt, weightedPick } from '../GameHelper';
import { getEnemy, type EnemyDef } from '../combat/EnemyList';
import { getNode, type GatherNodeDef } from '../gathering/GatherNode';
import { getItem } from '../items/ItemList';
import type { DropDef } from '../items/ItemType';
import type { ZoneDef } from '../zones/ZoneList';

/** Objetivo actual de la zona: un bloque que picar o un enemigo que matar. */
export interface BattleTarget {
  kind: TargetKind;
  id: string;
  name: string;
  /** Nombre del sprite en public/assets. */
  sprite: string;
  health: number;
  maxHealth: number;
  /** Solo para nodos: herramienta y potencia necesarias. */
  tool?: ToolKind;
  toolPower?: number;
}

/** Numerito flotante de dano, para el feedback visual del click. */
export interface DamageSplat {
  id: number;
  amount: number;
  critical: boolean;
  x: number;
  y: number;
}

export interface LootLine {
  id: number;
  itemId: string;
  amount: number;
  rare: boolean;
}

const CRIT_CHANCE = 0.08;
const CRIT_MULTIPLIER = 2.5;
/** Un objetivo que sigue sin poderse romper se descarta solo pasado este tiempo. */
const BLOCKED_SKIP_MS = 2500;


/**
 * Dano de un click contando el mana. Un arma magica a plena carga pega fuerte,
 * pero sin mana el golpe se queda en una fraccion: nunca te bloquea, solo te
 * obliga a esperar la regeneracion o a beber una pocion de mana.
 */
export function resolveClickDamage(critChance: number, critMultiplier: number): {
  damage: number;
  critical: boolean;
  outOfMana: boolean;
} {
  const player = App.game.player;
  const stats = player.stats;
  const powered = stats.manaCost <= 0 || player.spendMana(stats.manaCost);
  const critical = Math.random() < critChance;

  let damage = stats.clickDamage;
  if (!powered) damage *= NO_MANA_DAMAGE_FACTOR;
  if (critical) damage *= critMultiplier;

  return { damage: Math.max(1, Math.round(damage)), critical, outOfMana: !powered };
}

/**
 * Estado de la zona activa: genera objetivos, aplica el dano de los clicks y del
 * DPS pasivo, y reparte el botin. Es el analogo de Battle.ts en pokeclicker.
 */
export class Battle {
  target: BattleTarget | null = null;
  splats: DamageSplat[] = [];
  loot: LootLine[] = [];
  /** Motivo por el que no se puede danar el objetivo actual, si lo hay. */
  blockedReason: string | null = null;
  /** El ultimo golpe salio flojo por falta de mana. */
  outOfMana = false;

  private splatSeq = 0;
  private lootSeq = 0;
  /** Tiempo que lleva el objetivo actual sin poder ser danado. */
  private blockedFor = 0;
  /** Multiplicador de botin del golpe en curso. Solo lo mueven los explosivos. */
  private lootMultiplier = 1;

  /** Genera el primer objetivo o cambia de zona. */
  reset(): void {
    this.target = null;
    this.spawn();
  }

  /**
   * Genera el siguiente objetivo. El orden de preferencia importa: si en la zona
   * no hay ni un solo nodo que la herramienta alcance, se ofrece un enemigo
   * antes que un bloque imposible. Sin eso, entrar en el Templo con el mejor
   * pico fabricable te dejaba en un bucle de bloques que no podias tocar.
   */
  spawn(): void {
    const zone = App.game.zones.current;
    // Con una invasion en marcha no salen bloques: lo que hay que hacer es
    // matar oleadas, y un nodo en medio solo la alarga.
    const invading = App.game.invasions.enemyPool() !== null;
    const wantsEnemy = invading || (zone.enemies.length > 0 && Math.random() < zone.enemyRate);

    const target = wantsEnemy ? this.spawnEnemy(zone) : this.spawnNode(zone);
    this.target =
      target ??
      this.spawnNode(zone) ??
      this.spawnEnemy(zone) ??
      // Ultimo recurso: la zona solo tiene nodos y ninguno se puede romper. Se
      // ensena el mas facil con su aviso, que al menos dice que falta.
      this.spawnNode(zone, false);
    this.refreshBlockedReason();
    GameEvents.notify('battle');
  }

  /**
   * Un enemigo de la zona, o de la invasion si hay una en marcha: mientras dura,
   * la oleada sustituye la fauna del bioma en el que estes, sea cual sea. El
   * mundo entero esta invadido, y asi el evento no te obliga a mudarte.
   */
  private spawnEnemy(zone: ZoneDef): BattleTarget | null {
    const invasion = App.game.invasions.enemyPool();
    const ids = invasion ?? zone.enemies;
    const picked = weightedPick(ids.map(getEnemy));
    if (!picked) return null;
    const health = Math.round(picked.health * (invasion ? App.game.invasions.healthMultiplier : 1));
    return {
      kind: TargetKind.Enemy,
      id: picked.id,
      name: picked.name,
      sprite: picked.sprite,
      health,
      maxHealth: health,
    };
  }

  /**
   * Un nodo de la zona. Con `onlyReachable` (el caso normal) solo se ofrece lo
   * que el equipo actual puede romper: que salga un bloque imposible no ensena
   * nada y solo obliga a saltarlo. Devuelve null si no queda ninguno.
   */
  private spawnNode(zone: ZoneDef, onlyReachable = true): BattleTarget | null {
    const all = zone.nodes.map(getNode);
    const pool = onlyReachable
      ? all.filter((node) => this.canBreak(node.tool, node.toolPower))
      : all;
    const picked =
      weightedPick(pool) ?? [...pool].sort((a, b) => a.toolPower - b.toolPower)[0];
    if (!picked) return null;
    return {
      kind: TargetKind.Node,
      id: picked.id,
      name: getItem(picked.itemId).name,
      sprite: picked.itemId,
      health: picked.health,
      maxHealth: picked.health,
      tool: picked.tool,
      toolPower: picked.toolPower,
    };
  }

  /**
   * Pieza equipada con la que se golpea el objetivo actual. La UI la usa como
   * cursor: pico en las vetas, hacha en los arboles y espada en los enemigos.
   */
  get cursorSprite(): string | null {
    const target = this.target;
    if (!target) return null;
    const player = App.game.player;
    if (target.kind === TargetKind.Enemy) {
      return player.equippedIn(EquipmentSlot.Weapon) ?? null;
    }
    return target.tool === ToolKind.Axe
      ? (player.equippedIn(EquipmentSlot.Axe) ?? null)
      : (player.equippedIn(EquipmentSlot.Pickaxe) ?? null);
  }

  /** Potencia actual de la herramienta frente a la que exige un nodo. */
  private canBreak(tool: ToolKind, needed: number): boolean {
    const { pickPower, axePower } = App.game.player.stats;
    return (tool === ToolKind.Axe ? axePower : pickPower) >= needed;
  }

  /** Comprueba si el equipo actual permite danar el objetivo. */
  private refreshBlockedReason(): void {
    const target = this.target;
    if (!target || target.kind !== TargetKind.Node) {
      this.blockedReason = null;
      this.blockedFor = 0;
      return;
    }
    const needed = target.toolPower ?? 0;
    const tool = target.tool ?? ToolKind.Pickaxe;
    if (this.canBreak(tool, needed)) {
      this.blockedReason = null;
      this.blockedFor = 0;
      return;
    }
    const { pickPower, axePower } = App.game.player.stats;
    this.blockedReason =
      tool === ToolKind.Axe
        ? `Necesitas un hacha de potencia ${needed} (tienes ${axePower})`
        : `Necesitas un pico de potencia ${needed} (tienes ${pickPower})`;
  }

  /** Click del jugador sobre el objetivo. `x`/`y` son 0-100 dentro del area. */
  click(x = 50, y = 50): void {
    App.game.statistics.clicks += 1;
    if (!this.target || this.blockedReason) {
      GameEvents.notify('battle', 'statistics');
      return;
    }

    const { damage, critical, outOfMana } = resolveClickDamage(CRIT_CHANCE, CRIT_MULTIPLIER);
    this.outOfMana = outOfMana;

    this.pushSplat(damage, critical, x, y);
    this.damage(damage);
    GameEvents.notifySync('battle', 'statistics', 'player');
  }

  /** Avance del bucle de juego: DPS pasivo y reaparicion. */
  tick(deltaMs: number): void {
    if (!this.target) return;

    // Un objetivo que no se puede romper no debe congelar la zona: se reevalua
    // (por si acaba de cambiar el equipo) y, si sigue bloqueado, se descarta.
    if (this.blockedReason) {
      this.refreshBlockedReason();
      if (this.blockedReason) {
        this.blockedFor += deltaMs;
        if (this.blockedFor >= BLOCKED_SKIP_MS) this.skip();
        return;
      }
    }

    const dps = App.game.player.stats.autoDps;
    if (dps <= 0) return;
    this.damage((dps * deltaMs) / 1000);
    GameEvents.notify('battle');
  }

  private damage(amount: number): void {
    const target = this.target;
    if (!target) return;
    target.health = clamp(target.health - amount, 0, target.maxHealth);
    App.game.statistics.totalDamage += amount;
    if (target.health <= 0) this.defeat(target);
  }

  private defeat(target: BattleTarget): void {
    const { statistics, wallet, inventory } = App.game;
    const luck = App.game.player.stats.luck;
    const coinBonus = 1 + App.game.player.stats.coinBonus;

    let drops: DropDef[];
    let coins: [number, number];

    if (target.kind === TargetKind.Enemy) {
      const enemy: EnemyDef = getEnemy(target.id);
      drops = enemy.drops;
      coins = enemy.coins;
      statistics.addKill(enemy.id);
      // Cada muerte pasa por los eventos: en la Mazmorra puede traer al
      // Cultista, en un pilar cuenta para bajarle el escudo, y durante una
      // invasion cuenta para su oleada.
      App.game.lunar.onEnemyDefeated(App.game.zones.current.id);
      App.game.invasions.onEnemyDefeated();
    } else {
      const node: GatherNodeDef = getNode(target.id);
      drops = node.drops;
      coins = node.coins;
      statistics.nodesBroken += 1;
    }

    for (const drop of drops) {
      const chance = drop.affectedByLuck ? drop.chance * (1 + luck) : drop.chance;
      if (Math.random() > chance) continue;
      const amount = randomInt(drop.min, drop.max) * this.lootMultiplier;
      if (amount <= 0) continue;
      inventory.gain(drop.itemId, amount, true);
      statistics.addGathered(drop.itemId, amount);
      this.pushLoot(drop.itemId, amount, chance < 0.1);
    }

    wallet.gain(randomInt(coins[0], coins[1]) * coinBonus);

    App.game.achievements.check();
    this.spawn();
    GameEvents.notify('battle', 'inventory', 'statistics');
  }

  /**
   * Revienta el nodo actual y reparte su botin multiplicado, sin tocar la
   * potencia de la herramienta: es lo que hacen la bomba y la dinamita. Sobre un
   * enemigo no hace nada, igual que en Terraria un explosivo no mina un bicho.
   */
  blastNode(lootMultiplier = 1): boolean {
    const target = this.target;
    if (!target || target.kind !== TargetKind.Node) return false;
    this.lootMultiplier = lootMultiplier;
    // El aviso de bloqueo sobra: la bomba no necesita pico.
    this.blockedReason = null;
    this.blockedFor = 0;
    this.damage(target.maxHealth);
    this.lootMultiplier = 1;
    GameEvents.notifySync('battle', 'inventory');
    return true;
  }

  /** Fuerza un objetivo nuevo sin recompensa. Util cuando el equipo no basta. */
  skip(): void {
    this.blockedReason = null;
    this.blockedFor = 0;
    this.spawn();
    GameEvents.notifySync('battle');
  }

  /** Reevalua el bloqueo tras cambiar de equipo. */
  onEquipmentChanged(): void {
    this.refreshBlockedReason();
    GameEvents.notify('battle');
  }

  private pushSplat(amount: number, critical: boolean, x: number, y: number): void {
    this.splatSeq += 1;
    this.splats = [...this.splats.slice(-14), { id: this.splatSeq, amount, critical, x, y }];
  }

  private pushLoot(itemId: string, amount: number, rare: boolean): void {
    this.lootSeq += 1;
    this.loot = [{ id: this.lootSeq, itemId, amount, rare }, ...this.loot].slice(0, 8);
  }

  /** Retira un numerito de dano ya animado. */
  clearSplat(id: number): void {
    this.splats = this.splats.filter((splat) => splat.id !== id);
    GameEvents.notify('battle');
  }
}
