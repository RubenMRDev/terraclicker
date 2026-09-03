import { App } from '../App';
import { GameEvents } from '../GameEvents';
import { getItem } from '../items/ItemList';
import { canHavePrefix, getPrefix, rollPrefix } from '../items/Prefixes';
import { ItemCategory } from '../items/ItemType';
import type { ZoneDef } from '../zones/ZoneList';
import { RecipeList, type RecipeDef, type StationId } from './RecipeList';

export interface RecipeView {
  recipe: RecipeDef;
  /** Cuantas veces se puede craftear con lo que hay en la mochila. */
  craftable: number;
  /** Falta la estacion de trabajo. */
  missingStation: boolean;
  inputs: Array<{ itemId: string; needed: number; owned: number; enough: boolean }>;
}

export const STATION_ORDER: Array<StationId | 'hand'> = [
  'hand',
  'Work_Bench',
  'Furnace',
  'Loom',
  'Iron_Anvil',
  'Alchemy_Table',
  'Cooking_Pot',
  "Tinkerer's_Workshop",
  'Sawmill',
  'Demon_Altar',
  'Hellforge',
  'Mythril_Anvil',
  'Adamantite_Forge',
  'Autohammer',
  'Ancient_Manipulator',
];

export const STATION_LABEL: Record<StationId | 'hand', string> = {
  hand: 'A mano',
  Work_Bench: 'Mesa de trabajo',
  Furnace: 'Horno',
  Loom: 'Telar',
  Iron_Anvil: 'Yunque de hierro',
  Alchemy_Table: 'Mesa de alquimia',
  Sawmill: 'Aserradero',
  Cooking_Pot: 'Olla',
  Demon_Altar: 'Altar demoniaco',
  Hellforge: 'Forja infernal',
  Lead_Anvil: 'Yunque de plomo',
  "Tinkerer's_Workshop": 'Taller del inventor',
  Mythril_Anvil: 'Yunque de mitrilo',
  Adamantite_Forge: 'Forja de adamantita',
  Autohammer: 'Automartillo',
  Ancient_Manipulator: 'Manipulador antiguo',
  Orichalcum_Anvil: 'Yunque de oricalco',
  Titanium_Forge: 'Forja de titanio',
};

/**
 * Probabilidad de que una pieza fabricada salga con rasgo. Baja a proposito:
 * encontrarse un "Legendario" tiene que ser una alegria, no la norma.
 */
export const PREFIX_ON_CRAFT_CHANCE = 0.08;

/**
 * Estaciones que hacen exactamente lo mismo. Evita duplicar cada receta del
 * yunque solo porque exista la version de plomo.
 */
const STATION_ALTERNATIVES: Partial<Record<StationId, StationId[]>> = {
  Iron_Anvil: ['Lead_Anvil', 'Mythril_Anvil', 'Orichalcum_Anvil'],
  Mythril_Anvil: ['Orichalcum_Anvil'],
  Adamantite_Forge: ['Titanium_Forge'],
};

/** Crafteo. Una estacion se considera disponible con tener una en la mochila. */
export class Crafting {
  hasStation(station: StationId | null): boolean {
    if (station === null) return true;
    if (App.game.inventory.has(station)) return true;
    if ((STATION_ALTERNATIVES[station] ?? []).some((alt) => App.game.inventory.has(alt))) return true;
    return this.zonesWith(station).some((zone) => App.game.zones.visited.has(zone.id));
  }

  /** Zonas cuyo bioma tiene esa estacion fija. */
  zonesWith(station: StationId): ZoneDef[] {
    return App.game.zones.all.filter((zone) => zone.stations?.includes(station));
  }

  /**
   * Donde conseguir una estacion que no tienes: fabricandola, o visitando la
   * zona en la que existe. Devuelve null si ya esta disponible.
   */
  stationHint(station: StationId | null): string | null {
    if (station === null || this.hasStation(station)) return null;
    const zones = this.zonesWith(station);
    if (zones.length > 0) {
      return `Solo en ${zones.map((zone) => zone.name).join(', ')}`;
    }
    return 'Falta la estacion';
  }

  view(recipe: RecipeDef): RecipeView {
    const { inventory } = App.game;
    const inputs = recipe.inputs.map((input) => {
      const owned = inventory.count(input.itemId);
      return {
        itemId: input.itemId,
        needed: input.amount,
        owned,
        enough: owned >= input.amount,
      };
    });

    const missingStation = !this.hasStation(recipe.station);
    const craftable = missingStation
      ? 0
      : Math.min(...inputs.map((input) => Math.floor(input.owned / input.needed)));

    return { recipe, craftable: Number.isFinite(craftable) ? craftable : 0, missingStation, inputs };
  }

  /** Todas las recetas visibles, agrupadas por estacion. */
  grouped(): Array<{ station: StationId | 'hand'; label: string; recipes: RecipeView[] }> {
    const groups = new Map<StationId | 'hand', RecipeView[]>();
    for (const recipe of RecipeList) {
      const key = recipe.station ?? 'hand';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(this.view(recipe));
    }
    return STATION_ORDER.filter((station) => groups.has(station)).map((station) => ({
      station,
      label: STATION_LABEL[station],
      recipes: groups.get(station)!,
    }));
  }

  canCraft(recipe: RecipeDef, times = 1): boolean {
    if (!this.hasStation(recipe.station)) return false;
    return App.game.inventory.hasAll(
      recipe.inputs.map((input) => ({ itemId: input.itemId, amount: input.amount * times })),
    );
  }

  craft(recipe: RecipeDef, times = 1): boolean {
    if (times <= 0 || !this.canCraft(recipe, times)) return false;

    const consumed = recipe.inputs.map((input) => ({
      itemId: input.itemId,
      amount: input.amount * times,
    }));
    if (!App.game.inventory.removeAll(consumed)) return false;

    const gained = recipe.output.amount * times;
    App.game.inventory.gain(recipe.output.itemId, gained, true);
    App.game.statistics.itemsCrafted += times;

    const item = getItem(recipe.output.itemId);

    // Un rasgo al fabricar, de vez en cuando. Solo si la pieza admite (las
    // armaduras no llevan) y si todavia no tenia uno.
    if (
      canHavePrefix(item) &&
      !App.game.inventory.prefixOf(item.id) &&
      Math.random() < PREFIX_ON_CRAFT_CHANCE
    ) {
      const prefixId = rollPrefix(item);
      if (prefixId) {
        App.game.inventory.setPrefix(item.id, prefixId);
        const prefix = getPrefix(prefixId);
        App.game.notifier.push(
          `${prefix?.name} ${item.name}!`,
          prefix?.bad ? 'warning' : 'achievement',
          item.id,
        );
      }
    }

    App.game.notifier.push(`Has fabricado ${item.name} x${gained}`, 'success', recipe.output.itemId);

    // Las estaciones desbloquean recetas nuevas, asi que refrescamos la pestana.
    if (item.category === ItemCategory.Station) GameEvents.notify('crafting');
    App.game.achievements.check();
    GameEvents.notifySync('inventory', 'crafting', 'statistics');
    return true;
  }

  /** Craftea todas las veces posibles de golpe. */
  craftMax(recipe: RecipeDef): number {
    const times = this.view(recipe).craftable;
    return this.craft(recipe, times) ? times : 0;
  }
}
