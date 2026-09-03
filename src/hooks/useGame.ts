import { useCallback, useSyncExternalStore } from 'react';
import { App } from '../modules/App';
import type { Game } from '../modules/Game';
import { GameEvents, type Channel } from '../modules/GameEvents';

/**
 * Suscribe un componente a uno o varios canales del juego. El snapshot es la
 * suma de versiones de esos canales: cambia solo cuando algo relevante se
 * modifica, y entonces el componente vuelve a leer el estado vivo del modulo.
 */
export function useGameChannel(channels: Channel | Channel[]): Game {
  const list = Array.isArray(channels) ? channels : [channels];
  const key = list.join('|');

  const subscribe = useCallback(
    (onChange: () => void) => {
      const unsubs = key.split('|').map((channel) => GameEvents.subscribe(channel as Channel, onChange));
      return () => unsubs.forEach((unsub) => unsub());
    },
    [key],
  );

  const getSnapshot = useCallback(
    () => key.split('|').reduce((sum, channel) => sum + GameEvents.getVersion(channel as Channel), 0),
    [key],
  );

  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return App.game;
}

/** Acceso directo al juego sin suscripcion, para manejadores de eventos. */
export const game = (): Game => App.game;
