import { ItemCategory, type ItemDef, type ItemStats } from './ItemType';

/**
 * Rasgos (los "prefijos" de Terraria). Un objeto fabricado puede salir con uno,
 * y en el Taller del Inventor se puede reforjar pagando.
 *
 * Se aplican como multiplicadores sobre las estadisticas que ya tiene la pieza,
 * mas algun extra plano, de modo que un rasgo bueno en un arma tardia vale mucho
 * mas que en una de cobre: escalan solos con la progresion.
 */
export interface PrefixDef {
  id: string;
  name: string;
  /** Multiplicadores por estadistica. 1 = no cambia. */
  multipliers?: Partial<Record<keyof ItemStats, number>>;
  /** Sumas planas, para lo que no tiene sentido multiplicar. */
  flat?: Partial<ItemStats>;
  /** Peso relativo al sortear. Los malos pesan menos que los buenos. */
  weight: number;
  /** A que tipo de objeto puede tocarle. */
  applies: PrefixTarget[];
  /** Malo: se muestra en rojo y baja el valor. */
  bad?: boolean;
}

export type PrefixTarget = 'weapon' | 'tool' | 'accessory';

export const PrefixList: PrefixDef[] = [
  // ---------------------------------------------------------------- armas
  { id: 'legendary', name: 'Legendario', weight: 3, applies: ['weapon'], multipliers: { damage: 1.15 }, flat: { luck: 0.08 } },
  { id: 'unreal', name: 'Irreal', weight: 3, applies: ['weapon'], multipliers: { damage: 1.15, autoDps: 1.15 } },
  { id: 'mythical', name: 'Mitico', weight: 4, applies: ['weapon'], multipliers: { damage: 1.12 }, flat: { mana: 20 } },
  { id: 'godly', name: 'Divino', weight: 6, applies: ['weapon'], multipliers: { damage: 1.1 }, flat: { luck: 0.05 } },
  { id: 'demonic', name: 'Demoniaco', weight: 8, applies: ['weapon'], multipliers: { damage: 1.12 } },
  { id: 'ruthless', name: 'Despiadado', weight: 8, applies: ['weapon'], multipliers: { damage: 1.18 } },
  { id: 'murderous', name: 'Asesino', weight: 7, applies: ['weapon'], multipliers: { damage: 1.09 }, flat: { luck: 0.04 } },
  { id: 'rapid', name: 'Rapido', weight: 8, applies: ['weapon'], multipliers: { autoDps: 1.25 } },
  { id: 'arcane', name: 'Arcano', weight: 7, applies: ['weapon'], flat: { mana: 40, manaRegen: 3 } },
  { id: 'masterful', name: 'Maestro', weight: 5, applies: ['weapon'], multipliers: { manaCost: 0.75 } },
  { id: 'broken', name: 'Roto', weight: 4, applies: ['weapon'], multipliers: { damage: 0.7 }, bad: true },
  { id: 'terrible', name: 'Pesimo', weight: 4, applies: ['weapon'], multipliers: { damage: 0.8, autoDps: 0.8 }, bad: true },

  // ---------------------------------------------------------------- herramientas
  { id: 'light', name: 'Ligero', weight: 8, applies: ['tool'], multipliers: { autoDps: 1.2 } },
  { id: 'quick', name: 'Veloz', weight: 8, applies: ['tool'], multipliers: { autoDps: 1.3 } },
  { id: 'massive', name: 'Enorme', weight: 6, applies: ['tool'], multipliers: { damage: 1.2 } },
  { id: 'dull', name: 'Romo', weight: 4, applies: ['tool'], multipliers: { autoDps: 0.75 }, bad: true },
  { id: 'sluggish', name: 'Lento', weight: 4, applies: ['tool'], multipliers: { autoDps: 0.8, damage: 0.9 }, bad: true },

  // ---------------------------------------------------------------- accesorios
  { id: 'warding', name: 'Protector', weight: 8, applies: ['accessory'], flat: { defense: 4 } },
  { id: 'menacing', name: 'Amenazante', weight: 8, applies: ['accessory'], multipliers: { damage: 1.12 }, flat: { damage: 10 } },
  { id: 'lucky', name: 'Afortunado', weight: 6, applies: ['accessory'], flat: { luck: 0.08 } },
  { id: 'violent', name: 'Violento', weight: 7, applies: ['accessory'], multipliers: { autoDps: 1.15 }, flat: { autoDps: 8 } },
  { id: 'arcane_acc', name: 'Arcano', weight: 6, applies: ['accessory'], flat: { mana: 20, manaRegen: 2 } },
  { id: 'greedy', name: 'Codicioso', weight: 5, applies: ['accessory'], flat: { coinBonus: 0.15 } },
  { id: 'annoying', name: 'Molesto', weight: 4, applies: ['accessory'], multipliers: { damage: 0.85 }, bad: true },
];

