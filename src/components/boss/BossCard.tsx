import { game, useGameChannel } from '../../hooks/useGame';
import { formatInt } from '../../modules/GameHelper';
import type { BossDef } from '../../modules/bosses/BossList';
import { getItem } from '../../modules/items/ItemList';
import type { DropDef } from '../../modules/items/ItemType';
import { Coins } from '../shared/Coins';
import { Requirements } from '../shared/Requirements';
import { Sprite } from '../shared/Sprite';

function Drops({ drops, title }: { drops: DropDef[]; title: string }) {
  if (drops.length === 0) return null;
  return (
    <>
      <div className="faint" style={{ marginTop: 6, marginBottom: 3 }}>
        {title}
      </div>
      <div className="recipe__inputs">
        {drops.map((drop) => (
          <span
            key={drop.itemId}
            className={`recipe__input${drop.chance >= 1 ? ' recipe__input--ok' : ''}`}
            title={`${getItem(drop.itemId).name}${drop.affectedByLuck ? ' · la suerte ayuda' : ''}`}
          >
            <Sprite name={drop.itemId} size={14} />
            {drop.min === drop.max ? `x${drop.min}` : `x${drop.min}-${drop.max}`}
            {drop.chance < 1 ? ` · ${Math.round(drop.chance * 100)}%` : ''}
          </span>
        ))}
      </div>
    </>
  );
}

/**
 * Ficha de un jefe. Sale igual esté donde esté el jugador: si el jefe es de otra
 * zona, el boton viaja hasta alli en vez de dejar la tarjeta muerta, y el botin
 * se ve siempre, que es lo que decide si merece la pena ir.
 */
export function BossCard({ boss }: { boss: BossDef }) {
  const g = useGameChannel(['boss', 'inventory', 'zone', 'statistics', 'lunar', 'player']);

  const zone = g.zones.all.find((candidate) => candidate.id === boss.zoneId);
  const here = g.zones.current.id === boss.zoneId;
  const zoneOpen = zone ? g.zones.isUnlocked(zone) : false;
  const defeats = g.statistics.defeatsOf(boss.id);
  const blocked = g.bosses.summonBlockedReason(boss.id);
  const summon = boss.summonItem ? getItem(boss.summonItem) : null;
  const owned = boss.summonItem ? g.inventory.count(boss.summonItem) : 0;

  const shieldKills = boss.pillarId ? g.lunar.killsOf(boss.pillarId) : 0;

  return (
    <div className={`boss-card${defeats > 0 ? ' boss-card--cleared' : ''}`}>
      <div className="boss-card__head">
        <Sprite name={boss.sprite} size={64} />
        <div>
          <div className="boss-card__name">{boss.name}</div>
          <div className="boss-card__meta">
            <span>{formatInt(boss.health)} PV</span>
            <span>{boss.harmless ? 'no devuelve dano' : `${boss.damage} de dano`}</span>
            <span>
              {boss.phases.length} fase{boss.phases.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="faint">{zone?.name ?? boss.zoneId}</div>
        </div>
      </div>

      <p className="boss-card__desc">{boss.description}</p>

      <div className="boss-card__meta">
        {summon ? (
          <span className="row">
            Invocacion: <Sprite name={summon.id} size={18} /> {summon.name} ({owned})
          </span>
        ) : (
          <span>Sin invocacion: lo trae el evento lunar</span>
        )}
        <span>
          Derrotado {defeats} {defeats === 1 ? 'vez' : 'veces'}
        </span>
        <span className="row">
          Recompensa: <Coins amount={boss.coins[0]} size={14} />
        </span>
        {boss.shieldKills ? (
          <span>
            Escudo: {formatInt(shieldKills)}/{formatInt(boss.shieldKills)} bichos
          </span>
        ) : null}
      </div>

      <Drops drops={boss.drops} title="Suelta" />
      <Drops drops={boss.firstClearDrops} title="Solo la primera vez" />

      {zone && !zoneOpen ? (
        <>
          <div className="faint" style={{ marginTop: 6 }}>
            {zone.name} todavia esta cerrada
          </div>
          <Requirements items={g.zones.requirements(zone)} />
        </>
      ) : here ? (
        <button
          className="btn btn--primary"
          disabled={blocked !== null}
          onClick={() => game().bosses.summon(boss.id)}
        >
          {blocked ?? 'Invocar'}
        </button>
      ) : (
        <button className="btn" onClick={() => game().travel(boss.zoneId)}>
          Ir a {zone?.name ?? boss.zoneId}
        </button>
      )}
    </div>
  );
}
