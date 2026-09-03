import { useEffect, useRef, type ReactNode } from 'react';
import { useGameChannel } from '../../hooks/useGame';

interface ModalProps {
  title: ReactNode;
  aside?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  /** Ancho maximo del panel. Las tiendas caben en 560; el taller pide mas. */
  width?: number;
  /**
   * Nivel de apilado. 0 es el modal de base y 1 el submenu que se abre encima:
   * sube el z-index y lo pinta por delante, para que se lea que hay uno detras
   * del otro.
   */
  level?: number;
  /** Sprite que acompana al titulo. */
  icon?: ReactNode;
}

/**
 * Pila de modales abiertos. Hace falta que sea de modulo y no estado de React
 * por dos cosas que se hacen a nivel de documento y no de componente:
 *
 * - El bloqueo del scroll del body. Con un modal y su submenu abiertos, los dos
 *   guardaban y restauraban `overflow` por su cuenta, y al cerrarse los dos en
 *   el mismo render el ultimo en limpiar volvia a poner 'hidden' y dejaba la
 *   pagina sin scroll para siempre. Ahora se bloquea al abrir el primero y se
 *   suelta al cerrar el ultimo.
 * - Escape. Solo tiene que cerrar el de arriba, no todos a la vez.
 */
const stack: Array<{ close: () => void }> = [];
let savedOverflow: string | null = null;

function onDocumentKeyDown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return;
  const top = stack[stack.length - 1];
  if (!top) return;
  event.preventDefault();
  top.close();
}

function pushModal(entry: { close: () => void }): void {
  if (stack.length === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onDocumentKeyDown);
  }
  stack.push(entry);
}

function popModal(entry: { close: () => void }): void {
  const index = stack.indexOf(entry);
  if (index >= 0) stack.splice(index, 1);
  if (stack.length > 0) return;
  document.removeEventListener('keydown', onDocumentKeyDown);
  document.body.style.overflow = savedOverflow ?? '';
  savedOverflow = null;
}

/**
 * Ventana modal con el marco del juego, apilable.
 *
 * Las usan los vecinos: sus menus (tienda, taller de reforjado) no caben
 * desplegados dentro de una rejilla de tres columnas sin descolocar el resto de
 * las tarjetas, y como modal se comportan como los submenus del propio Terraria.
 *
 * Se cierra con Escape, con el boton o pulsando fuera. La animacion de entrada
 * respeta el ajuste de animaciones y `prefers-reduced-motion`.
 */
export function Modal({
  title,
  aside,
  onClose,
  children,
  width = 640,
  level = 0,
  icon,
}: ModalProps) {
  const g = useGameChannel('settings');
  const closeRef = useRef<HTMLButtonElement>(null);
  // onClose puede cambiar en cada render; la entrada de la pila lee siempre el
  // ultimo a traves de la ref, asi que el efecto no tiene que reengancharse. La
  // ref se escribe en un efecto y no en el render, que es donde no se toca.
  const closeHandler = useRef(onClose);
  useEffect(() => {
    closeHandler.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const entry = { close: () => closeHandler.current() };
    pushModal(entry);
    closeRef.current?.focus();
    return () => popModal(entry);
  }, []);

  const animated = g.save.settings.animations;

  return (
    <div
      className={`modal__backdrop${animated ? ' modal__backdrop--in' : ''}`}
      style={{ zIndex: 100 + level * 10 }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`modal${animated ? ' modal--in' : ''}`}
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        // El click dentro no debe cerrar: solo el de fuera.
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__title">
          <span className="row">
            {icon}
            {title}
          </span>
          <span className="row">
            {aside ? <small>{aside}</small> : null}
            <button ref={closeRef} className="btn btn--small" onClick={onClose}>
              Cerrar
            </button>
          </span>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
