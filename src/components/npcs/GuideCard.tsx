import { useGameChannel } from '../../hooks/useGame';
import { guideAdvice } from '../../modules/npcs/GuideAdvice';
import { Sprite } from '../shared/Sprite';

/**
 * Lo que diria el Guia si le preguntases. Se recalcula en cada repintado a
 * partir del estado, asi que siempre habla de lo que toca ahora y no de lo que
 * tocaba hace media hora.
 */
export function GuideCard() {
  // Se suscribe a casi todo a proposito: los consejos dependen de todo.
  const g = useGameChannel(['inventory', 'player', 'zone', 'boss', 'crafting', 'npcs', 'lunar', 'statistics']);
  if (!g.npcs.isHoused('guide')) return null;

  const advice = guideAdvice();

  return (
    <div className="guide">
      <div className="guide__head">
        <Sprite name="Guide" size={40} />
        <div>
          <div className="guide__name">El Guia dice</div>
          <div className="faint">Lo siguiente que te conviene hacer</div>
        </div>
      </div>
      <ul className="guide__list">
        {advice.map((line, index) => (
          <li key={index} className={`guide__line guide__line--${line.tone}`}>
            <Sprite name={line.icon} size={22} />
            <span>{line.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
