import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { TargetKind } from '../../modules/GameConstants';
import { cursorFor, formatInt, formatNumber, spriteUrl } from '../../modules/GameHelper';
import { getItem } from '../../modules/items/ItemList';
import { Bar } from '../shared/Bar';
import { Panel } from '../shared/Panel';
import { Sprite } from '../shared/Sprite';
import { ZoneResources } from './ZoneResources';

/** Los numeritos de dano se limpian solos cuando termina su animacion. */
const SPLAT_LIFETIME_MS = 780;

export function ZonePanel() {
  const g = useGameChannel(['battle', 'zone', 'player', 'settings', 'lunar']);
  const zone = g.zones.current;
  // En un pilar, lo que importa no son los recursos sino el contador: cada
  // bicho que cae aqui baja el escudo, y sin verlo el farmeo es a ciegas.
  const pillar = zone.pillarId
    ? g.lunar.pillarViews().find((candidate) => candidate.id === zone.pillarId)
    : undefined;
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

  useEffect(() => () => {
    if (hitTimer.current) window.clearTimeout(hitTimer.current);
  }, []);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      game().battle.click(x, y);

      setHit(true);
      if (hitTimer.current) window.clearTimeout(hitTimer.current);
      hitTimer.current = window.setTimeout(() => setHit(false), 70);
    },
    [],
  );

  const showSplats = g.save.settings.showDamageNumbers;
  const blocked = g.battle.blockedReason;

  return (
    <Panel title={zone.name} aside={zone.description}>
      <div
        className="arena"
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
        {/* Fondo de bioma sacado de la wiki, con un tinte encima para que el
            sprite del objetivo no se pierda contra la imagen. */}
        <div
          className="arena__bg"
          style={{ backgroundImage: `url("${spriteUrl(zone.background)}")` }}
        />
        <div
          className="arena__tint"
          style={{ background: `linear-gradient(180deg, ${zone.palette[0]}, ${zone.palette[1]})` }}
        />

        {target ? (
          <div className="arena__target">
            <Sprite
              name={target.sprite}
              size={target.kind === TargetKind.Enemy ? 128 : 96}
              className={`arena__sprite${hit ? ' arena__sprite--hit' : ''}`}
            />
            <div className="arena__name">
              {target.name}
              <span className="faint">
                {' '}
                · {target.kind === TargetKind.Enemy ? 'enemigo' : 'nodo'}
              </span>
            </div>
            <div style={{ width: 260 }}>
              <Bar
                value={target.health}
                max={target.maxHealth}
                variant={target.kind === TargetKind.Enemy ? 'boss' : 'target'}
                label={`${formatInt(Math.ceil(target.health))} / ${formatInt(target.maxHealth)}`}
              />
            </div>
          </div>
        ) : (
          <p className="arena__empty">Buscando algo que romper...</p>
        )}

        {blocked ? <p className="arena__hint">{blocked}</p> : null}

        {showSplats &&
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

      {pillar ? (
        <div className="event event--pillars" style={{ marginTop: 10 }}>
          <Sprite name={pillar.sprite} size={40} className="event__sprite" />
          <div className="event__body">
            <div className="event__title">
              {pillar.vulnerable
                ? 'Escudo caido: ve a Jefes y rompe el pilar'
                : `Escudo del ${pillar.name}`}
            </div>
            <Bar
              value={pillar.kills}
              max={pillar.required}
              variant={pillar.vulnerable ? 'boss' : 'progress'}
              label={`${formatInt(pillar.kills)} / ${formatInt(pillar.required)} bichos`}
            />
          </div>
        </div>
      ) : null}

      <div className="row row--wrap" style={{ marginTop: 10 }}>
        <button className="btn btn--small" onClick={() => game().battle.skip()}>
          Saltar objetivo
        </button>
        <span className="faint">
          Dano por click <b>{formatNumber(g.player.stats.clickDamage)}</b> · DPS pasivo{' '}
          <b>{formatNumber(g.player.stats.autoDps)}</b>
        </span>
      </div>

      {g.save.settings.showLootFeed && g.battle.loot.length > 0 ? (
        <div style={{ marginTop: 12 }}>
          <div className="faint" style={{ marginBottom: 4 }}>
            Botin reciente
          </div>
          <div className="loot">
            {g.battle.loot.map((line) => (
              <div key={line.id} className={`loot__line${line.rare ? ' loot__line--rare' : ''}`}>
                <Sprite name={line.itemId} size={20} />
                <span>{getItem(line.itemId).name}</span>
                <span className="loot__amount">+{line.amount}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <ZoneResources />
    </Panel>
  );
}
