import { game, useGameChannel } from '../../hooks/useGame';
import { useUi } from '../../hooks/useUi';
import { totalKills } from '../../modules/events/InvasionList';
import { LunarStage } from '../../modules/events/LunarStage';
import { formatInt } from '../../modules/GameHelper';
import { Bar } from '../shared/Bar';
import { Sprite } from '../shared/Sprite';

/**
 * El aviso de evento lunar, pegado a la cabecera y por encima de todo lo demas.
 * Es lo que hace que un jefe sea "inminente": no se puede seguir jugando como si
 * no pasara nada, porque el aviso no se va hasta que lo resuelves.
 */
export function EventBanner() {
  const g = useGameChannel(['lunar', 'zone', 'boss', 'statistics', 'invasions']);
  const { goTo } = useUi();
  const { lunar, invasions } = g;

  // Una invasion en marcha manda sobre todo lo demas: es lo que esta pasando
  // ahora mismo en la zona, y hay que poder ver por donde va sin cambiar de
  // pestana.
  if (invasions.active) {
    const invasion = invasions.active;
    const percent = Math.round(invasions.progress * 100);
    return (
      <div className="event event--invasion">
        <Sprite name={invasion.sprite} size={44} className="event__sprite" />
        <div className="event__body">
          <div className="event__title">
            {invasion.name} · oleada {invasions.wave + 1} de {invasion.waves.length} · {percent}%
          </div>
          <div className="event__text">
            {invasions.bossReady
              ? `Las oleadas han caido: sale ${g.bosses.name(invasion.finalBoss ?? '')}.`
              : `Faltan ${formatInt(invasions.killsLeft)} bichos para la siguiente oleada.`}
          </div>
          <Bar
            value={invasions.progress * 100}
            max={100}
            variant={invasions.bossReady ? 'boss' : 'progress'}
            label={`${percent}% de ${formatInt(totalKills(invasion))} bichos`}
          />
        </div>
        <button
          className={`btn${invasions.bossReady ? ' btn--danger' : ' btn--primary'}`}
          onClick={() => goTo(invasions.bossReady ? 'bosses' : 'zone')}
        >
          {invasions.bossReady ? 'Al jefe' : 'A pelear'}
        </button>
      </div>
    );
  }

  if (!lunar.isActive) return null;

  /** Lleva al jugador a una zona y abre la pestana que le sirve alli. */
  const confront = (zoneId: string, tab: 'zone' | 'bosses' = 'bosses') => {
    if (g.zones.current.id !== zoneId) game().travel(zoneId);
    goTo(tab);
  };

  if (lunar.stage === LunarStage.CultistImminent) {
    return (
      <div className="event event--urgent">
        <Sprite name="Lunatic_Cultist" size={44} className="event__sprite" />
        <div className="event__body">
          <div className="event__title">Cultista Lunatico · inminente</div>
          <div className="event__text">
            Los cultistas han abierto un portal en la Mazmorra. No se va a ir por su cuenta.
          </div>
        </div>
        <button className="btn btn--danger" onClick={() => confront('dungeon')}>
          Enfrentarlo
        </button>
      </div>
    );
  }

  if (lunar.stage === LunarStage.Pillars) {
    return (
      <div className="event event--pillars">
        <div className="event__body">
          <div className="event__title">Los cuatro pilares celestiales</div>
          <div className="event__text">
            Mil bichos en cada uno para bajarle el escudo. Despues el pilar se rompe a golpes: no
            devuelve dano.
          </div>
          <div className="pillars">
            {lunar.pillarViews().map((pillar) => (
              <button
                key={pillar.id}
                className={`pillar${pillar.defeated ? ' pillar--done' : ''}${
                  pillar.vulnerable ? ' pillar--ready' : ''
                }`}
                disabled={pillar.defeated}
                onClick={() => confront(pillar.zoneId, pillar.vulnerable ? 'bosses' : 'zone')}
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
                        {pillar.vulnerable
                          ? 'escudo caido · rompelo'
                          : `${formatInt(pillar.kills)}/${formatInt(pillar.required)}`}
                      </div>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (lunar.stage === LunarStage.MoonLordCountdown) {
    const seconds = Math.ceil(lunar.countdownMs / 1000);
    return (
      <div className="event event--countdown">
        <Sprite name="Moon_Lord" size={44} className="event__sprite" />
        <div className="event__body">
          <div className="event__title">El Senor de la Luna baja en {seconds}s</div>
          <div className="event__text">
            Los cuatro pilares han caido. Equipate, bebe y respira: de esta pelea no se huye.
          </div>
        </div>
        <div className="event__timer">{seconds}</div>
      </div>
    );
  }

  return (
    <div className="event event--urgent">
      <Sprite name="Moon_Lord" size={44} className="event__sprite" />
      <div className="event__body">
        <div className="event__title">El Senor de la Luna esta aqui</div>
        <div className="event__text">No hay donde esconderse.</div>
      </div>
      <button className="btn btn--danger" onClick={() => goTo('bosses')}>
        A la pelea
      </button>
    </div>
  );
}
