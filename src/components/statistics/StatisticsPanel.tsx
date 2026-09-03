import { useGameChannel } from '../../hooks/useGame';
import { formatDuration, formatNumber } from '../../modules/GameHelper';
import { getItem } from '../../modules/items/ItemList';
import { Coins } from '../shared/Coins';
import { Panel } from '../shared/Panel';
import { Sprite } from '../shared/Sprite';

export function StatisticsPanel() {
  const g = useGameChannel(['statistics', 'wallet', 'inventory', 'boss']);
  const s = g.statistics;

  const topGathered = [...s.itemsGathered.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18);

  return (
    <>
      <Panel>
        <div className="stats-list">
          <div className="stats-list__row">
            <span>Tiempo jugado</span>
            <b>{formatDuration(s.timePlayedMs)}</b>
          </div>
          <div className="stats-list__row">
            <span>Clicks</span>
            <b>{formatNumber(s.clicks)}</b>
          </div>
          <div className="stats-list__row">
            <span>Nodos rotos</span>
            <b>{formatNumber(s.nodesBroken)}</b>
          </div>
          <div className="stats-list__row">
            <span>Enemigos derrotados</span>
            <b>{formatNumber(s.enemiesDefeated)}</b>
          </div>
          <div className="stats-list__row">
            <span>Dano total</span>
            <b>{formatNumber(Math.round(s.totalDamage))}</b>
          </div>
          <div className="stats-list__row">
            <span>Objetos fabricados</span>
            <b>{formatNumber(s.itemsCrafted)}</b>
          </div>
          <div className="stats-list__row">
            <span>Muertes</span>
            <b>{s.deaths}</b>
          </div>
          <div className="stats-list__row">
            <span>Monedas ganadas</span>
            <b>
              <Coins amount={g.wallet.totalEarned} size={14} />
            </b>
          </div>
        </div>
      </Panel>

      <Panel title="Jefes">
        <div className="stats-list">
          {g.bosses.all.map((boss) => (
            <div key={boss.id} className="stats-list__row">
              <span className="row">
                <Sprite name={boss.sprite} size={22} /> {boss.name}
              </span>
              <b>
                {s.defeatsOf(boss.id)} / {s.attemptsOf(boss.id)} intentos
              </b>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Mas recolectado">
        {topGathered.length === 0 ? (
          <p className="empty-state">Todavia no has recogido nada.</p>
        ) : (
          <div className="stats-list">
            {topGathered.map(([itemId, amount]) => (
              <div key={itemId} className="stats-list__row">
                <span className="row">
                  <Sprite name={itemId} size={20} /> {getItem(itemId).name}
                </span>
                <b>{formatNumber(amount)}</b>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </>
  );
}
