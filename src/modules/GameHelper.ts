import { ASSET_BY_NAME } from '../assets/generated/assetIndex';
import { COPPER_PER_GOLD, COPPER_PER_PLATINUM, COPPER_PER_SILVER } from './GameConstants';

/** Utilidades compartidas. Equivalente a modules/GameHelper.ts de pokeclicker. */

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Elige un elemento segun su peso relativo. */
export function weightedPick<T extends { weight: number }>(entries: readonly T[]): T | null {
  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry;
  }
  return entries[entries.length - 1] ?? null;
}

/** Ruta publica del sprite de la wiki para un id de item / enemigo / jefe. */
export function spriteUrl(name: string): string {
  const rel = ASSET_BY_NAME[name];
  return rel ? `${import.meta.env.BASE_URL}${rel}` : '';
}

/**
 * Regla CSS de cursor a partir de un sprite. El punto activo va centrado en los
 * 32x32 tipicos de la wiki; si el sprite falta se cae al cursor por defecto.
 */
export function cursorFor(name: string | null | undefined): string {
  const url = name ? spriteUrl(name) : '';
  return url ? `url("${url}") 16 16, crosshair` : 'crosshair';
}

export interface CoinBreakdown {
  platinum: number;
  gold: number;
  silver: number;
  copper: number;
}

/** Descompone una cantidad en cobre en las cuatro monedas de Terraria. */
export function breakdownCoins(totalCopper: number): CoinBreakdown {
  let rest = Math.max(0, Math.floor(totalCopper));
  const platinum = Math.floor(rest / COPPER_PER_PLATINUM);
  rest -= platinum * COPPER_PER_PLATINUM;
  const gold = Math.floor(rest / COPPER_PER_GOLD);
  rest -= gold * COPPER_PER_GOLD;
  const silver = Math.floor(rest / COPPER_PER_SILVER);
  rest -= silver * COPPER_PER_SILVER;
  return { platinum, gold, silver, copper: rest };
}

/** 12345 -> "12,3 K". Para numeros grandes de dano y de recursos. */
export function formatNumber(value: number): string {
  const abs = Math.abs(value);
  if (abs < 1000) return Number.isInteger(value) ? String(value) : value.toFixed(1);
  const units = ['K', 'M', 'B', 'T'];
  let scaled = value;
  let unit = -1;
  while (Math.abs(scaled) >= 1000 && unit < units.length - 1) {
    scaled /= 1000;
    unit += 1;
  }
  return `${scaled.toFixed(Math.abs(scaled) < 10 ? 1 : 0).replace('.', ',')} ${units[unit]}`;
}

/** Entero con separador de miles: para vidas y cantidades exactas. */
export const formatInt = (value: number): string =>
  Math.round(value).toLocaleString('es-ES');

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

/** Convierte 'Copper_Broadsword' en 'Copper Broadsword' para textos por defecto. */
export const humanize = (id: string): string => id.replace(/_/g, ' ');
