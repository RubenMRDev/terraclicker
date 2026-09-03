import { App } from '../App';
import { GameEvents } from '../GameEvents';
import { getItem } from '../items/ItemList';
import type { ItemAmount, ItemId, ItemStats } from '../items/ItemType';
import { allMet, progressOf, type RequirementProgress } from '../requirements/Requirement';
import { NpcList, getNpc, type NpcDef, type NpcRole, type ShopEntry } from './NpcList';

export interface NpcsSave {
  houses: number;
  housed: string[];
}

/** Madera de la primera casa. Cada casa siguiente sube en HOUSE_WOOD_STEP. */
export const HOUSE_WOOD_BASE = 120;
export const HOUSE_WOOD_STEP = 40;

/**
 * Cobre por segundo y por vecino que recauda el Recaudador. Es una renta de
 * acompanamiento, no una fuente principal: llega despues de Golem, cuando un
 * jefe ya suelta cientos de miles.
 */
export const TAX_PER_NPC_PER_SECOND = 200;

export interface NpcView {
  npc: NpcDef;
  housed: boolean;
  /** Cumple los requisitos de llegada. */
  available: boolean;
  requirements: RequirementProgress[];
}

/**
 * El pueblo. Construir una casa cuesta madera; un vecino se muda a una casa
 * libre en cuanto cumple su condicion de llegada, y mientras vive ahi aporta su
 * bonificacion pasiva (el equivalente a la felicidad de los NPCs de Terraria).
 */
export class Npcs {
  houses = 0;
  readonly housed = new Set<string>();

  /** Resto de segundo pendiente de la recaudacion, para no perder decimales. */
  private taxCarry = 0;

  get all(): NpcDef[] {
    return NpcList;
  }

  get housedCount(): number {
    return this.housed.size;
  }

  get freeHouses(): number {
    return Math.max(0, this.houses - this.housed.size);
  }

  isHoused(npcId: string): boolean {
    return this.housed.has(npcId);
  }

  nameOf(npcId: string): string {
    return NpcList.find((npc) => npc.id === npcId)?.name ?? npcId;
  }

  /** Vecinos con un oficio concreto, ya mudados. */
  withRole(role: NpcRole): NpcDef[] {
    return NpcList.filter((npc) => this.housed.has(npc.id) && npc.roles.includes(role));
  }

  hasRole(role: NpcRole): boolean {
    return this.withRole(role).length > 0;
  }

  // ------------------------------------------------------------------ casas
  /** Coste de la siguiente casa. La madera sube con cada casa construida. */
  houseCost(): ItemAmount[] {
    return [
      { itemId: 'Wood', amount: HOUSE_WOOD_BASE + HOUSE_WOOD_STEP * this.houses },
      { itemId: 'Torch', amount: 2 },
      { itemId: 'Wooden_Door', amount: 1 },
      { itemId: 'Wooden_Table', amount: 1 },
      { itemId: 'Wooden_Chair', amount: 1 },
    ];
  }

  canBuildHouse(): boolean {
    return App.game.inventory.hasAll(this.houseCost());
  }

  /** Construye una casa vacia gastando la madera y los muebles. */
  buildHouse(): boolean {
    const cost = this.houseCost();
    if (!App.game.inventory.removeAll(cost)) return false;
    this.houses += 1;
    App.game.notifier.push(`Casa ${this.houses} construida`, 'success', 'Wooden_Door');
    // El Guia se muda solo a la primera casa, como en Terraria.
    this.autoMoveIn();
    GameEvents.notifySync('npcs', 'inventory');
    return true;
  }

  // ------------------------------------------------------------------ vecinos
  views(): NpcView[] {
    return NpcList.map((npc) => ({
      npc,
      housed: this.housed.has(npc.id),
      available: allMet(npc.arrival),
      requirements: progressOf(npc.arrival),
    }));
  }

  canMoveIn(npcId: string): boolean {
    const npc = getNpc(npcId);
    return !this.housed.has(npcId) && this.freeHouses > 0 && allMet(npc.arrival);
  }

  moveIn(npcId: string): boolean {
    if (!this.canMoveIn(npcId)) return false;
    const npc = getNpc(npcId);
    this.housed.add(npcId);
    App.game.player.invalidate();
    App.game.notifier.push(`${npc.name} se ha mudado al pueblo`, 'achievement', npc.sprite);
    App.game.achievements.check();
    GameEvents.notifySync('npcs', 'player');
    return true;
  }

