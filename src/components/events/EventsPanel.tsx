import { game, useGameChannel } from '../../hooks/useGame';
import { useUi } from '../../hooks/useUi';
import { formatInt } from '../../modules/GameHelper';
import { totalKills } from '../../modules/events/InvasionList';
import { LunarStage } from '../../modules/events/LunarStage';
import { getItem } from '../../modules/items/ItemList';
import type { DropDef } from '../../modules/items/ItemType';
import { Bar } from '../shared/Bar';
import { Coins } from '../shared/Coins';
import { Panel } from '../shared/Panel';
import { Requirements } from '../shared/Requirements';
import { Sprite } from '../shared/Sprite';

function Rewards({ drops }: { drops: DropDef[] }) {
  if (drops.length === 0) return null;
  return (
    <div className="recipe__inputs">
      {drops.map((drop) => (
        <span
          key={drop.itemId}
          className={`recipe__input${drop.chance >= 1 ? ' recipe__input--ok' : ''}`}
          title={getItem(drop.itemId).name}
        >
          <Sprite name={drop.itemId} size={14} />
          {drop.min === drop.max ? `x${drop.min}` : `x${drop.min}-${drop.max}`}
          {drop.chance < 1 ? ` · ${Math.round(drop.chance * 100)}%` : ''}
        </span>
      ))}
    </div>
  );
}

/**
 * Los eventos: las cinco invasiones y el estado del evento lunar. Una invasion
 * sustituye la fauna de la zona en la que estes mientras dura, asi que se lanza
 * desde aqui y se pelea donde quieras.
 */
