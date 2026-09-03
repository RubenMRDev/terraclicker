import { SAVE_VERSION } from '../GameConstants';
import type { GameSave } from './SaveTypes';

/**
 * Cadena de migraciones. Cada entrada recibe el save en la version `from` y lo
 * devuelve en `from + 1`. Al anadir contenido que cambie el formato: sube
 * SAVE_VERSION y mete aqui la funcion correspondiente.
 */
type Migration = (save: Record<string, unknown>) => Record<string, unknown>;

const migrations: Record<number, Migration> = {
  // v1 -> v2: llegan el mana y los rasgos. Ambos tienen valor por defecto en
  // sus fromJSON, asi que basta con marcar la version.
  1: (save) => ({ ...save, version: 2 }),
  // v2 -> v3: llegan los NPCs y el evento lunar. Los dos arrancan vacios y sus
  // fromJSON tienen valores por defecto, asi que basta con marcar la version.
  // Lo que si cambia es la Luna: antes se abria con Golem y ahora con el Senor
  // de la Luna, asi que una partida vieja que ya estuviera dentro se queda con
  // la zona bloqueada hasta hacer el evento. Zones.fromJSON la devuelve al
  // Bosque si eso pasa, que es lo mismo que hace con cualquier zona invalida.
  2: (save) => ({ ...save, version: 3 }),
  // v3 -> v4: llegan las invasiones y los ajustes de autoclicker. Todo tiene
  // valor por defecto, asi que basta con marcar la version.
  3: (save) => ({ ...save, version: 4 }),
  // v4 -> v5: el autoclicker de zona pasa a estar siempre encendido, asi que su
  // ajuste desaparece. Se quita del save para no dejar una clave muerta que
  // luego parezca que sigue haciendo algo.
  4: (save) => {
    const settings = { ...((save.settings as Record<string, unknown>) ?? {}) };
    delete settings.autoClick;
    return { ...save, settings, version: 5 };
  },
};

const looksLikeSave = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' &&
  value !== null &&
  'version' in value &&
  typeof (value as { version: unknown }).version === 'number';

/**
 * Lleva un save cualquiera a la version actual. Devuelve null si no se reconoce
 * o si viene de una version mas nueva que la del juego (no se puede degradar).
 */
export function migrate(raw: unknown): GameSave | null {
  if (!looksLikeSave(raw)) return null;

  let save = raw;
  let version = save.version as number;

  if (version > SAVE_VERSION) {
    console.warn(`Partida de una version mas nueva (${version} > ${SAVE_VERSION}).`);
    return null;
  }

  while (version < SAVE_VERSION) {
    const migration = migrations[version];
    if (!migration) {
      console.warn(`Falta la migracion de la version ${version}.`);
      return null;
    }
    save = migration(save);
    version = (save.version as number) ?? version + 1;
  }

  return save as unknown as GameSave;
}
