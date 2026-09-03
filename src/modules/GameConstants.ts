/**
 * Constantes globales del juego. Equivalente a modules/GameConstants.ts de pokeclicker.
 */

export const SAVE_KEY = 'terraclicker-save';
export const SAVE_VERSION = 4;

/** El bucle de juego corre a 20 ticks por segundo. */
export const TICKS_PER_SECOND = 20;
export const TICK_MS = 1000 / TICKS_PER_SECOND;
export const AUTOSAVE_INTERVAL_MS = 30_000;

/** Monedas: todo se guarda en cobre y se formatea al mostrar. */
export const COIN_RATE = 100;
export const COPPER_PER_SILVER = COIN_RATE;
export const COPPER_PER_GOLD = COIN_RATE ** 2;
export const COPPER_PER_PLATINUM = COIN_RATE ** 3;

/**
 * Constante de la curva de defensa: el dano recibido se multiplica por
 * DEFENSE_SOFTENING / (DEFENSE_SOFTENING + defensa). Una resta plana hacia
 * inofensivos a los jefes en cuanto juntabas armadura; asi la defensa siempre
 * ayuda pero nunca anula el golpe.
 */
export const DEFENSE_SOFTENING = 30;

/** Espera entre pociones curativas, como el mareo de pocion de Terraria. */
export const POTION_COOLDOWN_MS = 7_000;

/** Regeneracion de vida fuera de combate, en HP por segundo. */
export const OUT_OF_COMBAT_REGEN = 4;
/** Regeneracion durante una bossfight (mucho mas baja). */
export const IN_COMBAT_REGEN = 2;

export enum TargetKind {
  Node = 'node',
  Enemy = 'enemy',
}

export enum ToolKind {
  Pickaxe = 'pickaxe',
  Axe = 'axe',
}

export enum BossPhase {
  Idle = 'idle',
  Fighting = 'fighting',
  Won = 'won',
  Lost = 'lost',
}

export enum EquipmentSlot {
  Weapon = 'weapon',
  Pickaxe = 'pickaxe',
  Axe = 'axe',
  Helmet = 'helmet',
  Chest = 'chest',
  Legs = 'legs',
  Accessory1 = 'accessory1',
  Accessory2 = 'accessory2',
  Accessory3 = 'accessory3',
}

export const ACCESSORY_SLOTS = [
  EquipmentSlot.Accessory1,
  EquipmentSlot.Accessory2,
  EquipmentSlot.Accessory3,
] as const;

export const ARMOR_SLOTS = [EquipmentSlot.Helmet, EquipmentSlot.Chest, EquipmentSlot.Legs] as const;

export const BASE_MAX_HEALTH = 100;

/** Mana: 20 de base y 20 por cristal, hasta 200, igual que en Terraria. */
export const BASE_MAX_MANA = 20;
export const MANA_PER_CRYSTAL = 20;
export const MAX_MANA_CRYSTALS = 9;
/** Mana regenerado por segundo. */
export const MANA_REGEN = 4;
/** Dano que hace un arma magica cuando te has quedado sin mana. */
export const NO_MANA_DAMAGE_FACTOR = 0.25;

export const HEALTH_PER_LIFE_CRYSTAL = 20;
export const MAX_LIFE_CRYSTALS = 15;
/** Frutas de vida: el escalon de Hardmode, de 400 a 500 PV en pasos de 5. */
export const HEALTH_PER_LIFE_FRUIT = 5;
export const MAX_LIFE_FRUITS = 20;

/** Una moneda de oro por defecto para el primer minado, para que el jugador no empiece a cero. */
export const STARTING_COINS = 0;

/**
 * Autoclicker: clicks por segundo cuando esta encendido. Veinte es lo que da un
 * humano insistente con raton bueno, asi que no rompe el balance, solo la mano.
 */
export const AUTO_CLICKS_PER_SECOND = 20;

/** Con el autocombate, por debajo de esta fraccion de vida se bebe una pocion. */
export const AUTO_POTION_THRESHOLD = 0.45;

/**
 * Tope de tiradas de una pulsacion de auto-reforjar. El bucle es sincrono, asi
 * que sin tope un objetivo raro congelaria la pestana.
 */
export const AUTO_REFORGE_MAX_ATTEMPTS = 250;

/** Pociones curativas de la mas fuerte a la mas floja, para el autocombate. */
export const HEALING_POTIONS = [
  'Super_Healing_Potion',
  'Lifeforce_Potion',
  'Greater_Healing_Potion',
  'Healing_Potion',
  'Lesser_Healing_Potion',
] as const;
