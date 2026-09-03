import { formatNumber } from '../../modules/GameHelper';
import type { ItemStats } from '../../modules/items/ItemType';
import type { PrefixDef } from '../../modules/items/Prefixes';

/**
 * Como se leen las estadisticas de una pieza. Estaban duplicadas en la mochila y
 * en el selector de equipo, con nombres distintos para lo mismo; aqui hay una
 * sola tabla, que usan la mochila, el catalogo, las tiendas y el reforjado.
 */
const STAT_LABEL: Record<keyof ItemStats, string> = {
  damage: 'dano por click',
  autoDps: 'DPS pasivo',
  pickPower: 'potencia de pico',
  axePower: 'potencia de hacha',
  defense: 'defensa',
  luck: 'suerte',
  regen: 'regeneracion',
  coinBonus: 'monedas',
  manaCost: 'de mana por golpe',
  mana: 'mana maximo',
  manaRegen: 'regeneracion de mana',
};

/** Orden en el que se leen bien: primero lo que pega, luego lo que aguanta. */
const STAT_ORDER: Array<keyof ItemStats> = [
  'damage',
  'autoDps',
  'defense',
  'pickPower',
  'axePower',
  'manaCost',
  'mana',
  'manaRegen',
  'regen',
  'luck',
  'coinBonus',
];

const isPercent = (key: keyof ItemStats): boolean => key === 'luck' || key === 'coinBonus';

/** La potencia de herramienta y el coste de mana son absolutos, no bonificaciones. */
const isAbsolute = (key: keyof ItemStats): boolean =>
  key === 'pickPower' || key === 'axePower' || key === 'manaCost';

export function formatStat(key: keyof ItemStats, value: number): string {
  const amount = isPercent(key) ? `${Math.round(value * 100)}%` : formatNumber(value);
  return isAbsolute(key) ? `${amount} ${STAT_LABEL[key]}` : `+${amount} ${STAT_LABEL[key]}`;
}

/** Las estadisticas presentes, en orden y sin los ceros. */
export function statEntries(stats: ItemStats | undefined): Array<[keyof ItemStats, number]> {
  if (!stats) return [];
  return STAT_ORDER.filter((key) => (stats[key] ?? 0) !== 0).map((key) => [
    key,
    stats[key] as number,
  ]);
}

/**
 * Que hace un rasgo, en palabras. Los rasgos se guardan como multiplicadores y
 * sumas sobre las stats de la pieza, y "Legendario" a secas no dice nada: hay
 * que poder leer que son un 15% mas de dano y un 8% de suerte.
 */
export function prefixEffect(prefix: PrefixDef): string {
  const parts: string[] = [];
  for (const [key, factor] of Object.entries(prefix.multipliers ?? {})) {
    const field = key as keyof ItemStats;
    const percent = Math.round((factor - 1) * 100);
    parts.push(`${percent > 0 ? '+' : ''}${percent}% ${STAT_LABEL[field]}`);
  }
  for (const [key, amount] of Object.entries(prefix.flat ?? {})) {
    parts.push(formatStat(key as keyof ItemStats, amount as number));
  }
  return parts.join(' · ');
}

/** Resumen en una linea, para listas y tooltips. */
export const statSummary = (stats: ItemStats | undefined): string =>
  statEntries(stats)
    .map(([key, value]) => formatStat(key, value))
    .join(' · ');
