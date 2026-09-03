import { App } from '../App';
import {
  ACCESSORY_SLOTS,
  BASE_MAX_HEALTH,
  BASE_MAX_MANA,
  DEFENSE_SOFTENING,
  EquipmentSlot,
  HEALTH_PER_LIFE_CRYSTAL,
  MANA_PER_CRYSTAL,
  MANA_REGEN,
  HEALTH_PER_LIFE_FRUIT,
  MAX_LIFE_CRYSTALS,
  MAX_LIFE_FRUITS,
  MAX_MANA_CRYSTALS,
  POTION_COOLDOWN_MS,
} from '../GameConstants';
import { GameEvents } from '../GameEvents';
import { clamp } from '../GameHelper';
import type { Inventory } from '../items/Inventory';
import { getItem } from '../items/ItemList';
import type { ItemId, ItemStats } from '../items/ItemType';
import { applyPrefix } from '../items/Prefixes';

export type EquipmentMap = Partial<Record<EquipmentSlot, ItemId>>;

export interface PlayerSave {
  equipment: EquipmentMap;
  health: number;
  lifeCrystals: number;
  lifeFruits?: number;
  mana?: number;
  manaCrystals?: number;
}

export interface DerivedStats {
  clickDamage: number;
  autoDps: number;
  pickPower: number;
  axePower: number;
  defense: number;
  luck: number;
  regen: number;
  coinBonus: number;
  /** Mana que gasta el arma equipada por golpe. 0 si no es magica. */
  manaCost: number;
  mana: number;
  manaRegen: number;
}

const EMPTY_STATS: DerivedStats = {
  clickDamage: 1,
  autoDps: 0,
  pickPower: 0,
  axePower: 0,
  defense: 0,
  luck: 0,
  regen: 0,
  coinBonus: 0,
  manaCost: 0,
  mana: 0,
  manaRegen: 0,
};

/** Un accesorio se marca en los datos con el primer slot de accesorio. */
export const isAccessory = (id: ItemId): boolean =>
  ACCESSORY_SLOTS.includes(getItem(id).slot as (typeof ACCESSORY_SLOTS)[number]);

/**
 * Suma una tanda de bonificaciones al total. `fromGear` distingue lo que viene
 * de una pieza equipada: solo eso puede fijar la potencia de herramienta y el
 * coste de mana, que no se acumulan sino que los manda la pieza.
 */
function accumulate(totals: DerivedStats, stats: ItemStats, fromGear: boolean): void {
  totals.clickDamage += stats.damage ?? 0;
  totals.autoDps += stats.autoDps ?? 0;
  totals.defense += stats.defense ?? 0;
  totals.luck += stats.luck ?? 0;
  totals.regen += stats.regen ?? 0;
  totals.coinBonus += stats.coinBonus ?? 0;
  totals.mana += stats.mana ?? 0;
  totals.manaRegen += stats.manaRegen ?? 0;
  if (!fromGear) return;
  // El coste de mana lo fija el arma, no se suma entre piezas.
  totals.manaCost = Math.max(totals.manaCost, stats.manaCost ?? 0);
  // El pico y el hacha tampoco suman: manda la pieza equipada en ese slot.
  totals.pickPower = Math.max(totals.pickPower, stats.pickPower ?? 0);
  totals.axePower = Math.max(totals.axePower, stats.axePower ?? 0);
}

export class Player {
  equipment: EquipmentMap = {};
  lifeCrystals = 0;
  lifeFruits = 0;
  manaCrystals = 0;
  /** Tiempo que falta para poder beber otra pocion, en ms. */
  potionCooldown = 0;
  private currentHealth = BASE_MAX_HEALTH;
  private currentMana = BASE_MAX_MANA;
  private cachedStats: DerivedStats | null = null;

  constructor(private readonly inventory: Inventory) {}

  // ------------------------------------------------------------------ vida
  get maxHealth(): number {
    return (
      BASE_MAX_HEALTH +
      this.lifeCrystals * HEALTH_PER_LIFE_CRYSTAL +
      this.lifeFruits * HEALTH_PER_LIFE_FRUIT
    );
  }

  get health(): number {
    return this.currentHealth;
  }

