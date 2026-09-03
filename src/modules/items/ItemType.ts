import type { EquipmentSlot, ToolKind } from '../GameConstants';

export type ItemId = string;

export enum ItemCategory {
  Material = 'material',
  Bar = 'bar',
  Gem = 'gem',
  Tool = 'tool',
  Weapon = 'weapon',
  Armor = 'armor',
  Accessory = 'accessory',
  Station = 'station',
  Consumable = 'consumable',
  Summon = 'summon',
}

/** Bonificaciones que aporta una pieza al equiparla. */
export interface ItemStats {
  /** Dano por click. */
  damage?: number;
  /** Dano pasivo por segundo (el "autominado"). */
  autoDps?: number;
  /** Potencia de pico: hace falta >= la del bloque para poder romperlo. */
  pickPower?: number;
  /** Potencia de hacha, para arboles y madera. */
  axePower?: number;
  /** Reduce el dano recibido de los jefes. */
  defense?: number;
  /** Multiplicador de probabilidad de drop raro. */
  luck?: number;
  /** Vida regenerada por segundo, adicional. */
  regen?: number;
  /** Multiplicador de monedas obtenidas. */
  coinBonus?: number;
  /** Mana que gasta cada golpe. Solo lo tienen las armas magicas. */
  manaCost?: number;
  /** Mana maximo adicional. */
  mana?: number;
  /** Mana regenerado por segundo, adicional. */
  manaRegen?: number;
}

export interface ItemDef {
  id: ItemId;
  name: string;
  category: ItemCategory;
  description: string;
  /** Valor de venta en cobre. 0 = no vendible. */
  sellPrice: number;
  /** Slot en el que se equipa, si es equipable. */
  slot?: EquipmentSlot;
  /** Para herramientas: si es pico o hacha. */
  tool?: ToolKind;
  stats?: ItemStats;
  /** Efecto al consumir, resuelto en Inventory.use(). */
  consumable?: ConsumableEffect;
  /** Id del jefe que invoca, si es un objeto de invocacion. */
  summons?: string;
  /** Solo sirve como icono: no se puede conseguir ni sale en el catalogo. */
  iconOnly?: boolean;
}

export type ConsumableEffect =
  | { kind: 'heal'; amount: number }
  | { kind: 'mana'; amount: number }
  | { kind: 'maxHealth'; amount: number }
  | { kind: 'maxHealthFruit'; amount: number }
  | { kind: 'maxMana'; amount: number }
  | { kind: 'coins'; amount: number }
  /** Revienta el nodo actual de la zona y multiplica su botin por `amount`. */
  | { kind: 'blastNode'; amount: number };

export interface ItemAmount {
  itemId: ItemId;
  amount: number;
}

/** Una tirada de botin: item, rango de cantidad y probabilidad (0-1). */
export interface DropDef {
  itemId: ItemId;
  min: number;
  max: number;
  chance: number;
  /** Si es true, la suerte del jugador aumenta la probabilidad. */
  affectedByLuck?: boolean;
}
