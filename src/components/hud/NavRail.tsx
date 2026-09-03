import { useGameChannel } from '../../hooks/useGame';
import { useUi, type TabId } from '../../hooks/useUi';
import { Sprite } from '../shared/Sprite';

/** Las pantallas que se abren en modal. La zona no esta: la zona es el fondo. */
export const RAIL: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'bosses', label: 'Jefes', icon: 'Eye_of_Cthulhu' },
  { id: 'crafting', label: 'Fabricar', icon: 'Work_Bench' },
  { id: 'npcs', label: 'Pueblo', icon: 'Guide' },
  { id: 'events', label: 'Eventos', icon: 'Solar_Tablet' },
  { id: 'inventory', label: 'Mochila', icon: 'Chest' },
  { id: 'catalogue', label: 'Catalogo', icon: 'Lens' },
  { id: 'achievements', label: 'Logros', icon: 'Gold_Crown' },
  { id: 'statistics', label: 'Estadisticas', icon: 'Depth_Meter' },
  { id: 'settings', label: 'Ajustes', icon: 'Iron_Anvil' },
];

/**
 * El rail de botones del borde derecho. Cada uno abre su pantalla como una placa
 * encima del mundo: nunca se sale del juego, se le pone algo delante.
 *
 * El numero rojo es lo que hay que atender ahi dentro: invocaciones listas,
 * recetas nuevas, vecinos esperando casa, invasiones que se pueden lanzar.
 */
export function NavRail() {
  const g = useGameChannel([
    'inventory',
    'boss',
    'zone',
    'achievements',
    'crafting',
    'npcs',
    'lunar',
    'invasions',
  ]);
  const { tab, goTo } = useUi();

  const summonable =
    g.bosses.bossesOfZone(g.zones.current.id).filter((boss) => g.bosses.canSummon(boss.id)).length +
    (g.lunar.imminent ? 1 : 0);
  const craftable = g.crafting
    .grouped()
    .reduce((total, group) => total + group.recipes.filter((view) => view.craftable > 0).length, 0);

  const badgeOf = (id: TabId): number => {
    if (id === 'bosses') return summonable;
    if (id === 'crafting') return craftable;
    if (id === 'npcs') return g.npcs.waiting.length;
    if (id === 'events') return g.invasions.views().filter((view) => view.canStart).length;
    return 0;
  };

  return (
    <nav className="rail" aria-label="Pantallas">
      {RAIL.map((entry) => {
        const badge = badgeOf(entry.id);
        return (
          <button
            key={entry.id}
            className={`rail__btn${tab === entry.id ? ' rail__btn--open' : ''}`}
            onClick={() => goTo(tab === entry.id ? 'zone' : entry.id)}
            aria-pressed={tab === entry.id}
          >
            <Sprite name={entry.icon} size={22} />
            <span className="rail__label">{entry.label}</span>
            {badge > 0 ? <span className="rail__badge">{badge > 99 ? '99+' : badge}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}
