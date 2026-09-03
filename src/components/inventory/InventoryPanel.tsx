import { useState } from 'react';
import { game, useGameChannel } from '../../hooks/useGame';
import { formatNumber } from '../../modules/GameHelper';
import { getItem } from '../../modules/items/ItemList';
import { canHavePrefix, getPrefix } from '../../modules/items/Prefixes';
import { ItemCategory, type ItemId } from '../../modules/items/ItemType';
import { Coins } from '../shared/Coins';
import { ItemSourceList } from '../shared/ItemSourceList';
import { ItemStatList } from '../shared/ItemStats';
import { Panel } from '../shared/Panel';
import { Sprite } from '../shared/Sprite';

const CATEGORY_LABEL: Record<ItemCategory, string> = {
  [ItemCategory.Material]: 'Materiales',
  [ItemCategory.Bar]: 'Lingotes',
  [ItemCategory.Gem]: 'Gemas',
  [ItemCategory.Tool]: 'Herramientas',
  [ItemCategory.Weapon]: 'Armas',
  [ItemCategory.Armor]: 'Armaduras',
  [ItemCategory.Accessory]: 'Accesorios',
  [ItemCategory.Station]: 'Estaciones',
  [ItemCategory.Consumable]: 'Consumibles',
  [ItemCategory.Summon]: 'Invocaciones',
};

/** Quita acentos y pasa a minusculas, para que "estano" encuentre "estano". */
const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export function InventoryPanel() {
  const g = useGameChannel(['inventory', 'player', 'wallet']);
  const [selected, setSelected] = useState<ItemId | null>(null);
  const [search, setSearch] = useState('');

  const term = normalize(search.trim());
  const entries = g.inventory.entries().filter((entry) => {
    if (!term) return true;
    const item = getItem(entry.id);
    return normalize(`${item.name} ${item.id} ${item.description}`).includes(term);
  });

  const current = selected && g.inventory.has(selected) ? selected : null;
  const item = current ? getItem(current) : null;
  const prefix = current ? getPrefix(g.inventory.prefixOf(current)) : undefined;
  // Las estadisticas que se muestran son las efectivas, con el rasgo aplicado.
  const effectiveStats = current ? g.player.statsOf(current) : null;

  const grouped = new Map<ItemCategory, typeof entries>();
  for (const entry of entries) {
    const category = getItem(entry.id).category;
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push(entry);
  }

  return (
    <Panel title="Mochila" aside={`${entries.length} tipos · ${formatNumber(g.inventory.totalItems())} objetos`}>
      {item && current ? (
        <div className="detail" style={{ marginBottom: 14 }}>
          <div className="detail__head">
            <Sprite name={current} size={44} />
            <div>
              <div className="detail__name">
                {prefix ? (
                  <span className={prefix.bad ? 'prefix prefix--bad' : 'prefix'}>{prefix.name} </span>
                ) : null}
                {item.name}
              </div>
              <div className="faint">
                {CATEGORY_LABEL[item.category]} · tienes {g.inventory.count(current)}
              </div>
            </div>
          </div>
          <p className="detail__desc">{item.description}</p>
          <ItemStatList stats={effectiveStats ?? undefined} />
          <div className="detail__actions">
            {item.slot ? (
              g.player.isEquipped(current) ? (
                <span className="faint" style={{ alignSelf: 'center' }}>
                  Equipado
                </span>
              ) : (
                <button className="btn btn--small btn--primary" onClick={() => game().equip(current)}>
                  Equipar
                </button>
              )
            ) : null}
            {item.consumable ? (
              <button className="btn btn--small btn--primary" onClick={() => game().use(current)}>
                Usar
              </button>
            ) : null}
            {item && canHavePrefix(item) ? (
              <button
                className="btn btn--small"
                disabled={!g.canReforge(current)}
                title={
                  g.reforgeBlockedReason(current) ?? `Cuesta ${g.reforgeCost(current)} de cobre`
                }
                onClick={() => game().reforge(current)}
              >
                Reforjar
              </button>
            ) : null}
            {item.sellPrice > 0 ? (
              <>
                <button className="btn btn--small" onClick={() => game().sell(current, 1)}>
                  Vender 1
                </button>
                <button
                  className="btn btn--small"
                  onClick={() => game().sell(current, g.inventory.count(current))}
                >
                  Vender todo
                </button>
                <span className="row faint">
                  <Coins amount={item.sellPrice} size={14} /> c/u
                </span>
              </>
            ) : null}
          </div>
          <div className="detail__sep" />
          <ItemSourceList itemId={current} />
        </div>
      ) : (
        <p className="faint" style={{ marginBottom: 10 }}>
          Elige un objeto para equiparlo, usarlo o venderlo.
        </p>
      )}

      <div className="row row--wrap" style={{ marginBottom: 10 }}>
        <input
          className="search"
          type="search"
          value={search}
          placeholder="Buscar en la mochila..."
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {entries.length === 0 ? (
        <p className="empty-state">
          {term ? 'Nada coincide con la busqueda.' : 'Mochila vacia. Ve a picar algo.'}
        </p>
      ) : (
        [...grouped.entries()].map(([category, items]) => (
          <div key={category} style={{ marginBottom: 12 }}>
            <div className="faint" style={{ marginBottom: 5 }}>
              {CATEGORY_LABEL[category]}
            </div>
            <div className="grid grid--items">
              {items.map((entry) => (
                <button
                  key={entry.id}
                  className={`slot${current === entry.id ? ' slot--selected' : ''}${
                    g.player.isEquipped(entry.id) ? ' slot--equipped' : ''
                  }`}
                  onClick={() => setSelected(entry.id)}
                  title={getItem(entry.id).name}
                >
                  <Sprite name={entry.id} size={32} />
                  <span className="slot__count">{formatNumber(entry.amount)}</span>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </Panel>
  );
}
