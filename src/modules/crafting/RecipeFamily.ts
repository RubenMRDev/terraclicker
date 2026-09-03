import { getItem } from '../items/ItemList';
import type { ItemId } from '../items/ItemType';

/**
 * Familias de crafteo: agrupa el conjunto completo de un material (casco, cota,
 * grebas, espada, pico y hacha de cobre juntos) en vez de listar las recetas
 * sueltas por orden alfabetico. Buscar "cobre" deja de ser necesario.
 */
interface FamilyRule {
  id: string;
  label: string;
  match: (id: ItemId) => boolean;
  /**
   * Orden en pantalla. Va aparte del orden del array porque ese es el de
   * PRIORIDAD al emparejar: las estaciones tienen que mirarse antes que los
   * metales para que el "Yunque de plomo" no caiga en el conjunto de plomo,
   * pero en pantalla van al final.
   */
  order: number;
}

const FAMILIES: FamilyRule[] = [
  // Se comprueban en este orden; el primero que encaja manda.
  {
    id: 'stations',
    label: 'Estaciones y muebles',
    order: 90,
    match: (id) =>
      /(Anvil|Forge)$/.test(id) ||
      /^(Work_Bench|Furnace|Loom|Sawmill|Alchemy_Table|Chest|Balloon|Cooking_Pot|Bookcase|Keg|Tinkerer|Hellforge|Autohammer|Ancient_Manipulator|Crystal_Ball)/.test(
        id,
      ),
  },
  {
    id: 'events',
    label: 'Disparadores de evento',
    order: 94,
    match: (id) =>
      /^(Goblin_Battle_Standard|Snow_Globe|Solar_Tablet|Naughty_Present|Martian_Probe)$/.test(id),
  },
  {
    id: 'summons',
    label: 'Invocaciones',
    order: 92,
    match: (id) =>
      /^(Suspicious|Slime_Crown|Worm_Food|Abeemination|Clothier_Voodoo|Guide_Voodoo|Mechanical_|Plantera|Lihzahrd_Power_Cell|Celestial_Sigil)/.test(
        id,
      ),
  },

  // Los cuatro conjuntos de luminita, cada uno con su pico, su armadura y sus
  // armas. Van aqui arriba a proposito: el orden del array es el de PRIORIDAD,
  // y "Gemas y magia" casa con todo lo que acaba en "Staff", asi que si
  // fueran despues se quedaria con los baculos de nebulosa y polvo estelar.
  {
    id: 'solar_set',
    label: 'Fulgor solar',
    order: 30,
    match: (id) => /^Solar_(Flare_|Eruption)/.test(id) || id === 'Daybreak',
  },
  {
    id: 'vortex_set',
    label: 'Vortice',
    order: 31,
    match: (id) =>
      /^Vortex_(Pickaxe|Helmet|Breastplate|Leggings|Beater)$/.test(id) ||
      /^(Phantasm|Lunar_Portal_Staff)$/.test(id),
  },
  {
    id: 'nebula_set',
    label: 'Nebulosa',
    order: 32,
    match: (id) =>
      /^Nebula_(Pickaxe|Helmet|Breastplate|Leggings|Blaze|Arcanum)$/.test(id) ||
      /^(Last_Prism|Rainbow_Crystal_Staff)$/.test(id),
  },
  {
    id: 'stardust_set',
    label: 'Polvo estelar',
    order: 33,
    match: (id) =>
      /^Stardust_(Pickaxe|Helmet|Plate|Leggings|Dragon_Staff|Cell_Staff)$/.test(id),
  },
  {
    id: 'lunar',
    label: 'Luminita',
    order: 34,
    match: (id) =>
      /^(Luminite|Meowmere|Star_Wrath|Influx_Waver|Picksaw|Terrarian|Zenith)/.test(id),
  },

  // ---------------------------------------------------------------- pre-hardmode
  {
    id: 'wood',
    label: 'Madera',
    order: 0,
    match: (id) => /^(Wood|Wooden|Boreal|Rich_Mahogany|Ebonwood|Shadewood|Acorn|Torch)/.test(id),
  },
  { id: 'copper', label: 'Cobre', order: 1, match: (id) => id.startsWith('Copper_') },
  { id: 'tin', label: 'Estano', order: 2, match: (id) => id.startsWith('Tin_') },
  { id: 'iron', label: 'Hierro', order: 3, match: (id) => id.startsWith('Iron_') },
  { id: 'lead', label: 'Plomo', order: 4, match: (id) => id.startsWith('Lead_') },
  { id: 'silver', label: 'Plata', order: 5, match: (id) => id.startsWith('Silver_') },
  { id: 'tungsten', label: 'Tungsteno', order: 6, match: (id) => id.startsWith('Tungsten_') },
  { id: 'gold', label: 'Oro', order: 7, match: (id) => id.startsWith('Gold_') },
  { id: 'platinum', label: 'Platino', order: 8, match: (id) => id.startsWith('Platinum_') },
  {
    id: 'gems',
    label: 'Gemas y magia',
    order: 9,
    match: (id) =>
      /Staff$/.test(id) ||
      /^(Aqua_Scepter|Magic_Missile|Bee_Gun|Flower_of_Fire|Demon_Scythe|Crystal_Storm|Rainbow_Rod|Cursed_Flames|Golden_Shower|Water_Bolt)$/.test(
        id,
      ),
  },
  {
    id: 'jungle',
    label: 'Jungla',
    order: 10,
    match: (id) =>
      /^(Jungle_|Blade_of_Grass|Thorn_Chakram|Anklet_of_the_Wind|Honeyfin)/.test(id),
  },
  {
    id: 'shadow',
    label: 'Sombra y demonita',
    order: 11,
    match: (id) => /^(Shadow_|Demonite_|Nightmare_|War_Axe|Light's_Bane|Ball_O|Vilethorn)/.test(id),
  },
  {
    id: 'meteor',
    label: 'Meteorito',
    order: 12,
    match: (id) => /^(Meteor|Meteorite_|Space_Gun|Starfury)/.test(id),
  },
  {
    id: 'necro',
    label: 'Mazmorra',
    order: 13,
    match: (id) => /^(Necro_|Muramasa|Blue_Moon|Death_Sickle)/.test(id),
  },
  {
    id: 'molten',
    label: 'Infierno',
    order: 14,
    match: (id) =>
      /^(Molten_|Hellstone_|Fiery_|Sunfury|Flamarang|Obsidian_Skull|Night's_Edge)/.test(id),
  },

  // ---------------------------------------------------------------- hardmode
  {
    id: 'cobalt',
    label: 'Cobalto',
    order: 20,
    // El escudo de cobalto es de la Mazmorra pre-hardmode, no de este conjunto.
    match: (id) => id.startsWith('Cobalt_') && id !== 'Cobalt_Shield',
  },
  { id: 'palladium', label: 'Paladio', order: 21, match: (id) => id.startsWith('Palladium_') },
  { id: 'mythril', label: 'Mitrilo', order: 22, match: (id) => id.startsWith('Mythril_') },
  { id: 'orichalcum', label: 'Oricalco', order: 23, match: (id) => id.startsWith('Orichalcum_') },
  { id: 'adamantite', label: 'Adamantita', order: 24, match: (id) => id.startsWith('Adamantite_') },
  { id: 'titanium', label: 'Titanio', order: 25, match: (id) => id.startsWith('Titanium_') },
  {
    id: 'hallowed',
    label: 'Sagrado y hojas verdaderas',
    order: 26,
    match: (id) =>
      id.startsWith('Hallowed_') ||
      /^(Excalibur|True_Excalibur|True_Night's_Edge|Terra_Blade|Pickaxe_Axe|Drax|Megashark|Optic_Staff)$/.test(
        id,
      ),
  },
  { id: 'chlorophyte', label: 'Clorofita', order: 27, match: (id) => id.startsWith('Chlorophyte_') },
  { id: 'beetle', label: 'Escarabajo', order: 28, match: (id) => id.startsWith('Beetle_') },

  // ---------------------------------------------------------------- transversales
  {
    id: 'potions',
    label: 'Pociones y consumibles',
    order: 91,
    match: (id) =>
      /Potion$/.test(id) ||
      /^(Bottled_Water|Ale|Bowl_of_Soup|Mana_Crystal|Purification_Powder|Vile_Powder|Magic_Mirror|Life_Fruit)/.test(
        id,
      ),
  },
  {
    id: 'accessories',
    label: 'Accesorios',
    order: 93,
    match: (id) =>
      /^(Aglet|Band_of|Celestial_Magnet|Mana_Flower|Cobalt_Shield|Obsidian_Shield|Ankh_Shield|Cross_Necklace|Charm_of_Myths|Philosopher's_Stone|Star_Veil|Fire_Gauntlet|Destroyer_Emblem|Avenger_Emblem|Spectre_Boots|Lightning_Boots|Frostspark_Boots|Angel_Wings|Fledgling_Wings)/.test(
        id,
      ),
  },
];

const OTHER = { id: 'other', label: 'Otros', order: 99 };

/** Etiqueta por categoria, para cuando agrupar por material no aporta nada. */
const CATEGORY_LABEL: Record<string, string> = {
  bar: 'Lingotes',
  material: 'Materiales',
  gem: 'Gemas',
  tool: 'Herramientas',
  weapon: 'Armas',
  armor: 'Armaduras',
  accessory: 'Accesorios',
  station: 'Estaciones',
  consumable: 'Consumibles',
  summon: 'Invocaciones',
};

export interface RecipeFamily {
  id: string;
  label: string;
  order: number;
}

/** Familia a la que pertenece lo que produce una receta. */
export function familyOf(itemId: ItemId): RecipeFamily {
  const family = FAMILIES.find((candidate) => candidate.match(itemId));
  if (!family) return OTHER;
  return { id: family.id, label: family.label, order: family.order };
}

/**
 * Agrupa una lista de recetas. Se agrupa por conjunto de material, que es como
 * las busca la gente (casco, cota, grebas y espada de cobre juntos), pero una
 * familia con una sola receta no es un conjunto: en el horno saldria "Cobre ·
 * lingote de cobre", "Estano · lingote de estano"... Esas caen a un grupo por
 * categoria, que ahi es simplemente "Lingotes".
 */
export function groupRecipes<T>(
  entries: readonly T[],
  outputOf: (entry: T) => ItemId,
): Array<{ id: string; label: string; order: number; entries: T[] }> {
  const byFamily = new Map<string, { id: string; label: string; order: number; entries: T[] }>();
  for (const entry of entries) {
    const family = familyOf(outputOf(entry));
    const bucket = byFamily.get(family.id) ?? { ...family, entries: [] as T[] };
    bucket.entries.push(entry);
    byFamily.set(family.id, bucket);
  }

  const groups: Array<{ id: string; label: string; order: number; entries: T[] }> = [];
  const loners: T[] = [];
  for (const bucket of byFamily.values()) {
    // "Otros" no es un conjunto de nada: sus recetas siempre caen a su categoria.
    if (bucket.id !== OTHER.id && bucket.entries.length >= 2) groups.push(bucket);
    else loners.push(...bucket.entries);
  }

  const byCategory = new Map<string, { id: string; label: string; order: number; entries: T[] }>();
  for (const entry of loners) {
    const category = getItem(outputOf(entry)).category as string;
    const bucket = byCategory.get(category) ?? {
      id: `cat-${category}`,
      label: CATEGORY_LABEL[category] ?? 'Otros',
      // Los grupos por categoria van detras de los conjuntos de material.
      order: 100,
      entries: [] as T[],
    };
    bucket.entries.push(entry);
    byCategory.set(category, bucket);
  }

  // Una familia y un grupo por categoria pueden acabar con la misma etiqueta
  // ("Accesorios" por los dos caminos): se funden en uno solo.
  const merged = new Map<string, { id: string; label: string; order: number; entries: T[] }>();
  for (const bucket of [...groups, ...byCategory.values()]) {
    const existing = merged.get(bucket.label);
    if (existing) {
      existing.entries.push(...bucket.entries);
      existing.order = Math.min(existing.order, bucket.order);
    } else {
      merged.set(bucket.label, { ...bucket });
    }
  }

  return [...merged.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}

/** Nombre del item, para ordenar dentro del grupo. */
export const displayName = (itemId: ItemId): string => getItem(itemId).name;
