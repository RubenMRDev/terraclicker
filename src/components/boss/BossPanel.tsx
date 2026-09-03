import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { BossPhase, EquipmentSlot } from '../../modules/GameConstants';
import { cursorFor, formatInt, formatNumber, spriteUrl } from '../../modules/GameHelper';
import type { BossDef } from '../../modules/bosses/BossList';
import { Bar } from '../shared/Bar';
import { Panel } from '../shared/Panel';
import { Sprite } from '../shared/Sprite';
import { BossCard } from './BossCard';
import { PotionBar } from './PotionBar';

const HIT_LIFETIME_MS = 780;

export function BossPanel() {
  const g = useGameChannel(['boss', 'player', 'inventory', 'zone', 'statistics', 'lunar']);
  const { bosses } = g;
  const [filter, setFilter] = useState<'all' | 'pending'>('all');

  useEffect(() => {
    if (bosses.hits.length === 0) return;
    const timers = bosses.hits.map((hit) =>
      window.setTimeout(() => bosses.clearHit(hit.id), HIT_LIFETIME_MS),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [bosses, bosses.hits]);

  const handleClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    game().bosses.click(x, y);
  }, []);

  if (bosses.state === BossPhase.Won || bosses.state === BossPhase.Lost) {
    const won = bosses.state === BossPhase.Won;
    return (
      <Panel title={won ? 'Victoria' : 'Derrota'}>
        <div className={`bossfight__result bossfight__result--${won ? 'won' : 'lost'}`}>
          <Sprite name={bosses.boss?.sprite ?? 'Eye_of_Cthulhu'} size={128} />
          <h2>{won ? `${bosses.boss?.name} derrotado` : 'Has caido'}</h2>
          <p className="muted">
            {won ? 'El botin ya esta en tu mochila.' : 'Mejora el equipo y vuelve a intentarlo.'}
          </p>
          <div className="bossfight__log" style={{ width: '100%', maxWidth: 420 }}>
            {bosses.log.map((line) => (
              <div
                key={line.id}
                className={`bossfight__log__line bossfight__log__line--${line.tone}`}
              >
                {line.text}
              </div>
            ))}
          </div>
          <button className="btn btn--primary" onClick={() => game().bosses.leave()}>
            Volver a la zona
          </button>
        </div>
      </Panel>
    );
  }

  if (bosses.isFighting && bosses.boss) {
    const boss = bosses.boss;
    const enraged = (bosses.phase?.damageMultiplier ?? 1) > 1;
    // La pelea ocurre en la zona del jefe, asi que hereda su fondo de bioma.
    const arena = g.zones.all.find((zone) => zone.id === boss.zoneId);
    return (
      <Panel title={boss.name} aside={bosses.phase?.name}>
        <div className="bossfight">
          <div
            className="bossfight__arena"
            style={{ cursor: cursorFor(g.player.equippedIn(EquipmentSlot.Weapon)) }}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={`Atacar a ${boss.name}`}
            onKeyDown={(event) => {
              if (event.key === ' ' || event.key === 'Enter') {
                event.preventDefault();
                game().bosses.click();
              }
            }}
          >
            {arena ? (
              <>
                <div
                  className="arena__bg"
                  style={{ backgroundImage: `url("${spriteUrl(arena.background)}")` }}
                />
                <div
                  className="arena__tint"
                  style={{
                    background: `linear-gradient(180deg, ${arena.palette[0]}, ${arena.palette[1]})`,
                  }}
                />
              </>
            ) : null}
            <Sprite
              name={boss.sprite}
              size={190}
              className={`bossfight__sprite${enraged ? ' bossfight__sprite--enraged' : ''}`}
            />
            <span className="bossfight__phase">{bosses.phase?.name}</span>
            {bosses.hits.map((hit) => (
              <span
                key={hit.id}
                className={`splat splat--${hit.critical ? 'crit' : 'normal'}`}
                style={{ left: `${hit.x}%`, top: `${hit.y}%` }}
              >
                {formatNumber(hit.amount)}
              </span>
            ))}
          </div>

          <Bar
            value={bosses.health}
            max={boss.health}
            variant="boss"
            label={`${formatInt(Math.ceil(bosses.health))} / ${formatInt(boss.health)}`}
          />
          <Bar
            value={g.player.health}
            max={g.player.maxHealth}
            variant="health"
            label={`Tu vida: ${Math.ceil(g.player.health)} / ${g.player.maxHealth}`}
          />

          <PotionBar />

          <div className="row row--wrap">
            {bosses.canFlee ? (
              <button className="btn btn--danger btn--small" onClick={() => game().bosses.leave()}>
                Huir
              </button>
            ) : (
              <span className="event__title">De esta no se huye</span>
            )}
            <span className="faint">
              {boss.harmless
                ? `No devuelve dano · defensa ${g.player.stats.defense}`
                : `Siguiente ataque en ${(Math.max(0, bosses.nextAttackIn) / 1000).toFixed(1)}s · defensa ${g.player.stats.defense}`}
            </span>
          </div>

          <div className="bossfight__log">
            {bosses.log.map((line) => (
              <div
                key={line.id}
                className={`bossfight__log__line bossfight__log__line--${line.tone}`}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </Panel>
    );
  }

  // -------------------------------------------------------------- seleccion
  // Los jefes se agrupan por cercania: los de aqui, los de zonas que ya tienes
  // abiertas (con boton para viajar) y los que aun no alcanzas. Antes los de
  // fuera eran una fila de nombres muertos sin botin ni forma de llegar.
  const bucketOf = (boss: BossDef): 'here' | 'open' | 'closed' => {
    if (boss.zoneId === g.zones.current.id) return 'here';
    const zone = g.zones.all.find((candidate) => candidate.id === boss.zoneId);
    return zone && g.zones.isUnlocked(zone) ? 'open' : 'closed';
  };

  const visible = bosses.all.filter((boss) => {
    // Los pilares solo existen mientras el evento los tiene abiertos.
    if (boss.pillarId && !g.lunar.pillarsOpen) return false;
    if (boss.id === 'lunatic_cultist' && g.statistics.defeatsOf('lunatic_cultist') === 0) {
      return g.lunar.imminent === 'lunatic_cultist';
    }
    if (filter === 'pending' && g.statistics.defeatsOf(boss.id) > 0) return false;
    return true;
  });

  const here = visible.filter((boss) => bucketOf(boss) === 'here');
  const open = visible.filter((boss) => bucketOf(boss) === 'open');
  const closed = visible.filter((boss) => bucketOf(boss) === 'closed');
  const cleared = bosses.all.filter((boss) => g.statistics.defeatsOf(boss.id) > 0).length;

  return (
    <>
      <Panel title="Jefes" aside={`${cleared}/${bosses.all.length} derrotados`}>
        <div className="tabs">
          <button
            className={`tab${filter === 'all' ? ' tab--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button
            className={`tab${filter === 'pending' ? ' tab--active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Sin derrotar · {bosses.all.length - cleared}
          </button>
        </div>

        <div className="faint" style={{ marginBottom: 6 }}>
          En {g.zones.current.name}
        </div>
        {here.length === 0 ? (
          <p className="empty-state">Aqui no se puede invocar a ningun jefe.</p>
        ) : (
          <div className="grid grid--wide">
            {here.map((boss) => (
              <BossCard key={boss.id} boss={boss} />
            ))}
          </div>
        )}
      </Panel>

      {open.length > 0 ? (
        <Panel title="En zonas que ya tienes abiertas" aside="el boton te lleva alli">
          <div className="grid grid--wide">
            {open.map((boss) => (
              <BossCard key={boss.id} boss={boss} />
            ))}
          </div>
        </Panel>
      ) : null}

      {closed.length > 0 ? (
        <Panel title="Todavia fuera de alcance">
          <div className="grid grid--wide">
            {closed.map((boss) => (
              <BossCard key={boss.id} boss={boss} />
            ))}
          </div>
        </Panel>
      ) : null}
    </>
  );
}
