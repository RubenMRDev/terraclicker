import { useGameChannel } from '../../hooks/useGame';
import { getItem } from '../../modules/items/ItemList';
import { Sprite } from '../shared/Sprite';

/**
 * Lo ultimo que ha caido, colgando de la placa del personaje. Estaba pegado al
 * borde derecho del mundo y el aviso de evento se lo comia; aqui va en la
 * columna izquierda, que es la que siempre tiene sitio.
 */
export function LootFeed() {
  const g = useGameChannel(['battle', 'settings']);
  if (!g.save.settings.showLootFeed || g.battle.loot.length === 0) return null;

  return (
    <div className="world__loot">
      {g.battle.loot.map((line) => (
        <div key={line.id} className={`loot__line${line.rare ? ' loot__line--rare' : ''}`}>
          <Sprite name={line.itemId} size={18} />
          <span>{getItem(line.itemId).name}</span>
          <span className="loot__amount">+{line.amount}</span>
        </div>
      ))}
    </div>
  );
}
