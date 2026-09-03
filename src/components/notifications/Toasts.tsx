import { game, useGameChannel } from '../../hooks/useGame';
import { Sprite } from '../shared/Sprite';

export function Toasts() {
  const g = useGameChannel('notifications');
  if (g.notifier.notifications.length === 0) return null;

  return (
    <div className="toasts">
      {g.notifier.notifications.map((notification) => (
        <div
          key={notification.id}
          className={`toast toast--${notification.tone}`}
          onClick={() => game().notifier.dismiss(notification.id)}
          role="status"
        >
          {notification.icon ? <Sprite name={notification.icon} size={24} /> : null}
          <span>{notification.text}</span>
        </div>
      ))}
    </div>
  );
}
