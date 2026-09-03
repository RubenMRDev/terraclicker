import { useUi } from '../../hooks/useUi';
import { getItem, STARTING_KIT } from '../../modules/items/ItemList';
import { sourcesOf, type ItemSource, type SourceKind } from '../../modules/items/ItemSources';
import type { ItemId } from '../../modules/items/ItemType';
import { Coins } from './Coins';
import { Sprite } from './Sprite';

const KIND_LABEL: Record<SourceKind, string> = {
  node: 'Se pica',
  enemy: 'Lo suelta',
  boss: 'Jefe',
  recipe: 'Se fabrica',
  shop: 'Se compra',
  invasion: 'Recompensa de evento',
};

const KIND_ORDER: SourceKind[] = ['recipe', 'node', 'enemy', 'boss', 'invasion', 'shop'];

function SourceRow({ source }: { source: ItemSource }) {
  return (
    <div className={`source source--${source.kind}`}>
      <Sprite name={source.icon} size={22} />
      <div className="source__body">
        <div className="source__name">{source.name}</div>
        {source.zones.length > 0 ? (
          <div className="faint">{source.zones.join(' · ')}</div>
        ) : null}
      </div>
      <div className="source__meta">
        {source.amount ? <span>{source.amount}</span> : null}
        {source.chance !== undefined && source.chance < 1 ? (
          <span>{Math.round(source.chance * 100)}%</span>
        ) : null}
        {source.price !== undefined ? <Coins amount={source.price} size={13} /> : null}
      </div>
    </div>
  );
}

/**
 * De donde sale un objeto: la receta, los bloques que lo tiran, los bichos, los
 * jefes y los vecinos que lo venden. Si hay receta, el boton manda al panel de
 * fabricacion con el buscador ya escrito.
 */
export function ItemSourceList({ itemId }: { itemId: ItemId }) {
  const { openCrafting } = useUi();
  const sources = sourcesOf(itemId);
  const craftable = sources.find((source) => source.kind === 'recipe');

  if (sources.length === 0) {
    return (
      <p className="faint">
        {STARTING_KIT.includes(itemId)
          ? 'Viene contigo desde el primer minuto.'
          : 'No se consigue de ninguna forma todavia.'}
      </p>
    );
  }

  const grouped = KIND_ORDER.map((kind) => ({
    kind,
    items: sources.filter((source) => source.kind === kind),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="sources">
      {craftable ? (
        <button className="btn btn--small btn--primary" onClick={() => openCrafting(getItem(itemId).name)}>
          Ir a fabricarlo
        </button>
      ) : null}
      {grouped.map((group) => (
        <div key={group.kind}>
          <div className="faint sources__title">{KIND_LABEL[group.kind]}</div>
          {group.items.map((source, index) => (
            <SourceRow key={`${group.kind}-${index}`} source={source} />
          ))}
        </div>
      ))}
    </div>
  );
}
