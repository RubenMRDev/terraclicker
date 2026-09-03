import type { ReactNode } from 'react';

interface PanelProps {
  title?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Marco de panel con la cabecera dorada del juego. */
export function Panel({ title, aside, children, className }: PanelProps) {
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
