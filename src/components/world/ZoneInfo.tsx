import { useGameChannel } from '../../hooks/useGame';
import { formatInt } from '../../modules/GameHelper';
import { Bar } from '../shared/Bar';
import { Sprite } from '../shared/Sprite';
import { ZoneResources } from '../zone/ZoneResources';

/**
 * Lo que hay en la zona: los bloques con la potencia que piden, los bichos y,
 * si estas en un pilar, su escudo. Se abre desde el nombre de la zona.
 *
 * Antes esto vivia debajo de la arena y obligaba a bajar la pagina; aqui es una
 * consulta de dos segundos que no le quita sitio al mundo.
 */
export function ZoneInfo() {
  const g = useGameChannel(['zone', 'player', 'inventory', 'lunar', 'boss', 'statistics']);
  const zone = g.zones.current;
  const pillar = zone.pillarId
    ? g.lunar.pillarViews().find((candidate) => candidate.id === zone.pillarId)
    : undefined;
  const bosses = g.bosses.bossesOfZone(zone.id);

  return (
    <div className="col">
      <p className="detail__desc" style={{ marginTop: 0 }}>
        {zone.description}
      </p>

      {pillar ? (
        <div className="event event--pillars">
          <Sprite name={pillar.sprite} size={38} className="event__sprite" />
          <div className="event__body">
            <div className="event__title">
              {pillar.vulnerable ? 'Escudo caido: rompe el pilar en Jefes' : 'Escudo del pilar'}
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

      <ZoneResources />

      {bosses.length > 0 ? (
        <div>
          <div className="faint" style={{ marginBottom: 5 }}>
            Jefes que se invocan aqui
          </div>
          <div className="row row--wrap">
            {bosses.map((boss) => {
              const defeats = g.statistics.defeatsOf(boss.id);
              return (
                <span
                  key={boss.id}
                  className={`recipe__input${defeats > 0 ? ' recipe__input--ok' : ''}`}
                  title={boss.description}
                >
                  <Sprite name={boss.sprite} size={16} />
                  {boss.name}
                  {defeats > 0 ? ` ·${defeats}` : ''}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
