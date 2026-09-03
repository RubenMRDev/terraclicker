import { useEffect, useState } from 'react';

/** Por debajo de esto el HUD se reorganiza en vez de encogerse. */
export const NARROW_QUERY = '(max-width: 820px)';

/**
 * Si la pantalla es estrecha. Hace falta en JS y no solo en CSS porque en movil
 * el HUD no cambia de tamano, cambia de estructura: la ficha completa del
 * personaje, el equipo y las diecisiete zonas pasan a abrirse en modal, porque
 * de otra forma no caben sin scroll y el requisito es que no haya scroll.
 */
export function useNarrow(): boolean {
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(NARROW_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    onChange();
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return narrow;
}
