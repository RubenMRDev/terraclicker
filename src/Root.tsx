import { useEffect, useState } from 'react';
import { App } from './App';
import { BootScreen } from './components/layout/BootScreen';
import { preloadSprites, type PreloadProgress } from './modules/assets/Preloader';

/**
 * Mantiene la pantalla de carga hasta que todos los sprites estan en cache, para
 * que ningun objetivo aparezca con la imagen a medio cargar.
 */
export function Root() {
  const [progress, setProgress] = useState<PreloadProgress>({ loaded: 0, total: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    preloadSprites((next) => {
      if (!cancelled) setProgress(next);
    }).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready ? <App /> : <BootScreen {...progress} />;
}
