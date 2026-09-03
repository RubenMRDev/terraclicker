import { ASSET_BY_NAME } from '../../assets/generated/assetIndex';
import { spriteUrl } from '../GameHelper';

export interface PreloadProgress {
  loaded: number;
  total: number;
}

/** Cuantas imagenes se piden a la vez. Mas no acelera: el navegador las encola igual. */
const CONCURRENCY = 12;

/**
 * Carga todos los sprites antes de arrancar la partida. Son pocos cientos de KB
 * y evita el parpadeo de cada objetivo nuevo: cuando el juego empieza, todas las
 * imagenes estan ya en la cache del navegador.
 */
export async function preloadSprites(
  onProgress?: (progress: PreloadProgress) => void,
): Promise<PreloadProgress> {
  const names = Object.keys(ASSET_BY_NAME);
  const total = names.length;
  let loaded = 0;

  const loadOne = (name: string) =>
    new Promise<void>((resolve) => {
      const url = spriteUrl(name);
      if (!url) {
        resolve();
        return;
      }
      const image = new Image();
      // Un sprite que falle no debe bloquear el arranque: se resuelve igual y la
      // etiqueta <img> mostrara su placeholder cuando toque pintarlo.
      const done = () => {
        loaded += 1;
        onProgress?.({ loaded, total });
        resolve();
      };
      image.onload = done;
      image.onerror = done;
      image.src = url;
    });

  const queue = [...names];
  const workers = Array.from({ length: Math.min(CONCURRENCY, queue.length) }, async () => {
    for (let next = queue.pop(); next !== undefined; next = queue.pop()) {
      await loadOne(next);
    }
  });
  await Promise.all(workers);

  return { loaded, total };
}
