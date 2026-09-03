import { AchievementsPanel } from './components/achievements/AchievementsPanel';
import { BossPanel } from './components/boss/BossPanel';
import { CataloguePanel } from './components/catalogue/CataloguePanel';
import { CraftingPanel } from './components/crafting/CraftingPanel';
import { EventBanner } from './components/events/EventBanner';
import { EventsPanel } from './components/events/EventsPanel';
import { InventoryPanel } from './components/inventory/InventoryPanel';
import { Nav } from './components/layout/Nav';
import { TopBar } from './components/layout/TopBar';
import { Toasts } from './components/notifications/Toasts';
import { NpcsPanel } from './components/npcs/NpcsPanel';
import { PlayerPanel } from './components/player/PlayerPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { StatisticsPanel } from './components/statistics/StatisticsPanel';
import { ZoneBar } from './components/zone/ZoneBar';
import { ZonePanel } from './components/zone/ZonePanel';
import { useGameChannel } from './hooks/useGame';
import { UiProvider, useUi, type TabId } from './hooks/useUi';
import { BossPhase } from './modules/GameConstants';

const PANELS: Record<TabId, () => React.ReactElement> = {
  zone: ZonePanel,
  bosses: BossPanel,
  crafting: CraftingPanel,
  npcs: NpcsPanel,
  events: EventsPanel,
  inventory: InventoryPanel,
  catalogue: CataloguePanel,
  achievements: AchievementsPanel,
  statistics: StatisticsPanel,
  settings: SettingsPanel,
};

/** Pestañas en las que el selector de zona no pinta nada. */
const HIDE_ZONE_BAR: TabId[] = [
  'catalogue',
  'achievements',
  'statistics',
  'settings',
  'npcs',
  'events',
];

function Shell() {
  const { tab } = useUi();
  const g = useGameChannel('boss');

  // Mientras hay pelea (o su pantalla de resultado) manda la pestana de jefes.
  // Se deriva en el render en vez de con un efecto: al cerrar la pelea el
  // jugador vuelve solo a donde estaba.
  const fighting = g.bosses.state !== BossPhase.Idle;
  const activeTab = fighting ? 'bosses' : tab;
  const Panel = PANELS[activeTab];

  return (
    <div className="app">
      <header className="app__top">
        <TopBar />
        <Nav active={activeTab} />
        {/* El aviso del evento lunar va por encima de todo y no se va hasta que
            se resuelve: es lo que hace que un jefe sea "inminente". */}
        {!fighting ? <EventBanner /> : null}
        {/* Viajar en mitad de una pelea no esta permitido, asi que la barra se
            oculta en vez de ofrecer botones que no hacen nada. */}
        {!fighting && !HIDE_ZONE_BAR.includes(activeTab) ? <ZoneBar /> : null}
      </header>

      <main className="app__main">
        <Panel />
      </main>

      <aside className="app__side">
        <PlayerPanel />
      </aside>

      <Toasts />
    </div>
  );
}

export function App() {
  return (
    <UiProvider>
      <Shell />
    </UiProvider>
  );
}
