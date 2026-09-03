import { game, useGameChannel } from '../../hooks/useGame';
import { getItem } from '../../modules/items/ItemList';
import { ItemCategory } from '../../modules/items/ItemType';
import { Sprite } from '../shared/Sprite';

/**
 * Pociones curativas a mano durante una bossfight. Comparten una espera comun,
 * como el mareo de pocion de Terraria: no puedes encadenarlas.
 */
export function PotionBar() {
  const g = useGameChannel(['inventory', 'player']);

  const potions = g.inventory
    .entries()
    .filter((entry) => {
      const item = getItem(entry.id);
      return item.category === ItemCategory.Consumable && item.consumable?.kind === 'heal';
    })
    .sort((a, b) => {
      const healA = getItem(a.id).consumable;
      const healB = getItem(b.id).consumable;
      const valueA = healA?.kind === 'heal' ? healA.amount : 0;
      const valueB = healB?.kind === 'heal' ? healB.amount : 0;
      return valueA - valueB;
    });

  if (potions.length === 0) {
    return (
      <p className="faint">
        Sin pociones. Fabricalas en la mesa de alquimia antes de la proxima pelea.
      </p>
    );
  }

  const cooling = g.player.potionCooldown > 0;
  const full = g.player.health >= g.player.maxHealth;

  return (
    <div className="row row--wrap">
      {potions.map((entry) => {
        const item = getItem(entry.id);
        const heal = item.consumable?.kind === 'heal' ? item.consumable.amount : 0;
        return (
          <button
            key={entry.id}
            className="btn btn--small"
            disabled={cooling || full}
            onClick={() => game().use(entry.id)}
            title={`${item.name} · +${heal} PV`}
          >
            <Sprite name={entry.id} size={18} />+{heal}
            <span className="faint">x{entry.amount}</span>
          </button>
        );
      })}
      {cooling ? (
        <span className="faint">Espera {Math.ceil(g.player.potionCooldown / 1000)}s</span>
      ) : null}
    </div>
  );
}
