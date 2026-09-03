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
      /*
       * Eager y no lazy: el Preloader ya se ha traido los 769 sprites antes de
       * dejar jugar, asi que estan en cache y lazy solo conseguia que al
       * recargar el HUD apareciera sin iconos durante un segundo.
       */
      loading="eager"
      decoding="async"
    />
  );
}
