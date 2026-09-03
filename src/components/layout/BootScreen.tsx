import type { PreloadProgress } from '../../modules/assets/Preloader';
import { Bar } from '../shared/Bar';

/** Pantalla de carga mientras se precargan todos los sprites de la wiki. */
export function BootScreen({ loaded, total }: PreloadProgress) {
  return (
    <div className="boot">
      <div className="boot__logo">TerraClicker</div>
      <p className="boot__hint">Cargando sprites...</p>
      <div className="boot__bar">
        <Bar
          value={loaded}
          max={Math.max(total, 1)}
          variant="progress"
          label={total > 0 ? `${loaded} / ${total}` : ''}
        />
      </div>
    </div>
  );
}
