import { App } from '../App';
import { SAVE_KEY, SAVE_VERSION } from '../GameConstants';
import { GameEvents } from '../GameEvents';
import { DEFAULT_SETTINGS, type GameSave, type SettingsSave } from './SaveTypes';
import { migrate } from './SaveMigrations';

/**
 * Persistencia en localStorage con version y migraciones, como el Save.ts de
 * pokeclicker. Un save de una version anterior se pasa por la cadena de
 * migraciones en vez de descartarse.
 */
export class Save {
  settings: SettingsSave = { ...DEFAULT_SETTINGS };
  lastSavedAt = 0;

  serialize(): GameSave {
    const game = App.game;
    return {
      version: SAVE_VERSION,
      savedAt: Date.now(),
      player: game.player.toJSON(),
      inventory: game.inventory.toJSON(),
      wallet: game.wallet.toJSON(),
      zones: game.zones.toJSON(),
      statistics: game.statistics.toJSON(),
      achievements: game.achievements.toJSON(),
      npcs: game.npcs.toJSON(),
      lunar: game.lunar.toJSON(),
      invasions: game.invasions.toJSON(),
      settings: this.settings,
    };
  }

  save(): boolean {
    try {
      const data = this.serialize();
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      this.lastSavedAt = data.savedAt;
      GameEvents.notify('save');
      return true;
    } catch (error) {
      // Cuota llena o modo privado: avisamos en vez de fallar en silencio.
      console.error('No se ha podido guardar la partida', error);
      App.game.notifier.push('No se ha podido guardar la partida', 'warning');
      return false;
    }
  }

  /** Devuelve true si habia una partida guardada y se ha cargado. */
  load(): boolean {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(SAVE_KEY);
    } catch (error) {
      console.error('No se ha podido leer el almacenamiento local', error);
      return false;
    }
    if (!raw) return false;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      console.error('La partida guardada esta corrupta', error);
      return false;
    }

    const data = migrate(parsed);
    if (!data) return false;

    const game = App.game;
    game.player.fromJSON(data.player);
    game.inventory.fromJSON(data.inventory);
    game.wallet.fromJSON(data.wallet);
    game.zones.fromJSON(data.zones);
    game.statistics.fromJSON(data.statistics);
    game.achievements.fromJSON(data.achievements);
    // Los vecinos van antes de invalidar al jugador: sus bonificaciones entran
    // en las stats derivadas.
    game.npcs.fromJSON(data.npcs);
    game.lunar.fromJSON(data.lunar);
    game.invasions.fromJSON(data.invasions);
    game.player.invalidate();
    this.settings = { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) };
    this.lastSavedAt = data.savedAt ?? 0;

    GameEvents.notifySync(
      'player',
      'inventory',
      'wallet',
      'zone',
      'statistics',
      'achievements',
      'npcs',
      'lunar',
      'invasions',
      'settings',
    );
    return true;
  }

  setSetting<K extends keyof SettingsSave>(key: K, value: SettingsSave[K]): void {
    this.settings = { ...this.settings, [key]: value };
    GameEvents.notifySync('settings');
    this.save();
  }

  /** Exporta la partida en base64, para copiarla o pasarla a otro navegador. */
  export(): string {
    const json = JSON.stringify(this.serialize());
    // btoa no admite caracteres fuera de latin1: codificamos a UTF-8 antes.
    const bytes = new TextEncoder().encode(json);
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }

  /** Importa una partida exportada. Devuelve un mensaje de error o null si fue bien. */
  import(encoded: string): string | null {
    try {
      const binary = atob(encoded.trim());
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
      const data = migrate(parsed);
      if (!data) return 'El fichero no es una partida valida de TerraClicker.';
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return this.load() ? null : 'No se ha podido cargar la partida importada.';
    } catch {
      return 'El texto no es una partida valida.';
    }
  }

  /** Borra la partida. El reinicio efectivo lo hace Game.hardReset(). */
  clear(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (error) {
      console.error('No se ha podido borrar la partida', error);
    }
  }
}
