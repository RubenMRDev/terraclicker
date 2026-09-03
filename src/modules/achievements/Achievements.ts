import { App } from '../App';
import { GameEvents } from '../GameEvents';
import { evaluate, type RequirementProgress } from '../requirements/Requirement';
import { AchievementList, type AchievementDef } from './AchievementList';

export interface AchievementsSave {
  unlocked: string[];
}

export interface AchievementView {
  achievement: AchievementDef;
  progress: RequirementProgress;
  unlocked: boolean;
}

/** Comprueba y desbloquea logros. Equivale a AchievementHandler de pokeclicker. */
export class Achievements {
  readonly unlocked = new Set<string>();

  get total(): number {
    return AchievementList.length;
  }

  get completed(): number {
    return this.unlocked.size;
  }

  isUnlocked(id: string): boolean {
    return this.unlocked.has(id);
  }

  views(): AchievementView[] {
    return AchievementList.map((achievement) => ({
      achievement,
      progress: evaluate(achievement.requirement),
      unlocked: this.unlocked.has(achievement.id),
    }));
  }

  /**
   * Revisa todos los logros pendientes. Se llama tras cada evento relevante en
   * vez de en cada tick: son pocos, pero no hace falta evaluarlos 20 veces/s.
   */
  check(): void {
    let changed = false;
    for (const achievement of AchievementList) {
      if (this.unlocked.has(achievement.id)) continue;
      if (!evaluate(achievement.requirement).met) continue;

      this.unlocked.add(achievement.id);
      App.game.wallet.gain(achievement.coins);
      App.game.notifier.push(`Logro: ${achievement.name}`, 'achievement', achievement.icon);
      changed = true;
    }
    if (changed) GameEvents.notify('achievements');
  }

  toJSON(): AchievementsSave {
    return { unlocked: [...this.unlocked] };
  }

  fromJSON(save: AchievementsSave | undefined): void {
    this.unlocked.clear();
    for (const id of save?.unlocked ?? []) {
      if (AchievementList.some((achievement) => achievement.id === id)) this.unlocked.add(id);
    }
  }
}