  get healthPercent(): number {
    return this.maxHealth === 0 ? 0 : (this.currentHealth / this.maxHealth) * 100;
  }

  get isDead(): boolean {
    return this.currentHealth <= 0;
  }

  heal(amount: number): void {
    if (amount <= 0) return;
    const next = clamp(this.currentHealth + amount, 0, this.maxHealth);
    if (next === this.currentHealth) return;
    this.currentHealth = next;
    GameEvents.notify('player');
  }

  /** Aplica dano reducido por defensa. Devuelve el dano realmente recibido. */
  takeDamage(rawDamage: number): number {
    const reduction = DEFENSE_SOFTENING / (DEFENSE_SOFTENING + this.stats.defense);
    const mitigated = Math.max(1, Math.round(rawDamage * reduction));
    this.currentHealth = clamp(this.currentHealth - mitigated, 0, this.maxHealth);
    GameEvents.notify('player');
    return mitigated;
  }

  fullHeal(): void {
    this.currentHealth = this.maxHealth;
    this.currentMana = this.maxMana;
    this.potionCooldown = 0;
    GameEvents.notify('player');
  }

  // ------------------------------------------------------------------ mana
  get maxMana(): number {
    return BASE_MAX_MANA + this.manaCrystals * MANA_PER_CRYSTAL + this.stats.mana;
  }

  get mana(): number {
    return this.currentMana;
  }

  /** Gasta mana si hay suficiente. Devuelve si el golpe sale a plena potencia. */
  spendMana(amount: number): boolean {
    if (amount <= 0) return true;
    if (this.currentMana < amount) return false;
    this.currentMana -= amount;
    GameEvents.notify('player');
    return true;
  }

  restoreMana(amount: number): void {
    if (amount <= 0) return;
    const next = clamp(this.currentMana + amount, 0, this.maxMana);
    if (next === this.currentMana) return;
    this.currentMana = next;
    GameEvents.notify('player');
  }

  /** Regeneracion continua de mana. La llama el bucle de juego. */
  tickMana(deltaMs: number): void {
    if (this.currentMana >= this.maxMana) return;
    this.restoreMana(((MANA_REGEN + this.stats.manaRegen) * deltaMs) / 1000);
  }

  addManaCrystal(): boolean {
    if (this.manaCrystals >= MAX_MANA_CRYSTALS) return false;
    this.manaCrystals += 1;
    this.restoreMana(MANA_PER_CRYSTAL);
    GameEvents.notify('player');
    return true;
  }

  /** Descuenta la espera entre pociones. La llama el bucle de juego. */
  tickPotionCooldown(deltaMs: number): void {
    if (this.potionCooldown <= 0) return;
    this.potionCooldown = Math.max(0, this.potionCooldown - deltaMs);
    if (this.potionCooldown === 0) GameEvents.notify('player');
  }

  startPotionCooldown(): void {
    this.potionCooldown = POTION_COOLDOWN_MS;
    GameEvents.notify('player');
  }

  addLifeFruit(): boolean {
    if (this.lifeFruits >= MAX_LIFE_FRUITS) return false;
    this.lifeFruits += 1;
    this.heal(HEALTH_PER_LIFE_FRUIT);
    GameEvents.notify('player');
    return true;
  }

  addLifeCrystal(): boolean {
    if (this.lifeCrystals >= MAX_LIFE_CRYSTALS) return false;
    this.lifeCrystals += 1;
    this.heal(HEALTH_PER_LIFE_CRYSTAL);
    GameEvents.notify('player');
    return true;
  }

  // ------------------------------------------------------------------ equipo
  /**
   * Equipa un objeto. Los accesorios buscan hueco libre entre los tres slots;
   * si no queda ninguno se sustituye el primero.
   */
  equip(id: ItemId, preferredSlot?: EquipmentSlot): boolean {
    const item = getItem(id);
    if (!item.slot || !this.inventory.has(id)) return false;

    let slot = preferredSlot ?? item.slot;
    if (isAccessory(id) && !preferredSlot) {
      slot =
        ACCESSORY_SLOTS.find((candidate) => !this.equipment[candidate]) ?? EquipmentSlot.Accessory1;
    }
    if (this.equipment[slot] === id) return false;

    this.equipment[slot] = id;
    this.invalidate();
    return true;
  }

