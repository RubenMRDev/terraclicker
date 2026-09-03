import { game, useGameChannel } from '../../hooks/useGame';
import { getItem } from '../../modules/items/ItemList';
import type { NpcDef } from '../../modules/npcs/NpcList';
import { Coins } from '../shared/Coins';
import { statSummary } from '../shared/itemStatFormat';
import { Sprite } from '../shared/Sprite';

/** Tienda de un vecino. El genero bloqueado no se lista: no existe todavia. */
export function NpcShop({ npc }: { npc: NpcDef }) {
  const g = useGameChannel(['inventory', 'wallet', 'npcs', 'statistics', 'zone']);
  const stock = g.npcs.stockOf(npc.id);

  if (stock.length === 0) {
    return <p className="faint">Hoy no tiene nada nuevo.</p>;
  }

  return (
    <div className="shop">
      {stock.map((entry) => {
        const item = getItem(entry.itemId);
        const max = g.npcs.affordable(npc.id, entry.itemId);
        const summary = statSummary(item.stats);
        return (
          <div key={entry.itemId} className="shop__row">
            <Sprite name={entry.itemId} size={28} />
            <div className="shop__body">
              <div className="shop__name">
                {item.name}
                {g.inventory.count(entry.itemId) > 0 ? (
                  <span className="faint"> · tienes {g.inventory.count(entry.itemId)}</span>
                ) : null}
              </div>
              <div className="faint">{summary || item.description}</div>
            </div>
            <Coins amount={entry.price} size={14} />
            <button
              className="btn btn--small btn--primary"
              disabled={max < 1}
              onClick={() => game().npcs.buy(npc.id, entry.itemId, 1)}
            >
              Comprar
            </button>
            <button
              className="btn btn--small"
              disabled={max < 10}
              onClick={() => game().npcs.buy(npc.id, entry.itemId, 10)}
            >
              x10
            </button>
          </div>
        );
      })}
    </div>
  );
}
