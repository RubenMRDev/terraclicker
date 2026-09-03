import { breakdownCoins } from '../../modules/GameHelper';
import { Sprite } from './Sprite';

interface CoinsProps {
  amount: number;
  size?: number;
  /** Muestra las cuatro monedas aunque valgan cero. */
  full?: boolean;
}

const PARTS = [
  { key: 'platinum', sprite: 'Platinum_Coin' },
  { key: 'gold', sprite: 'Gold_Coin' },
  { key: 'silver', sprite: 'Silver_Coin' },
  { key: 'copper', sprite: 'Copper_Coin' },
] as const;

/** Muestra una cantidad en cobre repartida en las cuatro monedas de Terraria. */
export function Coins({ amount, size = 16, full = false }: CoinsProps) {
  const breakdown = breakdownCoins(amount);
  const visible = PARTS.filter((part) => full || breakdown[part.key] > 0);

  if (visible.length === 0) {
    return (
      <span className="coins">
        <span className="coins__part coins__part--copper">
          <Sprite name="Copper_Coin" size={size} /> 0
        </span>
      </span>
    );
  }

  return (
    <span className="coins">
      {visible.map((part) => (
        <span key={part.key} className={`coins__part coins__part--${part.key}`}>
          <Sprite name={part.sprite} size={size} />
          {breakdown[part.key]}
        </span>
      ))}
    </span>
  );
}
