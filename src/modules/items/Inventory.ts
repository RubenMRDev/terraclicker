import { GameEvents } from '../GameEvents';
import { getItem } from './ItemList';
import type { ItemAmount, ItemId } from './ItemType';

export interface InventorySave {
  items: Record<ItemId, number>;
  discovered: ItemId[];
  /** Rasgo activo de cada objeto que admite uno. */
  prefixes?: Record<ItemId, string>;
}

/**
 * Mochila del jugador. Guarda cantidades por id y ademas el conjunto de objetos
 * ya descubiertos, que alimenta el Catalogo (el "pokedex" del juego).
 */
export class Inventory {
  private items = new Map<ItemId, number>();
  /** Todo lo que se ha visto alguna vez, aunque ya no quede ninguno. */
  readonly discovered = new Set<ItemId>();
  /**
   * Rasgo por tipo de objeto. Se guarda uno por id y no por unidad: no tienes
   * tres espadas de oro distintas, tienes "tu" espada de oro con su rasgo.
   */
  private readonly prefixes = new Map<ItemId, string>();

  count(id: ItemId): number {
    return this.items.get(id) ?? 0;
  }

  has(id: ItemId, amount = 1): boolean {
    return this.count(id) >= amount;
  }

  hasAll(costs: readonly ItemAmount[]): boolean {
    return costs.every((cost) => this.has(cost.itemId, cost.amount));
  }

  gain(id: ItemId, amount = 1, silent = false): void {
    if (amount <= 0) return;
    this.items.set(id, this.count(id) + amount);
    this.discovered.add(id);
    if (!silent) GameEvents.notify('inventory');
  }

  /** Descuenta si hay suficiente. Devuelve false y no toca nada si no llega. */
  remove(id: ItemId, amount = 1): boolean {
    const current = this.count(id);
    if (current < amount) return false;
    const rest = current - amount;
    if (rest === 0) this.items.delete(id);
    else this.items.set(id, rest);
    GameEvents.notify('inventory');
    return true;
  }

  /** Descuenta una lista completa de forma atomica. */
  removeAll(costs: readonly ItemAmount[]): boolean {
    if (!this.hasAll(costs)) return false;
    for (const cost of costs) {
      const rest = this.count(cost.itemId) - cost.amount;
      if (rest === 0) this.items.delete(cost.itemId);
      else this.items.set(cost.itemId, rest);
    }
    GameEvents.notify('inventory');
    return true;
  }

  /** Contenido ordenado por categoria y nombre, para pintar la mochila. */
  entries(): Array<{ id: ItemId; amount: number }> {
    return [...this.items.entries()]
      .map(([id, amount]) => ({ id, amount }))
      .sort((a, b) => {
        const ia = getItem(a.id);
        const ib = getItem(b.id);
        return ia.category === ib.category
          ? ia.name.localeCompare(ib.name)
          : ia.category.localeCompare(ib.category);
      });
  }

  totalItems(): number {
    let total = 0;
    for (const amount of this.items.values()) total += amount;
    return total;
  }

  /** Rasgo activo de un objeto, si tiene. */
  prefixOf(id: ItemId): string | undefined {
    return this.prefixes.get(id);
  }

  setPrefix(id: ItemId, prefixId: string | null): void {
    if (prefixId) this.prefixes.set(id, prefixId);
    else this.prefixes.delete(id);
    GameEvents.notify('inventory', 'player');
  }

  toJSON(): InventorySave {
    return {
      items: Object.fromEntries(this.items),
      discovered: [...this.discovered],
      prefixes: Object.fromEntries(this.prefixes),
    };
  }

  fromJSON(save: InventorySave | undefined): void {
    this.items.clear();
    this.discovered.clear();
    this.prefixes.clear();
    if (!save) return;
    for (const [id, prefixId] of Object.entries(save.prefixes ?? {})) {
      if (typeof prefixId === 'string') this.prefixes.set(id, prefixId);
    }
    for (const [id, amount] of Object.entries(save.items ?? {})) {
      if (typeof amount === 'number' && amount > 0) this.items.set(id, amount);
    }
    for (const id of save.discovered ?? []) this.discovered.add(id);
  }
}
