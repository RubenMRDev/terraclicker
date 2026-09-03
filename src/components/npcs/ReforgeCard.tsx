import { useState } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { getItem } from '../../modules/items/ItemList';
import {
  canHavePrefix,
  getPrefix,
  prefixOdds,
  prefixTargetOf,
} from '../../modules/items/Prefixes';
import { ItemCategory, type ItemId } from '../../modules/items/ItemType';
import { Coins } from '../shared/Coins';
import { ItemStatList } from '../shared/ItemStats';
import { prefixEffect } from '../shared/itemStatFormat';
import { Sprite } from '../shared/Sprite';

const GROUPS: Array<{ label: string; category: ItemCategory }> = [
  { label: 'Armas', category: ItemCategory.Weapon },
  { label: 'Herramientas', category: ItemCategory.Tool },
  { label: 'Accesorios', category: ItemCategory.Accessory },
];

/**
 * El taller del Inventor duende: se le da una pieza y se le paga por volver a
 * tirar el dado. Vive dentro de su propia ficha del pueblo, que es donde uno va
 * a buscarlo, y ensena la probabilidad real de cada rasgo: pagar una tirada a
 * ciegas no invita a repetir.
 */
export function ReforgeCard() {
  const g = useGameChannel(['inventory', 'player', 'wallet', 'npcs']);
  const [selected, setSelected] = useState<ItemId | null>(null);
  const [target, setTarget] = useState('good');

  // Solo armas, herramientas y accesorios: las armaduras no llevan rasgo.
  const candidates = g.inventory
    .entries()
    .map((entry) => entry.id)
    .filter((id) => canHavePrefix(getItem(id)));

  const current = selected && g.inventory.has(selected) ? selected : null;
  const item = current ? getItem(current) : null;
  const prefix = current ? getPrefix(g.inventory.prefixOf(current)) : undefined;
  const blocked = current ? g.reforgeBlockedReason(current) : null;
  const kind = item ? prefixTargetOf(item) : null;
  const odds = kind ? prefixOdds(kind) : [];
  const cost = current ? g.reforgeCost(current) : 0;

  const targetOdds =
    target === 'good'
      ? odds.filter((entry) => !entry.prefix.bad).reduce((sum, entry) => sum + entry.chance, 0)
      : (odds.find((entry) => entry.prefix.id === target)?.chance ?? 0);
  // Tiradas medias hasta acertar: la esperanza de una geometrica es 1/p.
  const expectedTries = targetOdds > 0 ? Math.ceil(1 / targetOdds) : 0;

  return (
    <div className="reforge">
      <p className="faint" style={{ margin: '0 0 8px' }}>
        Un tercio del valor de venta por tirada, y el dado es el dado. Dame una pieza:
      </p>

      {candidates.length === 0 ? (
        <p className="faint">
          No tienes nada reforjable: hacen falta armas, herramientas o accesorios.
        </p>
      ) : (
        GROUPS.map((group) => {
          const ids = candidates.filter((id) => getItem(id).category === group.category);
          if (ids.length === 0) return null;
          return (
            <div key={group.label} style={{ marginBottom: 8 }}>
              <div className="faint" style={{ marginBottom: 4 }}>
                {group.label} · {ids.length}
              </div>
              <div className="grid grid--items">
                {ids.map((id) => {
                  const itemPrefix = getPrefix(g.inventory.prefixOf(id));
                  return (
                    <button
                      key={id}
                      className={`slot${current === id ? ' slot--selected' : ''}${
                        itemPrefix ? (itemPrefix.bad ? ' slot--bad' : ' slot--prefixed') : ''
                      }`}
                      title={`${itemPrefix ? `${itemPrefix.name} ` : ''}${getItem(id).name}`}
                      onClick={() => setSelected(id)}
                    >
                      <Sprite name={id} size={30} />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {current && item ? (
        <div className="detail" style={{ marginTop: 10 }}>
          <div className="detail__head">
            <Sprite name={current} size={40} />
            <div>
              <div className="detail__name">
                {prefix ? (
                  <span className={prefix.bad ? 'prefix prefix--bad' : 'prefix'}>
                    {prefix.name}{' '}
                  </span>
                ) : null}
                {item.name}
              </div>
              <div className="faint">{prefix ? 'Rasgo actual' : 'Sin rasgo'}</div>
            </div>
          </div>
          <ItemStatList stats={g.player.statsOf(current)} />

          <div className="detail__actions">
            <button
              className="btn btn--small btn--primary"
              disabled={blocked !== null}
              onClick={() => game().reforge(current)}
            >
              Reforjar una vez
            </button>
            <span className="row faint">
              <Coins amount={cost} size={14} /> por tirada
            </span>
            {blocked ? <span className="faint">{blocked}</span> : null}
          </div>

          <div className="detail__sep" />

          <div className="autoreforge">
            <div className="autoreforge__row">
              <span>Auto-reforjar hasta</span>
              <select
                className="select"
                value={target}
                onChange={(event) => setTarget(event.target.value)}
              >
                <option value="good">cualquiera que no sea malo</option>
                {odds.map((entry) => (
                  <option key={entry.prefix.id} value={entry.prefix.id}>
                    {entry.prefix.name} · {(entry.chance * 100).toFixed(1)}% ·{' '}
                    {prefixEffect(entry.prefix)}
                  </option>
                ))}
              </select>
              <button
                className="btn btn--small btn--primary"
                disabled={blocked !== null}
                onClick={() => game().autoReforge(current, target)}
              >
                Tirar hasta que salga
              </button>
            </div>
            <div className="faint">
              {(targetOdds * 100).toFixed(1)}% por tirada · unas {expectedTries} tiradas de media ·{' '}
              <span className="row" style={{ display: 'inline-flex' }}>
                <Coins amount={cost * expectedTries} size={13} /> esperados
              </span>
            </div>
          </div>

          <div className="detail__sep" />
          <div className="faint" style={{ marginBottom: 5 }}>
            Los rasgos posibles para esta pieza, con su probabilidad y lo que hacen
          </div>
          <div className="odds">
            {odds.map((entry) => (
              <div
                key={entry.prefix.id}
                className={`odd${entry.prefix.bad ? ' odd--bad' : ''}${
                  prefix?.id === entry.prefix.id ? ' odd--current' : ''
                }`}
              >
                <b className="odd__chance">{(entry.chance * 100).toFixed(1)}%</b>
                <span className="odd__name">{entry.prefix.name}</span>
                <span className="odd__effect">{prefixEffect(entry.prefix)}</span>
                {prefix?.id === entry.prefix.id ? (
                  <span className="odd__tag">el que llevas</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
