import { clamp } from '../../modules/GameHelper';

interface BarProps {
  value: number;
  max: number;
  variant?: 'health' | 'mana' | 'target' | 'boss' | 'progress';
  label?: string;
  slim?: boolean;
}

/** Barra de progreso reutilizable (vida, jefe, requisitos). */
export function Bar({ value, max, variant = 'progress', label, slim }: BarProps) {
  const percent = max > 0 ? clamp((value / max) * 100, 0, 100) : 0;
  return (
    <div
      className={`bar bar--${variant}${slim ? ' bar--slim' : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={Math.round(max)}
    >
      <div className="bar__fill" style={{ transform: `scaleX(${percent / 100})` }} />
      {label ? <span className="bar__label">{label}</span> : null}
    </div>
  );
}
