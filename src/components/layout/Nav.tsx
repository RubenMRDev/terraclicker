import { useGameChannel } from '../../hooks/useGame';
import { useUi, type TabId } from '../../hooks/useUi';
import { Sprite } from '../shared/Sprite';

const TABS: Array<{ id: TabId; label: string; icon: string }> = [
  { id: 'zone', label: 'Zona', icon: 'Copper_Pickaxe' },
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

/** Pestañas principales, en horizontal para que estén siempre a un click. */
export function Nav({ active }: { active: TabId }) {
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
  const { goTo } = useUi();

  // Aviso en Jefes cuando hay algo invocable aqui mismo, mas el jefe que imponga
  // el evento lunar (que no esta en la zona actual pero es lo mas urgente).
  const summonable =
    g.bosses.bossesOfZone(g.zones.current.id).filter((boss) => g.bosses.canSummon(boss.id)).length +
    (g.lunar.imminent ? 1 : 0);

  // Y en Fabricar cuando hay algo que ya se puede hacer.
  const craftable = g.crafting
    .grouped()
    .reduce((total, group) => total + group.recipes.filter((view) => view.craftable > 0).length, 0);

  const badgeOf = (id: TabId): number => {
    if (id === 'bosses') return summonable;
    if (id === 'crafting') return craftable;
    // En Pueblo: vecinos que ya cumplen su condicion y estan esperando casa.
    if (id === 'npcs') return g.npcs.waiting.length;
    // En Eventos: invasiones que se pueden lanzar ahora mismo.
    if (id === 'events') return g.invasions.views().filter((view) => view.canStart).length;
    return 0;
  };

  return (
    <nav className="nav">
      {TABS.map((tab) => {
        const badge = badgeOf(tab.id);
        return (
          <button
            key={tab.id}
            className={`nav__item${active === tab.id ? ' nav__item--active' : ''}`}
            onClick={() => goTo(tab.id)}
          >
            <Sprite name={tab.icon} size={20} />
            <span className="nav__item__label">{tab.label}</span>
            {badge > 0 ? <span className="nav__item__badge">{badge}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}
