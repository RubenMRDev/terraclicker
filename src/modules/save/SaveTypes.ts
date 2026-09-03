import type { AchievementsSave } from '../achievements/Achievements';
import type { InvasionsSave } from '../events/Invasions';
import type { LunarSave } from '../events/LunarEvent';
import type { InventorySave } from '../items/Inventory';
import type { NpcsSave } from '../npcs/Npcs';
import type { PlayerSave } from '../player/Player';
import type { StatisticsSave } from '../statistics/Statistics';
import type { WalletSave } from '../wallet/Wallet';
import type { ZonesSave } from '../zones/Zones';

export interface SettingsSave {
  showDamageNumbers: boolean;
  showLootFeed: boolean;
  autoTravelOnUnlock: boolean;
  /** Autoclicker de zona, a 20 clicks por segundo. */
  autoClick: boolean;
  /** Autocombate en bossfights: pega solo y bebe pociones. */
  autoBattle: boolean;
  /** Animaciones de los paneles. Se puede apagar si molestan. */
  animations: boolean;
}

export interface GameSave {
  version: number;
  savedAt: number;
  player: PlayerSave;
  inventory: InventorySave;
  wallet: WalletSave;
  zones: ZonesSave;
  statistics: StatisticsSave;
  achievements: AchievementsSave;
  npcs: NpcsSave;
  lunar: LunarSave;
  invasions: InvasionsSave;
  settings: SettingsSave;
}

export const DEFAULT_SETTINGS: SettingsSave = {
  showDamageNumbers: true,
  showLootFeed: true,
  autoTravelOnUnlock: false,
  autoClick: false,
  autoBattle: false,
  animations: true,
};
