import { useMemo, useState } from 'react';
import { useGameChannel } from '../../hooks/useGame';
import { formatInt, formatNumber } from '../../modules/GameHelper';
import { EnemyList } from '../../modules/combat/EnemyList';
import { allItems, getItem } from '../../modules/items/ItemList';
import { ItemCategory, type ItemId } from '../../modules/items/ItemType';
import { ZoneList } from '../../modules/zones/ZoneList';
import { Coins } from '../shared/Coins';
import { ItemStatList } from '../shared/ItemStats';
import { ItemSourceList } from '../shared/ItemSourceList';
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

/** Quita acentos y pasa a minusculas, para que "estano" encuentre "estaño". */
const normalize = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/**
 * El "pokedex" del juego: todo lo que existe, con lo ya descubierto a color y el
 * resto en silueta. Al pulsar un objeto se abre su ficha con las estadisticas
 * reales (potencia de pico, defensa, dano) y de donde sale, con un atajo directo
 * a su receta en el panel de fabricacion.
 */
export function CataloguePanel() {
  const g = useGameChannel(['inventory', 'statistics']);
  const [tab, setTab] = useState<'items' | 'enemies'>('items');
  const [selected, setSelected] = useState<ItemId | null>(null);
  const [search, setSearch] = useState('');

  const items = useMemo(() => allItems().filter((item) => !item.iconOnly), []);
  const term = normalize(search.trim());
  const listed = items.filter((item) =>
    term ? normalize(`${item.name} ${item.id} ${item.description}`).includes(term) : true,
  );

  const discoveredItems = items.filter((item) => g.inventory.discovered.has(item.id)).length;
  const enemies = Object.values(EnemyList);
  const discoveredEnemies = enemies.filter((enemy) => g.statistics.killsOf(enemy.id) > 0).length;

  const item = selected ? getItem(selected) : null;
  const found = selected ? g.inventory.discovered.has(selected) : false;

  const grouped = new Map<ItemCategory, typeof listed>();
  for (const entry of listed) {
    if (!grouped.has(entry.category)) grouped.set(entry.category, []);
    grouped.get(entry.category)!.push(entry);
  }

  return (
    <Panel
      aside={
        tab === 'items'
          ? `${discoveredItems}/${items.length} objetos`
          : `${discoveredEnemies}/${enemies.length} enemigos`
      }
    >
      <div className="tabs">
        <button
          className={`tab${tab === 'items' ? ' tab--active' : ''}`}
          onClick={() => setTab('items')}
        >
          Objetos
        </button>
        <button
          className={`tab${tab === 'enemies' ? ' tab--active' : ''}`}
          onClick={() => setTab('enemies')}
        >
          Bestiario
        </button>
      </div>

      {tab === 'items' ? (
        <>
          {item && selected ? (
            <div className="detail" style={{ marginBottom: 14 }}>
              <div className="detail__head">
                <Sprite
                  name={selected}
                  size={48}
                  className={found ? undefined : 'achievement__sprite--locked'}
                />
                <div>
                  <div className="detail__name">{item.name}</div>
                  <div className="faint">
                    {CATEGORY_LABEL[item.category]}
                    {g.inventory.count(selected) > 0
                      ? ` · tienes ${formatNumber(g.inventory.count(selected))}`
                      : found
                        ? ' · descubierto'
                        : ' · sin descubrir'}
                  </div>
                </div>
                <button
                  className="btn btn--small"
                  style={{ marginLeft: 'auto' }}
                  onClick={() => setSelected(null)}
                >
                  Cerrar
                </button>
              </div>
              <p className="detail__desc">{item.description}</p>
              <ItemStatList stats={item.stats} />
              {item.sellPrice > 0 ? (
                <div className="row faint" style={{ marginTop: 4 }}>
                  Se vende por <Coins amount={item.sellPrice} size={14} />
                </div>
              ) : null}
              <div className="detail__sep" />
              <ItemSourceList itemId={selected} />
            </div>
          ) : (
            <p className="faint" style={{ marginBottom: 10 }}>
              Pulsa un objeto para ver sus estadisticas y de donde sale.
            </p>
          )}

          <input
            className="search"
            type="search"
            value={search}
            placeholder="Buscar en el catalogo..."
            onChange={(event) => setSearch(event.target.value)}
            style={{ marginBottom: 10 }}
          />

          {listed.length === 0 ? (
            <p className="empty-state">Nada coincide con la busqueda.</p>
          ) : (
            [...grouped.entries()].map(([category, entries]) => (
              <div key={category} style={{ marginBottom: 12 }}>
                <div className="faint" style={{ marginBottom: 5 }}>
                  {CATEGORY_LABEL[category]} · {entries.length}
                </div>
                <div className="grid grid--items">
                  {entries.map((entry) => {
                    const seen = g.inventory.discovered.has(entry.id);
                    const gathered = g.statistics.gathered(entry.id);
                    return (
                      <button
                        key={entry.id}
                        className={`slot${selected === entry.id ? ' slot--selected' : ''}${
                          seen ? '' : ' slot--undiscovered'
                        }`}
                        title={seen ? `${entry.name}\n${entry.description}` : entry.name}
                        onClick={() => setSelected(entry.id)}
                      >
                        <Sprite name={entry.id} size={30} />
                        {seen && gathered > 0 ? (
                          <span className="slot__count">{formatNumber(gathered)}</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <div className="grid grid--cards">
          {enemies.map((enemy) => {
            const kills = g.statistics.killsOf(enemy.id);
            const seen = kills > 0;
            const zones = ZoneList.filter((zone) => zone.enemies.includes(enemy.id));
            return (
              <div key={enemy.id} className="recipe">
                <div className="recipe__head">
                  <Sprite
                    name={enemy.sprite}
                    size={44}
                    className={seen ? undefined : 'achievement__sprite--locked'}
                  />
                  <div>
                    <div className="recipe__name">{seen ? enemy.name : '???'}</div>
                    <div className="faint">
                      {seen
                        ? `${formatInt(enemy.health)} PV · ${kills} derrotados`
                        : 'Sin descubrir'}
                    </div>
                    {seen && zones.length > 0 ? (
                      <div className="faint">{zones.map((zone) => zone.name).join(' · ')}</div>
                    ) : null}
                  </div>
                </div>
                {seen ? (
                  <div className="recipe__inputs">
                    {enemy.drops.map((drop) => (
                      <span
                        key={drop.itemId}
                        className="recipe__input recipe__input--ok"
                        title={getItem(drop.itemId).name}
                      >
                        <Sprite name={drop.itemId} size={14} />
                        {Math.round(drop.chance * 100)}%
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
