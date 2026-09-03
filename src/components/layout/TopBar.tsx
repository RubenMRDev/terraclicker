import { useGameChannel } from '../../hooks/useGame';
import { formatDuration, formatNumber } from '../../modules/GameHelper';
import { Coins } from '../shared/Coins';
import { Sprite } from '../shared/Sprite';

export function TopBar() {
  const g = useGameChannel(['wallet', 'zone', 'statistics', 'achievements']);

  return (
    <header className="panel topbar">
      <div className="topbar__logo">
        <Sprite name="Copper_Pickaxe" size={26} />
        TerraClicker
        <span>un clicker con la progresion de Terraria</span>
      </div>

      <div className="topbar__spacer" />

      <div className="topbar__stat">
        <Sprite name={g.zones.current.icon} size={18} />
        {g.zones.current.name}
      </div>
      <div className="topbar__stat">
        <Coins amount={g.wallet.total} />
      </div>
      <div className="topbar__stat">
        Logros <b>{g.achievements.completed}</b>/{g.achievements.total}
      </div>
      <div className="topbar__stat">
        Clicks <b>{formatNumber(g.statistics.clicks)}</b>
      </div>
      <div className="topbar__stat">{formatDuration(g.statistics.timePlayedMs)}</div>
    </header>
  );
}
