import { useGameChannel } from '../../hooks/useGame';
import { ToolKind } from '../../modules/GameConstants';
import { getNode } from '../../modules/gathering/GatherNode';
import { getEnemy } from '../../modules/combat/EnemyList';
import { getItem } from '../../modules/items/ItemList';
import { Sprite } from '../shared/Sprite';

/**
 * Que se puede sacar de la zona actual. Los nodos que la herramienta actual no
 * alcanza salen en gris con la potencia que exigen: sin esto el jugador no
 * entiende por que dejan de aparecer vetas de oro con un pico de hierro.
 */
export function ZoneResources() {
  const g = useGameChannel(['zone', 'player', 'inventory']);
  const zone = g.zones.current;
  const { pickPower, axePower } = g.player.stats;

  if (zone.nodes.length === 0) return null;

  const nodes = zone.nodes.map((id) => {
    const node = getNode(id);
    const power = node.tool === ToolKind.Axe ? axePower : pickPower;
    return { node, reachable: power >= node.toolPower };
  });
  const bloqueados = nodes.filter((entry) => !entry.reachable);

  return (
    <div style={{ marginTop: 14 }}>
      <div className="faint" style={{ marginBottom: 5 }}>
        Recursos de {zone.name}
      </div>
      <div className="row row--wrap">
        {nodes.map(({ node, reachable }) => (
          <span
            key={node.id}
            className={`recipe__input${reachable ? ' recipe__input--ok' : ''}`}
            title={
              reachable
                ? `${getItem(node.itemId).name} · ${node.health} PV`
                : `${getItem(node.itemId).name} · necesitas ${
                    node.tool === ToolKind.Axe ? 'hacha' : 'pico'
                  } de potencia ${node.toolPower}`
            }
            style={reachable ? undefined : { filter: 'grayscale(1)', opacity: 0.65 }}
          >
            <Sprite name={node.itemId} size={16} />
            {getItem(node.itemId).name}
            {reachable ? null : ` 🔒${node.toolPower}`}
          </span>
        ))}
      </div>

      <div className="faint" style={{ margin: '10px 0 5px' }}>
        Enemigos <span className="faint">· no piden herramienta, solo aguantar</span>
      </div>
      <div className="row row--wrap">
        {zone.enemies.map((id) => {
          const enemy = getEnemy(id);
          return (
            <span key={id} className="recipe__input recipe__input--ok" title={`${enemy.health} PV`}>
              <Sprite name={enemy.sprite} size={16} />
              {enemy.name}
            </span>
          );
        })}
      </div>

      {bloqueados.length > 0 ? (
        <p className="faint" style={{ marginTop: 8 }}>
          Hay {bloqueados.length} {bloqueados.length === 1 ? 'recurso' : 'recursos'} que tu
          herramienta todavia no alcanza, asi que no apareceran. A los enemigos si puedes
          pegarles desde el primer momento: escalan por vida, no por pico.
        </p>
      ) : null}
    </div>
  );
}