export function EventsPanel() {
  const g = useGameChannel([
    'invasions',
    'lunar',
    'inventory',
    'wallet',
    'statistics',
    'zone',
    'boss',
    'npcs',
  ]);
  const { goTo } = useUi();
  const { invasions, lunar } = g;
  const active = invasions.active;

  return (
    <>
      {active ? (
        <Panel title={active.name} aside={`oleada ${invasions.wave + 1} de ${active.waves.length}`}>
          <div className="event event--urgent">
            <Sprite name={active.sprite} size={44} className="event__sprite" />
            <div className="event__body">
              <div className="event__title">
                {invasions.bossReady
                  ? `Las oleadas han caido: sale ${g.bosses.name(active.finalBoss ?? '')}`
                  : `Oleada ${invasions.wave + 1}: faltan ${formatInt(invasions.killsLeft)} bichos`}
              </div>
              <div className="event__text">
                La invasion sustituye la fauna de la zona en la que estes. Mata donde quieras.
              </div>
              <Bar
                value={invasions.progress * 100}
                max={100}
                variant={invasions.bossReady ? 'boss' : 'progress'}
                label={`${Math.round(invasions.progress * 100)}% de ${formatInt(totalKills(active))} bichos`}
              />
            </div>
            <div className="row row--wrap">
              {invasions.bossReady ? (
                <button className="btn btn--danger" onClick={() => goTo('bosses')}>
                  Al jefe
                </button>
              ) : (
                <button className="btn btn--primary" onClick={() => goTo('zone')}>
                  A pelear
                </button>
              )}
              <button className="btn btn--small" onClick={() => game().invasions.abandon()}>
                Abandonar
              </button>
            </div>
          </div>
        </Panel>
      ) : null}

      <Panel
        title="Invasiones"
        aside={`${invasions.cleared.size}/${invasions.all.length} repelidas`}
      >
        <p className="faint" style={{ marginTop: 0 }}>
          La primera vez cada invasion llega sola y sale gratis. Para repetirla hace falta su
          objeto, que se fabrica con lo que ella misma suelta.
        </p>
        <div className="grid grid--wide">
          {invasions.views().map((view) => {
            const trigger = getItem(view.invasion.triggerItem);
            const owned = g.inventory.count(view.invasion.triggerItem);
            return (
              <div
                key={view.invasion.id}
                className={`invasion${view.cleared ? ' invasion--cleared' : ''}${
                  view.available ? '' : ' invasion--locked'
                }`}
              >
                <div className="boss-card__head">
                  <Sprite
                    name={view.invasion.sprite}
                    size={56}
                    className={view.available ? undefined : 'achievement__sprite--locked'}
                  />
                  <div>
                    <div className="boss-card__name">{view.invasion.name}</div>
                    <div className="boss-card__meta">
                      <span>
                        {view.invasion.waves.length} oleadas ·{' '}
                        {formatInt(totalKills(view.invasion))} bichos
                      </span>
                      {view.invasion.finalBoss ? (
                        <span>jefe: {g.bosses.name(view.invasion.finalBoss)}</span>
                      ) : (
                        <span>sin jefe</span>
                      )}
                      <span
                        className={
                          view.invasion.id === active?.id ? 'invasion__state' : undefined
                        }
                      >
                        {view.invasion.id === active?.id
                          ? `en marcha · oleada ${invasions.wave + 1}/${active.waves.length}`
                          : view.completions > 0
                            ? `repelida ${view.completions} ${view.completions === 1 ? 'vez' : 'veces'}`
                            : 'sin repeler todavia'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="boss-card__desc">{view.invasion.description}</p>

                <div className="faint">Recompensa al completarla</div>
                <Rewards drops={view.invasion.rewards} />
                <div className="row faint" style={{ marginTop: 4 }}>
                  <Coins amount={view.invasion.coins[0]} size={14} /> como poco
                </div>

                {view.invasion.id === active?.id ? (
                  <div style={{ marginTop: 6 }}>
                    <Bar
                      value={invasions.progress * 100}
                      max={100}
                      variant={invasions.bossReady ? 'boss' : 'progress'}
                      label={
                        invasions.bossReady
                          ? 'oleadas superadas · falta el jefe'
                          : `${Math.round(invasions.progress * 100)}% · ${formatInt(invasions.killsLeft)} para la siguiente oleada`
                      }
                    />
                  </div>
                ) : null}

                {view.available ? (
                  <div className="row row--wrap" style={{ marginTop: 6 }}>
                    <button
                      className="btn btn--primary"
                      disabled={!view.canStart}
                      onClick={() => game().invasions.start(view.invasion.id)}
                    >
                      {view.canStart
                        ? view.cleared
                          ? `Usar ${trigger.name}`
                          : 'Que venga'
                        : (view.blocked ?? 'No ahora')}
                    </button>
                    {view.cleared ? (
                      <span className="row faint">
                        <Sprite name={trigger.id} size={16} /> {owned}
                      </span>
                    ) : null}
                  </div>
                ) : (
                  <Requirements items={view.requirements} />
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="Evento lunar" aside={lunar.cleared ? 'completado' : undefined}>
        {lunar.stage === LunarStage.Idle ? (
          <p className="faint" style={{ marginTop: 0 }}>
            {g.statistics.defeatsOf('golem') === 0
              ? 'Se abre despues de Golem: entonces los cultistas empiezan a rondar la Mazmorra.'
              : 'Farmea la Mazmorra: cada bicho tiene un 1% de traer al Cultista Lunatico.'}
          </p>
        ) : null}

        {lunar.stage === LunarStage.Done ? (
          <p className="faint" style={{ marginTop: 0 }}>
            El Senor de la Luna ha caido y la Luna esta abierta. Para repetir la pelea hace falta un
            Sello celestial (20 de cada fragmento).
          </p>
        ) : null}

        {lunar.pillarsOpen || lunar.stage === LunarStage.CultistImminent ? (
          <div className="pillars">
            {lunar.pillarViews().map((pillar) => (
              <div
                key={pillar.id}
                className={`pillar${pillar.defeated ? ' pillar--done' : ''}${
                  pillar.vulnerable ? ' pillar--ready' : ''
                }`}
              >
                <Sprite name={pillar.sprite} size={34} />
                <div className="pillar__body">
                  <div className="pillar__name">{pillar.name}</div>
                  {pillar.defeated ? (
                    <div className="faint">destruido</div>
                  ) : (
                    <>
                      <Bar
                        value={pillar.kills}
                        max={pillar.required}
                        slim
                        variant={pillar.vulnerable ? 'boss' : 'progress'}
                      />
                      <div className="faint">
                        {formatInt(pillar.kills)}/{formatInt(pillar.required)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="faint" style={{ marginTop: 8 }}>
          Cuidado: si el Senor de la Luna te mata, el evento se cierra entero y hay que volver a
          buscar al Cultista. Los pilares dejan entre 20 y 30 lingotes de luminita, asi que la
          siguiente intentona se hace con mejor equipo.
        </div>
      </Panel>
    </>
  );
}
