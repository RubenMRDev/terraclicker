/**
 * Mini bus reactivo que hace de puente entre la logica del juego (clases planas,
 * como en pokeclicker) y React. Cada canal lleva su propio contador de version;
 * los componentes se suscriben solo a los canales que les afectan, asi un tick
 * que solo mueve la vida del objetivo no repinta el inventario entero.
 */

export type Channel =
  | 'battle'
  | 'boss'
  | 'inventory'
  | 'player'
  | 'wallet'
  | 'zone'
  | 'crafting'
  | 'achievements'
  | 'statistics'
  | 'notifications'
  | 'settings'
  | 'npcs'
  | 'lunar'
  | 'invasions'
  | 'save';

type Listener = () => void;

class GameEventBus {
  private versions = new Map<Channel, number>();
  private listeners = new Map<Channel, Set<Listener>>();
  private dirty = new Set<Channel>();
  private flushHandle: number | null = null;

  getVersion(channel: Channel): number {
    return this.versions.get(channel) ?? 0;
  }

  subscribe(channel: Channel, listener: Listener): () => void {
    let set = this.listeners.get(channel);
    if (!set) {
      set = new Set();
      this.listeners.set(channel, set);
    }
    set.add(listener);
    return () => {
      set.delete(listener);
    };
  }

  /**
   * Marca canales como sucios. El aviso a React se agrupa en el siguiente frame,
   * de modo que los muchos notify() de un mismo tick provocan un unico repintado.
   */
  notify(...channels: Channel[]): void {
    for (const channel of channels) this.dirty.add(channel);
    if (this.flushHandle !== null) return;
    this.flushHandle = requestAnimationFrame(() => {
      this.flushHandle = null;
      this.flush();
    });
  }

  /** Aviso inmediato, sin esperar al frame. Para acciones directas del usuario. */
  notifySync(...channels: Channel[]): void {
    for (const channel of channels) this.dirty.add(channel);
    this.flush();
  }

  private flush(): void {
    if (this.dirty.size === 0) return;
    const channels = [...this.dirty];
    this.dirty.clear();
    for (const channel of channels) {
      this.versions.set(channel, this.getVersion(channel) + 1);
      const set = this.listeners.get(channel);
      if (!set) continue;
      for (const listener of [...set]) listener();
    }
  }
}

export const GameEvents = new GameEventBus();
