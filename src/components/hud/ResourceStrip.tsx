import { useGameChannel } from '../../hooks/useGame';
import { formatDuration, formatNumber } from '../../modules/GameHelper';
import { Coins } from '../shared/Coins';
import { Sprite } from '../shared/Sprite';

/**
 * La franja de arriba a la derecha: monedas, logros, clicks y tiempo. Es lo que
 * antes era la cabecera entera; aqui cabe en cuatro chapas porque el titulo del
 * juego no hace falta dos veces (esta en la pestana del navegador).
 */
export function ResourceStrip() {
  const g = useGameChannel(['wallet', 'statistics', 'achievements']);

  return (
    <div className="strip">
      <span className="chapa chapa--coins">
        <Coins amount={g.wallet.total} size={15} />
      </span>
      <span className="chapa">
        <Sprite name="Gold_Crown" size={15} />
        <b>{g.achievements.completed}</b>/{g.achievements.total}
      </span>
      <span className="chapa chapa--clicks">
        <Sprite name="Feral_Claws" size={15} />
        {formatNumber(g.statistics.clicks)}
      </span>
      <span className="chapa chapa--time">{formatDuration(g.statistics.timePlayedMs)}</span>
    </div>
  );
}
