import { useState } from 'react';
import { AchievementsPanel } from './components/achievements/AchievementsPanel';
import { BossPanel } from './components/boss/BossPanel';
import { CataloguePanel } from './components/catalogue/CataloguePanel';
import { CraftingPanel } from './components/crafting/CraftingPanel';
import { EventBanner } from './components/events/EventBanner';
import { EventsPanel } from './components/events/EventsPanel';
import { CharacterPlate } from './components/hud/CharacterPlate';
import { EquipmentPlate } from './components/hud/EquipmentPlate';
import { LootFeed } from './components/hud/LootFeed';
import { NavRail, RAIL } from './components/hud/NavRail';
import { ResourceStrip } from './components/hud/ResourceStrip';
import { ZoneDock } from './components/hud/ZoneDock';
import { InventoryPanel } from './components/inventory/InventoryPanel';
import { Toasts } from './components/notifications/Toasts';
import { NpcsPanel } from './components/npcs/NpcsPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { Modal } from './components/shared/Modal';
import { Sprite } from './components/shared/Sprite';
import { StatisticsPanel } from './components/statistics/StatisticsPanel';
import { WorldStage } from './components/world/WorldStage';
import { ZoneInfo } from './components/world/ZoneInfo';
import { useGameChannel } from './hooks/useGame';
import { UiProvider, useUi, type TabId } from './hooks/useUi';
import { BossPhase } from './modules/GameConstants';

/** Las pantallas que se abren encima del mundo, con el ancho que cada una pide. */
const SCREENS: Partial<Record<TabId, { render: () => React.ReactElement; width: number }>> = {
  bosses: { render: BossPanel, width: 980 },
  crafting: { render: CraftingPanel, width: 1080 },
  npcs: { render: NpcsPanel, width: 1000 },
  events: { render: EventsPanel, width: 1000 },
  inventory: { render: InventoryPanel, width: 900 },
  catalogue: { render: CataloguePanel, width: 1000 },
  achievements: { render: AchievementsPanel, width: 1040 },
  statistics: { render: StatisticsPanel, width: 760 },
  settings: { render: SettingsPanel, width: 720 },
};

function Shell() {
  const { tab, goTo } = useUi();
  const g = useGameChannel(['boss', 'zone']);
  const [zoneInfo, setZoneInfo] = useState(false);

  // Una bossfight se come la pantalla entera: es lo que esta pasando, y el
  // mundo de la zona no pinta nada mientras el jefe te esta pegando.
  const fighting = g.bosses.state !== BossPhase.Idle;
  const screen = fighting ? SCREENS.bosses : SCREENS[tab];
  // Peleando, el modal se titula con el jefe y su fase: "JEFES" encima de la
  // cara del Senor de la Luna no dice nada que no se vea.
  const label = fighting
    ? (g.bosses.boss?.name ?? 'Jefes')
    : (RAIL.find((entry) => entry.id === tab)?.label ?? '');
  const aside = fighting ? g.bosses.phase?.name : undefined;

  return (
    <div className="shell" style={{ '--accent': g.zones.current.accent } as React.CSSProperties}>
      <WorldStage onOpenZoneInfo={() => setZoneInfo(true)} />

      <div className="hud">
        <div className="hud__left">
          <CharacterPlate />
          <LootFeed />
        </div>

        <div className="hud__right">
          <ResourceStrip />
          <EquipmentPlate />
          <NavRail />
        </div>

        <div className="hud__bottom">
          <EventBanner />
          <ZoneDock />
        </div>
      </div>

      {screen ? (
        <Modal
          title={label}
          aside={aside}
          icon={fighting && g.bosses.boss ? <Sprite name={g.bosses.boss.sprite} size={26} /> : undefined}
          onClose={() => (fighting ? undefined : goTo('zone'))}
          width={screen.width}
          canClose={!fighting}
        >
          <screen.render />
        </Modal>
      ) : null}

      {zoneInfo ? (
        <Modal
          title={g.zones.current.name}
          aside="que hay aqui"
          onClose={() => setZoneInfo(false)}
          width={720}
          level={1}
        >
          <ZoneInfo />
        </Modal>
      ) : null}

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