  /**
   * Mete en las casas libres a todos los que ya cumplen, por orden de la lista.
   * Se llama al construir una casa: nadie quiere ir mudando a mano de uno en uno.
   */
  autoMoveIn(): number {
    let moved = 0;
    for (const npc of NpcList) {
      if (this.freeHouses <= 0) break;
      if (this.canMoveIn(npc.id)) {
        this.moveIn(npc.id);
        moved += 1;
      }
    }
    return moved;
  }

  /** Cuantos esperan casa: hay sitio en el pueblo pero no en las casas. */
  get waiting(): NpcDef[] {
    return NpcList.filter((npc) => !this.housed.has(npc.id) && allMet(npc.arrival));
  }

  // ------------------------------------------------------------------ bonificaciones
  /** Suma de las bonificaciones de los vecinos que viven en el pueblo. */
  bonuses(): ItemStats[] {
    return NpcList.filter((npc) => this.housed.has(npc.id) && npc.bonus).map(
      (npc) => npc.bonus as ItemStats,
    );
  }

  // ------------------------------------------------------------------ tiendas
  /** Articulos de un vecino que ya se pueden comprar. */
  stockOf(npcId: string): ShopEntry[] {
    const npc = getNpc(npcId);
    if (!this.housed.has(npcId)) return [];
    return (npc.shop ?? []).filter((entry) => !entry.requires || allMet(entry.requires));
  }

  buy(npcId: string, itemId: ItemId, amount = 1): boolean {
    const entry = this.stockOf(npcId).find((candidate) => candidate.itemId === itemId);
    if (!entry || amount <= 0) return false;

    const total = entry.price * amount;
    if (!App.game.wallet.spend(total)) {
      App.game.notifier.push('No te llega el dinero.', 'warning', itemId);
      return false;
    }
    App.game.inventory.gain(itemId, amount, true);
    App.game.statistics.addPurchase(amount);
    App.game.notifier.push(`Comprado ${getItem(itemId).name} x${amount}`, 'success', itemId);
    App.game.achievements.check();
    GameEvents.notifySync('inventory', 'wallet', 'crafting');
    return true;
  }

  /** Cuantas unidades se pueden pagar con lo que hay en la cartera. */
  affordable(npcId: string, itemId: ItemId): number {
    const entry = this.stockOf(npcId).find((candidate) => candidate.itemId === itemId);
    if (!entry || entry.price <= 0) return 0;
    return Math.floor(App.game.wallet.total / entry.price);
  }

  // ------------------------------------------------------------------ enfermera
  /** Precio de la cura completa, proporcional a la vida que falta. */
  healCost(): number {
    const missing = App.game.player.maxHealth - App.game.player.health;
    if (missing <= 0) return 0;
    return Math.max(500, Math.ceil(missing) * 200);
  }

  canHeal(): boolean {
    const cost = this.healCost();
    return this.hasRole('heal') && cost > 0 && App.game.wallet.canAfford(cost);
  }

  /** Cura entera pagando. No gasta la espera comun de las pociones. */
  heal(): boolean {
    if (!this.canHeal()) return false;
    if (!App.game.wallet.spend(this.healCost())) return false;
    App.game.player.fullHeal();
    App.game.notifier.push('Como nuevo.', 'success', 'Nurse');
    GameEvents.notifySync('player', 'wallet');
    return true;
  }

  // ------------------------------------------------------------------ bucle
  /** Renta pasiva del Recaudador. La llama el bucle de juego. */
  tick(deltaMs: number): void {
    if (!this.hasRole('tax')) return;
    this.taxCarry += (this.taxRate * deltaMs) / 1000;
    if (this.taxCarry < 1) return;
    const whole = Math.floor(this.taxCarry);
    this.taxCarry -= whole;
    App.game.wallet.gain(whole);
  }

  /** Cobre por segundo que entra ahora mismo. */
  get taxRate(): number {
    return this.hasRole('tax') ? this.housedCount * TAX_PER_NPC_PER_SECOND : 0;
  }

  // ------------------------------------------------------------------ save
  toJSON(): NpcsSave {
    return { houses: this.houses, housed: [...this.housed] };
  }

  fromJSON(save: NpcsSave | undefined): void {
    this.houses = Math.max(0, Math.floor(save?.houses ?? 0));
    this.housed.clear();
    for (const id of save?.housed ?? []) {
      if (NpcList.some((npc) => npc.id === id)) this.housed.add(id);
    }
    // Un save manipulado podria traer mas vecinos que casas: las casas mandan.
    if (this.housed.size > this.houses) this.houses = this.housed.size;
  }
}
