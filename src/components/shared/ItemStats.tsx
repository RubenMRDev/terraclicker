import type { ItemStats } from '../../modules/items/ItemType';
import { formatStat, statEntries } from './itemStatFormat';

/** Las estadisticas de una pieza en chapas, para su ficha. */
export function ItemStatList({ stats }: { stats: ItemStats | undefined }) {
  const entries = statEntries(stats);
  if (entries.length === 0) return null;
  return (
    <div className="detail__stats">
      {entries.map(([key, value]) => (
        <span key={key} className="detail__stat">
          {formatStat(key, value)}
        </span>
      ))}
    </div>
  );
}