const byId = new Map(PrefixList.map((prefix) => [prefix.id, prefix]));

export const getPrefix = (id: string | undefined): PrefixDef | undefined =>
  id ? byId.get(id) : undefined;

/** Que clase de rasgos admite un objeto. Las armaduras no llevan. */
export function prefixTargetOf(item: ItemDef): PrefixTarget | null {
  switch (item.category) {
    case ItemCategory.Weapon:
      return 'weapon';
    case ItemCategory.Tool:
      return 'tool';
    case ItemCategory.Accessory:
      return 'accessory';
    default:
      return null;
  }
}

export const canHavePrefix = (item: ItemDef): boolean => prefixTargetOf(item) !== null;

/**
 * Probabilidad de cada rasgo para un tipo de pieza, ordenada de mas raro a mas
 * comun. Es informacion que ya estaba en los pesos, pero el jugador no tenia
 * forma de verla: pagar por una tirada a ciegas no invita a repetir.
 */
export function prefixOdds(target: PrefixTarget): Array<{ prefix: PrefixDef; chance: number }> {
  const pool = PrefixList.filter((prefix) => prefix.applies.includes(target));
  const total = pool.reduce((sum, prefix) => sum + prefix.weight, 0);
  if (total <= 0) return [];
  return pool
    .map((prefix) => ({ prefix, chance: prefix.weight / total }))
    .sort((a, b) => a.chance - b.chance);
}

/** Sortea un rasgo para un objeto, o null si no admite. */
export function rollPrefix(item: ItemDef): string | null {
  const target = prefixTargetOf(item);
  if (!target) return null;
  const pool = PrefixList.filter((prefix) => prefix.applies.includes(target));
  const total = pool.reduce((sum, prefix) => sum + prefix.weight, 0);
  let roll = Math.random() * total;
  for (const prefix of pool) {
    roll -= prefix.weight;
    if (roll <= 0) return prefix.id;
  }
  return pool[pool.length - 1]?.id ?? null;
}

/** Aplica el rasgo a las estadisticas base de una pieza. */
export function applyPrefix(stats: ItemStats | undefined, prefixId: string | undefined): ItemStats {
  const base: ItemStats = { ...(stats ?? {}) };
  const prefix = getPrefix(prefixId);
  if (!prefix) return base;

  for (const [key, factor] of Object.entries(prefix.multipliers ?? {})) {
    const field = key as keyof ItemStats;
    const value = base[field];
    if (typeof value === 'number' && value !== 0) base[field] = value * factor;
  }
  for (const [key, amount] of Object.entries(prefix.flat ?? {})) {
    const field = key as keyof ItemStats;
    base[field] = (base[field] ?? 0) + (amount as number);
  }

  // Redondeo para que la ficha no muestre 43.199999999999996.
  for (const key of Object.keys(base) as Array<keyof ItemStats>) {
    const value = base[key];
    if (typeof value !== 'number') continue;
    base[key] = key === 'luck' || key === 'coinBonus' ? Math.round(value * 100) / 100 : Math.round(value);
  }
  return base;
}

/** Resumen corto del rasgo, para tooltips. */
export function prefixSummary(prefixId: string | undefined): string {
  const prefix = getPrefix(prefixId);
  if (!prefix) return '';
  const parts: string[] = [];
  for (const [key, factor] of Object.entries(prefix.multipliers ?? {})) {
    const percent = Math.round((factor - 1) * 100);
    parts.push(`${percent > 0 ? '+' : ''}${percent}% ${key}`);
  }
  for (const [key, amount] of Object.entries(prefix.flat ?? {})) {
    const value = key === 'luck' || key === 'coinBonus' ? `${Math.round((amount as number) * 100)}%` : amount;
    parts.push(`+${value} ${key}`);
  }
  return parts.join(', ');
}