  unequip(slot: EquipmentSlot): void {
    if (!this.equipment[slot]) return;
    delete this.equipment[slot];
    this.invalidate();
  }

  isEquipped(id: ItemId): boolean {
    return Object.values(this.equipment).includes(id);
  }

  equippedIn(slot: EquipmentSlot): ItemId | undefined {
    return this.equipment[slot];
  }

  /** Estadisticas efectivas de una pieza, con su rasgo. */
  statsOf(id: ItemId): ItemStats {
    return applyPrefix(getItem(id).stats, this.inventory.prefixOf(id));
  }

  /** Slot en el que esta puesto un objeto, si lo esta. */
  slotOf(id: ItemId): EquipmentSlot | undefined {
    return Object.entries(this.equipment).find(([, value]) => value === id)?.[0] as
      | EquipmentSlot
      | undefined;
  }

  /**
   * Objetos de la mochila que caben en un slot, para el selector de equipo.
   * Se excluye lo que ya llevas puesto en otro hueco: nada de duplicar accesorios.
   */
  candidatesFor(slot: EquipmentSlot): ItemId[] {
    const wantsAccessory = ACCESSORY_SLOTS.includes(slot as (typeof ACCESSORY_SLOTS)[number]);
    return this.inventory
      .entries()
      .map((entry) => entry.id)
      .filter((id) => {
        const item = getItem(id);
        if (!item.slot) return false;
        if (wantsAccessory ? !isAccessory(id) : item.slot !== slot) return false;
        const current = this.slotOf(id);
        return current === undefined || current === slot;
      });
  }

  // ------------------------------------------------------------------ stats
  /**
   * Suma de las bonificaciones de todo lo equipado mas las de los vecinos del
   * pueblo. Cacheado hasta que cambie el equipo o se mude alguien.
   */
  get stats(): DerivedStats {
    if (this.cachedStats) return this.cachedStats;

    const totals: DerivedStats = { ...EMPTY_STATS };
    for (const id of Object.values(this.equipment)) {
      if (!id) continue;
      // Las estadisticas de la pieza ya vienen con su rasgo aplicado.
      accumulate(totals, applyPrefix(getItem(id).stats, this.inventory.prefixOf(id)), true);
    }

    // Los vecinos aportan lo suyo mientras vivan en el pueblo: es el
    // equivalente de la felicidad de los NPCs de Terraria. No tocan la potencia
    // de pico ni el coste de mana, que son cosa de la pieza equipada.
    for (const bonus of App.game.npcs.bonuses()) accumulate(totals, bonus, false);

    this.cachedStats = totals;
    return totals;
  }

  /** Recalcula stats y avisa a la UI. Llamar tras cualquier cambio de equipo. */
  invalidate(): void {
    this.cachedStats = null;
    // La vida maxima puede haber subido: nunca dejamos la actual por encima.
    this.currentHealth = clamp(this.currentHealth, 0, this.maxHealth);
    this.currentMana = clamp(this.currentMana, 0, this.maxMana);
    GameEvents.notify('player');
  }

  // ------------------------------------------------------------------ save
  toJSON(): PlayerSave {
    return {
      equipment: { ...this.equipment },
      health: this.currentHealth,
      lifeCrystals: this.lifeCrystals,
      lifeFruits: this.lifeFruits,
      mana: this.currentMana,
      manaCrystals: this.manaCrystals,
    };
  }

  fromJSON(save: PlayerSave | undefined): void {
    this.equipment = { ...(save?.equipment ?? {}) };
    this.lifeCrystals = clamp(save?.lifeCrystals ?? 0, 0, MAX_LIFE_CRYSTALS);
    this.lifeFruits = clamp(save?.lifeFruits ?? 0, 0, MAX_LIFE_FRUITS);
    this.manaCrystals = clamp(save?.manaCrystals ?? 0, 0, MAX_MANA_CRYSTALS);
    this.cachedStats = null;
    this.currentHealth = clamp(save?.health ?? this.maxHealth, 0, this.maxHealth);
    if (this.currentHealth <= 0) this.currentHealth = this.maxHealth;
    this.currentMana = clamp(save?.mana ?? this.maxMana, 0, this.maxMana);
    GameEvents.notify('player');
  }
}
