import { GameEvents } from '../GameEvents';

export type NotificationTone = 'info' | 'success' | 'warning' | 'achievement';

export interface GameNotification {
  id: number;
  text: string;
  tone: NotificationTone;
  /** Sprite opcional que acompana al mensaje. */
  icon?: string;
  createdAt: number;
}

const MAX_VISIBLE = 5;
const LIFETIME_MS = 4500;

/** Cola de avisos flotantes. */
export class Notifier {
  notifications: GameNotification[] = [];
  private seq = 0;

  push(text: string, tone: NotificationTone = 'info', icon?: string): void {
    this.seq += 1;
    this.notifications = [
      { id: this.seq, text, tone, icon, createdAt: Date.now() },
      ...this.notifications,
    ].slice(0, MAX_VISIBLE);
    GameEvents.notify('notifications');
  }

  dismiss(id: number): void {
    this.notifications = this.notifications.filter((notification) => notification.id !== id);
    GameEvents.notify('notifications');
  }

  /** Caduca los avisos viejos. Se llama desde el bucle de juego. */
  tick(): void {
    if (this.notifications.length === 0) return;
    const now = Date.now();
    const alive = this.notifications.filter(
      (notification) => now - notification.createdAt < LIFETIME_MS,
    );
    if (alive.length === this.notifications.length) return;
    this.notifications = alive;
    GameEvents.notify('notifications');
  }
}
