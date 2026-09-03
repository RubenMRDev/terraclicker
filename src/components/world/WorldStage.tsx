import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { TargetKind, ToolKind } from '../../modules/GameConstants';
import { cursorFor, formatInt, formatNumber, spriteUrl } from '../../modules/GameHelper';
import { NodeList } from '../../modules/gathering/GatherNode';
import { Sprite } from '../shared/Sprite';

/** Los numeritos de dano se limpian solos cuando termina su animacion. */
const SPLAT_LIFETIME_MS = 780;

/**
 * El mundo. Ocupa la ventana entera: el fondo de bioma a tamano real, sin caja
 * ni marco, y el objetivo en medio a la escala que le corresponde. Todo lo demas
 * de la interfaz son placas que flotan por encima de esto.
 *
 * El fondo de bioma era lo que el juego tenia mejor y lo estaba ensenando dentro
 * de un recuadro de 900x240: aqui es la pantalla.
 */
export function WorldStage({ onOpenZoneInfo }: { onOpenZoneInfo: () => void }) {
  const g = useGameChannel(['battle', 'zone', 'player', 'settings', 'lunar', 'invasions']);
  const zone = g.zones.current;
  const target = g.battle.target;
  const [hit, setHit] = useState(false);
  const hitTimer = useRef<number | null>(null);

  // El bucle no borra los splats: lo hace la UI cuando la animacion acaba.
  useEffect(() => {
    if (g.battle.splats.length === 0) return;
    const timers = g.battle.splats.map((splat) =>
      window.setTimeout(() => g.battle.clearSplat(splat.id), SPLAT_LIFETIME_MS),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [g.battle, g.battle.splats]);

  useEffect(
    () => () => {
      if (hitTimer.current) window.clearTimeout(hitTimer.current);
    },
    [],
  );

  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    game().battle.click(x, y);

    setHit(true);
    if (hitTimer.current) window.clearTimeout(hitTimer.current);
    hitTimer.current = window.setTimeout(() => setHit(false), 70);
  }, []);

  const blocked = g.battle.blockedReason;
  const isEnemy = target?.kind === TargetKind.Enemy;

  // Lo mas alto que pide la zona con cada herramienta. Va debajo del nombre
  // porque "llega mi pico a lo que hay aqui" es la duda con la que se viaja, y
  // porque quedarse con un pico corto delante de un bloque que no cede fue
  // exactamente lo que se rompio una vez con la clorofita.
  const need = (tool: ToolKind) =>
    Math.max(
      0,
      ...zone.nodes.map((id) => (NodeList[id]?.tool === tool ? NodeList[id].toolPower : 0)),
    );
  const needPick = need(ToolKind.Pickaxe);
  const needAxe = need(ToolKind.Axe);
  const { pickPower, axePower } = g.player.stats;
  const shortOf =
    needPick > pickPower
      ? { tool: 'pico', need: needPick, have: pickPower }
      : needAxe > axePower
        ? { tool: 'hacha', need: needAxe, have: axePower }
        : null;

  return (
    <div
      className="world"
      style={{ cursor: cursorFor(g.battle.cursorSprite) }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={target ? `Golpear ${target.name}` : 'Esperando objetivo'}
      onKeyDown={(event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          game().battle.click();
        }
      }}
    >
      {/* El fondo del bioma, a sangre. La imagen es de 16 px de alto escalada
          sin suavizar, asi que se estira sin pixelarse de forma sucia. */}
      <div
        className={`world__bg${zone.tiled ? ' world__bg--tiled' : ''}`}
        style={{ backgroundImage: `url("${spriteUrl(zone.background)}")` }}
      />
      <div
        className="world__tint"
        style={{ background: `linear-gradient(180deg, ${zone.palette[0]}, ${zone.palette[1]})` }}
      />
      <div className="world__vignette" />

      <button
        className="world__name"
        onClick={(event) => {
          // El nombre esta dentro del area clicable del mundo: sin esto, abrir
          // la ficha de la zona contaria tambien como un golpe.
          event.stopPropagation();
          onOpenZoneInfo();
        }}
        title="Ver que hay en esta zona"
      >
        <span className="world__name__zone">{zone.name}</span>
        <span className={`world__name__need${shortOf ? ' world__name__need--short' : ''}`}>
          {shortOf
            ? `te falta ${shortOf.tool} ${shortOf.need}, tienes ${shortOf.have}`
            : needPick > 0
              ? `pico hasta ${needPick} · el tuyo ${pickPower}`
              : needAxe > 0
                ? `hacha hasta ${needAxe} · la tuya ${axePower}`
                : 'aqui no se pica, se pelea'}
        </span>
      </button>

      {target ? (
        <div className="world__target">
          {/* La peana tiene alto fijo y el sprite apoya en su suelo: un enemigo
              mide 208 y un nodo 156, y sin esto el nombre, la barra y el boton
              subian y bajaban con cada objetivo que salia. */}
          <div className="world__mount">
            <Sprite
              name={target.sprite}
              size={isEnemy ? 208 : 156}
              className={`world__sprite${hit ? ' world__sprite--hit' : ''}`}
            />
          </div>
          <div className="world__label">
            {target.name}
            <span className="world__label__kind">{isEnemy ? 'enemigo' : 'nodo'}</span>
          </div>
          <div className="world__hp">
            <div
              className="world__hp__fill"
              style={{ transform: `scaleX(${target.health / target.maxHealth})` }}
            />
            <span className="world__hp__text">
              {formatInt(Math.ceil(target.health))} / {formatInt(target.maxHealth)}
            </span>
          </div>
          <button
            className="world__skip"
            onClick={(event) => {
              event.stopPropagation();
              game().battle.skip();
            }}
            title="Descarta el objetivo actual y saca otro"
          >
            Saltar objetivo
          </button>
        </div>
      ) : (
        <p className="world__empty">Buscando algo que romper...</p>
      )}

      {blocked ? <p className="world__blocked">{blocked}</p> : null}

      {g.save.settings.showDamageNumbers &&
        g.battle.splats.map((splat) => (
          <span
            key={splat.id}
            className={`splat splat--${splat.critical ? 'crit' : 'normal'}`}
            style={{ left: `${splat.x}%`, top: `${splat.y}%` }}
          >
            {splat.critical ? '¡' : ''}
            {formatNumber(splat.amount)}
            {splat.critical ? '!' : ''}
          </span>
        ))}

    </div>
  );
}
