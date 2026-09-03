import { GameEvents } from '../GameEvents';
import type { ItemId } from '../items/ItemType';

export interface StatisticsSave {
  clicks: number;
  nodesBroken: number;
  enemiesDefeated: number;
  totalDamage: number;
  timePlayedMs: number;
  itemsGathered: Record<ItemId, number>;
  enemiesByType: Record<string, number>;
  bossAttempts: Record<string, number>;
  bossDefeats: Record<string, number>;
  itemsCrafted: number;
  deaths: number;
  itemsBought?: number;
}

/**
 * Contadores del juego. Alimentan los requisitos de desbloqueo, los logros y
 * la pantalla de estadisticas. Equivale a modules/statistics de pokeclicker.
 */
export class Statistics {
  clicks = 0;
  nodesBroken = 0;
  enemiesDefeated = 0;
  totalDamage = 0;
  timePlayedMs = 0;
  itemsCrafted = 0;
  itemsBought = 0;
  deaths = 0;
  readonly itemsGathered = new Map<ItemId, number>();
  readonly enemiesByType = new Map<string, number>();
  readonly bossAttempts = new Map<string, number>();
  readonly bossDefeats = new Map<string, number>();

  addPurchase(amount: number): void {
    this.itemsBought += amount;
  }

  gathered(id: ItemId): number {
    return this.itemsGathered.get(id) ?? 0;
  }

  addGathered(id: ItemId, amount: number): void {
    this.itemsGathered.set(id, this.gathered(id) + amount);
  }

  killsOf(enemyId: string): number {
    return this.enemiesByType.get(enemyId) ?? 0;
  }

  addKill(enemyId: string): void {
    this.enemiesByType.set(enemyId, this.killsOf(enemyId) + 1);
    this.enemiesDefeated += 1;
  }

  defeatsOf(bossId: string): number {
    return this.bossDefeats.get(bossId) ?? 0;
  }

  attemptsOf(bossId: string): number {
    return this.bossAttempts.get(bossId) ?? 0;
  }

  addBossAttempt(bossId: string): void {
    this.bossAttempts.set(bossId, this.attemptsOf(bossId) + 1);
    GameEvents.notify('statistics');
  }

  addBossDefeat(bossId: string): void {
    this.bossDefeats.set(bossId, this.defeatsOf(bossId) + 1);
    GameEvents.notify('statistics');
  }

  toJSON(): StatisticsSave {
    return {
      clicks: this.clicks,
      nodesBroken: this.nodesBroken,
      enemiesDefeated: this.enemiesDefeated,
      totalDamage: Math.round(this.totalDamage),
      timePlayedMs: Math.round(this.timePlayedMs),
      itemsGathered: Object.fromEntries(this.itemsGathered),
      enemiesByType: Object.fromEntries(this.enemiesByType),
      bossAttempts: Object.fromEntries(this.bossAttempts),
      bossDefeats: Object.fromEntries(this.bossDefeats),
      itemsCrafted: this.itemsCrafted,
      itemsBought: this.itemsBought,
      deaths: this.deaths,
    };
  }

  fromJSON(save: StatisticsSave | undefined): void {
    this.clicks = save?.clicks ?? 0;
    this.nodesBroken = save?.nodesBroken ?? 0;
    this.enemiesDefeated = save?.enemiesDefeated ?? 0;
    this.totalDamage = save?.totalDamage ?? 0;
    this.timePlayedMs = save?.timePlayedMs ?? 0;
    this.itemsCrafted = save?.itemsCrafted ?? 0;
    this.itemsBought = save?.itemsBought ?? 0;
    this.deaths = save?.deaths ?? 0;

    const restore = (target: Map<string, number>, source: Record<string, number> | undefined) => {
      target.clear();
      for (const [key, value] of Object.entries(source ?? {})) target.set(key, value);
    };
    restore(this.itemsGathered, save?.itemsGathered);
    restore(this.enemiesByType, save?.enemiesByType);
    restore(this.bossAttempts, save?.bossAttempts);
    restore(this.bossDefeats, save?.bossDefeats);
  }
}
