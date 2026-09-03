import { spriteUrl } from '../../modules/GameHelper';

interface SpriteProps {
  /** Nombre del fichero descargado de la wiki, sin extension. */
  name: string;
  size?: number;
  alt?: string;
  className?: string;
  title?: string;
}

/**
 * Pinta un sprite de la wiki escalado a `size` sin suavizado. Si el nombre no
 * esta en el indice, deja un hueco marcado en vez de una imagen rota.
 */
export function Sprite({ name, size = 32, alt, className, title }: SpriteProps) {
  const url = spriteUrl(name);
  const style = { width: size, height: size };

  if (!url) {
    return (
      <span className={`sprite sprite--missing ${className ?? ''}`} style={style} title={name}>
        ?
      </span>
    );
  }

  return (
    <img
      className={`sprite ${className ?? ''}`}
      src={url}
      width={size}
      height={size}
      style={style}
      alt={alt ?? name}
      title={title}
      draggable={false}
      loading="lazy"
    />
  );
}
