import { createContext, useContext, type ReactNode } from 'react';

/**
 * Marca que lo que se pinta ya esta dentro de un modal, que trae su propio marco
 * y su propio titulo. Sin esto, un panel dentro de un modal dibujaba un segundo
 * marco alrededor del primero.
 */
export const FramedContext = createContext(false);

export const useFramed = (): boolean => useContext(FramedContext);

interface PanelProps {
  title?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Marco de panel con la cabecera dorada del juego.
 *
 * Dentro de un modal se queda sin marco: el modal ya lo pone, y una pantalla
 * como el Pueblo, que apila tres paneles, quedaria como tres cajas metidas en
 * otra caja. Ahi el titulo pasa a ser un ladillo con una regla debajo.
 */
export function Panel({ title, aside, children, className }: PanelProps) {
  const framed = useFramed();

  if (framed) {
    return (
      <section className={`bare ${className ?? ''}`}>
        {title || aside ? (
          <header className={`bare__title${title ? '' : ' bare__title--aside'}`}>
            {title ? <span>{title}</span> : null}
            {aside ? <small>{aside}</small> : null}
          </header>
        ) : null}
        {children}
      </section>
    );
  }

  return (
    <section className={`panel ${className ?? ''}`}>
      {title ? (
        <header className="panel__title">
          <span>{title}</span>
          {aside ? <small>{aside}</small> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
