import type { ItemAmount, ItemId } from '../items/ItemType';

/** Estacion necesaria para una receta. `null` = se puede craftear a mano. */
export type StationId =
  | 'Work_Bench'
  | 'Furnace'
  | 'Iron_Anvil'
  | 'Alchemy_Table'
  | 'Loom'
  | 'Sawmill'
  | 'Cooking_Pot'
  | 'Demon_Altar'
  | 'Hellforge'
  | 'Lead_Anvil'
  | "Tinkerer's_Workshop"
  | 'Mythril_Anvil'
  | 'Adamantite_Forge'
  | 'Autohammer'
  | 'Ancient_Manipulator'
  | 'Orichalcum_Anvil'
  | 'Titanium_Forge';

export interface RecipeDef {
  id: string;
  output: ItemAmount;
  inputs: ItemAmount[];
  station: StationId | null;
}

const recipe = (
  output: ItemId,
  amount: number,
  station: StationId | null,
  inputs: Array<[ItemId, number]>,
): RecipeDef => ({
  id: `${output}__${station ?? 'hand'}`,
  output: { itemId: output, amount },
  inputs: inputs.map(([itemId, count]) => ({ itemId, amount: count })),
  station,
});

/**
 * Recetario. El orden importa: es el que se ve en la pantalla de crafteo,
 * agrupado despues por estacion.
 */
export const RecipeList: RecipeDef[] = [

  // ================================================================ LUMINITA
  // El tier del postgame: la luminita sale del Senor de la Luna y los cuatro
  // fragmentos de los pilares, asi que nada de esto se puede tocar antes de
  // haber hecho el evento lunar completo.
  recipe('Luminite_Brick', 1, 'Ancient_Manipulator', [['Luminite_Bar', 1]]),

  // -------------------------------------------------------------- picos y hacha
  recipe('Solar_Flare_Pickaxe', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 18],
    ['Solar_Fragment', 60],
  ]),
  recipe('Vortex_Pickaxe', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 18],
    ['Vortex_Fragment', 60],
  ]),
  recipe('Nebula_Pickaxe', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 18],
    ['Nebula_Fragment', 60],
  ]),
  recipe('Stardust_Pickaxe', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 18],
    ['Stardust_Fragment', 60],
  ]),
  recipe('Solar_Flare_Axe', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 16],
    ['Solar_Fragment', 50],
  ]),

  // -------------------------------------------------------------- armaduras
  recipe('Solar_Flare_Helmet', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 10],
    ['Solar_Fragment', 36],
  ]),
  recipe('Solar_Flare_Breastplate', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 14],
    ['Solar_Fragment', 48],
  ]),
  recipe('Solar_Flare_Leggings', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Solar_Fragment', 42],
  ]),
  recipe('Vortex_Helmet', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 10],
    ['Vortex_Fragment', 36],
  ]),
  recipe('Vortex_Breastplate', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 14],
    ['Vortex_Fragment', 48],
  ]),
  recipe('Vortex_Leggings', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Vortex_Fragment', 42],
  ]),
  recipe('Nebula_Helmet', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 10],
    ['Nebula_Fragment', 36],
  ]),
  recipe('Nebula_Breastplate', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 14],
    ['Nebula_Fragment', 48],
  ]),
  recipe('Nebula_Leggings', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Nebula_Fragment', 42],
  ]),
  recipe('Stardust_Helmet', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 10],
    ['Stardust_Fragment', 36],
  ]),
  recipe('Stardust_Plate', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 14],
    ['Stardust_Fragment', 48],
  ]),
  recipe('Stardust_Leggings', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Stardust_Fragment', 42],
  ]),

  // -------------------------------------------------------------- armas
  recipe('Solar_Eruption', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Solar_Fragment', 45],
  ]),
  recipe('Daybreak', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Solar_Fragment', 45],
  ]),
  recipe('Vortex_Beater', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Vortex_Fragment', 45],
  ]),
  recipe('Phantasm', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Vortex_Fragment', 45],
  ]),
  recipe('Nebula_Blaze', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Nebula_Fragment', 45],
  ]),
  recipe('Nebula_Arcanum', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Nebula_Fragment', 45],
  ]),
  recipe('Last_Prism', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 16],
    ['Nebula_Fragment', 60],
  ]),
  recipe('Stardust_Dragon_Staff', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Stardust_Fragment', 45],
  ]),
  recipe('Stardust_Cell_Staff', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Stardust_Fragment', 45],
  ]),
  recipe('Lunar_Portal_Staff', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Vortex_Fragment', 45],
  ]),
  recipe('Rainbow_Crystal_Staff', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 12],
    ['Nebula_Fragment', 45],
  ]),

  // -------------------------------------------------------------- el Cenit
  // Diez espadas, como en Terraria. Es el ultimo objetivo del juego: obliga a
  // no vender ni una de las espadas de rama por el camino.
  recipe('Zenith', 1, 'Ancient_Manipulator', [
    ['Luminite_Bar', 20],
    ['Terra_Blade', 1],
    ['Meowmere', 1],
    ['Star_Wrath', 1],
    ['Influx_Waver', 1],
    ['Terrarian', 1],
    ['Excalibur', 1],
    ['True_Excalibur', 1],
    ["True_Night's_Edge", 1],
    ['Muramasa', 1],
    ['Copper_Shortsword', 1],
  ]),

  // ================================================================ EVENTOS
  // Los disparadores de las invasiones. La primera vez el evento sale gratis;
  // esto es para repetirlo, y cada uno se paga con lo que suelta su propio
  // evento, asi que farmearlos se retroalimenta.
  recipe('Goblin_Battle_Standard', 1, 'Work_Bench', [
    ['Tattered_Cloth', 5],
    ['Silk', 10],
  ]),
  recipe('Snow_Globe', 1, 'Work_Bench', [
    ['Glass', 10],
    ['Snow_Block', 25],
    ['Ice_Block', 10],
  ]),
  recipe('Solar_Tablet', 1, 'Demon_Altar', [['Solar_Tablet_Fragment', 8]]),
  recipe('Naughty_Present', 1, 'Mythril_Anvil', [
    ['Silk', 20],
    ['Ectoplasm', 8],
    ['Soul_of_Fright', 5],
  ]),
  recipe('Martian_Probe', 1, 'Mythril_Anvil', [
    ['Martian_Conduit_Plating', 20],
    ['Chlorophyte_Bar', 5],
  ]),

  // ================================================================ CASAS
  // Los muebles minimos de una casa habitable. Salen de madera, que es lo que
  // hace que construir un pueblo cueste arboles.
  recipe('Wooden_Door', 1, 'Work_Bench', [['Wood', 6]]),
  recipe('Wooden_Table', 1, 'Work_Bench', [['Wood', 8]]),
  recipe('Wooden_Chair', 1, 'Work_Bench', [['Wood', 4]]),
  recipe('Bed', 1, 'Sawmill', [
    ['Wood', 15],
    ['Silk', 5],
  ]),

  // ================================================================ HARDMODE
  // El cobalto y el paladio aun se funden en la forja infernal; a partir del
  // mitrilo hace falta su yunque, y la adamantita solo cede en su propia forja.
  recipe('Cobalt_Bar', 1, 'Hellforge', [['Cobalt_Ore', 3]]),
  recipe('Palladium_Bar', 1, 'Hellforge', [['Palladium_Ore', 3]]),
  recipe('Mythril_Bar', 1, 'Hellforge', [['Mythril_Ore', 4]]),
  recipe('Orichalcum_Bar', 1, 'Hellforge', [['Orichalcum_Ore', 4]]),
  recipe('Mythril_Anvil', 1, 'Iron_Anvil', [['Mythril_Bar', 10]]),
  recipe('Orichalcum_Anvil', 1, 'Iron_Anvil', [['Orichalcum_Bar', 12]]),
  recipe('Adamantite_Forge', 1, 'Mythril_Anvil', [
    ['Hellforge', 1],
    ['Adamantite_Ore', 30],
  ]),
  recipe('Titanium_Forge', 1, 'Mythril_Anvil', [
    ['Hellforge', 1],
    ['Titanium_Ore', 30],
  ]),
  recipe('Adamantite_Bar', 1, 'Adamantite_Forge', [['Adamantite_Ore', 5]]),
  recipe('Titanium_Bar', 1, 'Adamantite_Forge', [['Titanium_Ore', 5]]),
  recipe('Autohammer', 1, 'Mythril_Anvil', [
    ['Chlorophyte_Ore', 20],
    ['Adamantite_Bar', 10],
  ]),
  recipe('Chlorophyte_Bar', 1, 'Autohammer', [['Chlorophyte_Ore', 5]]),
  recipe('Luminite_Bar', 1, 'Ancient_Manipulator', [['Luminite', 4]]),
  recipe('Crystal_Ball', 1, 'Mythril_Anvil', [
    ['Crystal_Shard', 10],
    ['Soul_of_Light', 5],
  ]),

  // -------------------------------------------------------------- cobalto y paladio
  recipe('Cobalt_Pickaxe', 1, 'Iron_Anvil', [['Cobalt_Bar', 15]]),
  recipe('Palladium_Pickaxe', 1, 'Iron_Anvil', [['Palladium_Bar', 15]]),
  recipe('Cobalt_Waraxe', 1, 'Iron_Anvil', [['Cobalt_Bar', 14]]),
  recipe('Cobalt_Sword', 1, 'Iron_Anvil', [['Cobalt_Bar', 10]]),
  recipe('Palladium_Sword', 1, 'Iron_Anvil', [['Palladium_Bar', 10]]),
  recipe('Cobalt_Helmet', 1, 'Iron_Anvil', [['Cobalt_Bar', 15]]),
  recipe('Cobalt_Breastplate', 1, 'Iron_Anvil', [['Cobalt_Bar', 25]]),
  recipe('Cobalt_Leggings', 1, 'Iron_Anvil', [['Cobalt_Bar', 20]]),
  recipe('Palladium_Helmet', 1, 'Iron_Anvil', [['Palladium_Bar', 15]]),
  recipe('Palladium_Breastplate', 1, 'Iron_Anvil', [['Palladium_Bar', 25]]),
  recipe('Palladium_Leggings', 1, 'Iron_Anvil', [['Palladium_Bar', 20]]),
  recipe('Fledgling_Wings', 1, 'Iron_Anvil', [
    ['Soul_of_Flight', 10],
    ['Cobalt_Bar', 10],
  ]),

  // -------------------------------------------------------------- mitrilo y oricalco
  recipe('Mythril_Pickaxe', 1, 'Mythril_Anvil', [['Mythril_Bar', 18]]),
  recipe('Orichalcum_Pickaxe', 1, 'Mythril_Anvil', [['Orichalcum_Bar', 18]]),
  recipe('Mythril_Waraxe', 1, 'Mythril_Anvil', [['Mythril_Bar', 16]]),
  recipe('Mythril_Sword', 1, 'Mythril_Anvil', [['Mythril_Bar', 12]]),
  recipe('Orichalcum_Sword', 1, 'Mythril_Anvil', [['Orichalcum_Bar', 12]]),
  recipe('Mythril_Helmet', 1, 'Mythril_Anvil', [['Mythril_Bar', 15]]),
  recipe('Mythril_Chainmail', 1, 'Mythril_Anvil', [['Mythril_Bar', 25]]),
  recipe('Mythril_Greaves', 1, 'Mythril_Anvil', [['Mythril_Bar', 20]]),
  recipe('Orichalcum_Helmet', 1, 'Mythril_Anvil', [['Orichalcum_Bar', 15]]),
  recipe('Orichalcum_Breastplate', 1, 'Mythril_Anvil', [['Orichalcum_Bar', 25]]),
  recipe('Orichalcum_Leggings', 1, 'Mythril_Anvil', [['Orichalcum_Bar', 20]]),
  recipe('Angel_Wings', 1, 'Mythril_Anvil', [
    ['Soul_of_Flight', 25],
    ['Soul_of_Light', 20],
    ['Mythril_Bar', 10],
  ]),
  recipe('Spectre_Boots', 1, "Tinkerer's_Workshop", [
    ['Rocket_Boots', 1],
    ['Hermes_Boots', 1],
  ]),
  recipe('Lightning_Boots', 1, "Tinkerer's_Workshop", [
    ['Spectre_Boots', 1],
    ['Aglet', 1],
    ['Anklet_of_the_Wind', 1],
  ]),
  recipe('Frostspark_Boots', 1, "Tinkerer's_Workshop", [
    ['Lightning_Boots', 1],
    ['Soul_of_Light', 10],
  ]),
  recipe('Obsidian_Shield', 1, "Tinkerer's_Workshop", [
    ['Cobalt_Shield', 1],
    ['Obsidian_Skull', 1],
  ]),
  recipe('Ankh_Shield', 1, "Tinkerer's_Workshop", [
    ['Obsidian_Shield', 1],
    ['Soul_of_Night', 20],
    ['Soul_of_Light', 20],
  ]),
  recipe('Star_Veil', 1, "Tinkerer's_Workshop", [
    ['Cross_Necklace', 1],
    ['Soul_of_Light', 15],
  ]),
  recipe('Charm_of_Myths', 1, "Tinkerer's_Workshop", [
    ["Philosopher's_Stone", 1],
    ['Band_of_Regeneration', 1],
  ]),
  recipe("Philosopher's_Stone", 1, 'Mythril_Anvil', [
    ['Crystal_Shard', 15],
    ['Soul_of_Light', 10],
    ['Gold_Bar', 10],
  ]),
  recipe('Avenger_Emblem', 1, "Tinkerer's_Workshop", [
    ['Soul_of_Might', 5],
    ['Soul_of_Sight', 5],
    ['Soul_of_Fright', 5],
  ]),
  recipe('Destroyer_Emblem', 1, "Tinkerer's_Workshop", [
    ['Avenger_Emblem', 1],
    ['Soul_of_Might', 15],
  ]),
  recipe('Fire_Gauntlet', 1, "Tinkerer's_Workshop", [
    ['Feral_Claws', 1],
    ['Magma_Stone', 1],
    ['Soul_of_Might', 10],
  ]),

  // -------------------------------------------------------------- adamantita y titanio
  recipe('Adamantite_Pickaxe', 1, 'Mythril_Anvil', [['Adamantite_Bar', 18]]),
  recipe('Titanium_Pickaxe', 1, 'Mythril_Anvil', [['Titanium_Bar', 18]]),
  recipe('Adamantite_Waraxe', 1, 'Mythril_Anvil', [['Adamantite_Bar', 16]]),
  recipe('Adamantite_Sword', 1, 'Mythril_Anvil', [['Adamantite_Bar', 12]]),
  recipe('Titanium_Sword', 1, 'Mythril_Anvil', [['Titanium_Bar', 12]]),
  recipe('Adamantite_Helmet', 1, 'Mythril_Anvil', [['Adamantite_Bar', 15]]),
  recipe('Adamantite_Breastplate', 1, 'Mythril_Anvil', [['Adamantite_Bar', 25]]),
  recipe('Adamantite_Leggings', 1, 'Mythril_Anvil', [['Adamantite_Bar', 20]]),
  recipe('Titanium_Helmet', 1, 'Mythril_Anvil', [['Titanium_Bar', 15]]),
  recipe('Titanium_Breastplate', 1, 'Mythril_Anvil', [['Titanium_Bar', 25]]),
  recipe('Titanium_Leggings', 1, 'Mythril_Anvil', [['Titanium_Bar', 20]]),
  recipe('Megashark', 1, 'Mythril_Anvil', [
    ['Soul_of_Might', 20],
    ['Shark_Fin', 5],
    ['Adamantite_Bar', 15],
  ]),

  // -------------------------------------------------------------- invocaciones mecanicas
  recipe('Mechanical_Eye', 1, 'Demon_Altar', [
    ['Lens', 6],
    ['Iron_Bar', 5],
    ['Soul_of_Light', 6],
  ]),
  recipe('Mechanical_Worm', 1, 'Demon_Altar', [
    ['Rotten_Chunk', 6],
    ['Iron_Bar', 5],
    ['Soul_of_Night', 6],
  ]),
  recipe('Mechanical_Skull', 1, 'Demon_Altar', [
    ['Bone', 30],
    ['Iron_Bar', 5],
    ['Soul_of_Light', 3],
    ['Soul_of_Night', 3],
  ]),
  recipe("Plantera's_Bulb", 1, 'Demon_Altar', [
    ['Chlorophyte_Ore', 15],
    ['Jungle_Spores', 20],
    ['Soul_of_Night', 10],
  ]),
  recipe('Lihzahrd_Power_Cell', 1, 'Demon_Altar', [
    ['Lihzahrd_Brick', 25],
    ['Ectoplasm', 10],
    ['Temple_Key', 1],
  ]),
  // Veinte de cada fragmento, como en Terraria. Sirve para repetir la pelea del
  // Senor de la Luna una vez ya se ha hecho el evento entero.
  recipe('Celestial_Sigil', 1, 'Ancient_Manipulator', [
    ['Solar_Fragment', 20],
    ['Vortex_Fragment', 20],
    ['Nebula_Fragment', 20],
    ['Stardust_Fragment', 20],
  ]),

  // -------------------------------------------------------------- lingote sagrado
  recipe('Hallowed_Helmet', 1, 'Mythril_Anvil', [['Hallowed_Bar', 12]]),
  recipe('Hallowed_Plate_Mail', 1, 'Mythril_Anvil', [['Hallowed_Bar', 20]]),
  recipe('Hallowed_Greaves', 1, 'Mythril_Anvil', [['Hallowed_Bar', 16]]),
  recipe('Excalibur', 1, 'Mythril_Anvil', [['Hallowed_Bar', 12]]),
  recipe('Pickaxe_Axe', 1, 'Mythril_Anvil', [
    ['Hallowed_Bar', 18],
    ['Soul_of_Might', 12],
    ['Soul_of_Sight', 12],
    ['Soul_of_Fright', 12],
  ]),
  recipe('Drax', 1, 'Mythril_Anvil', [
    ['Hallowed_Bar', 18],
    ['Soul_of_Might', 12],
    ['Soul_of_Sight', 12],
    ['Soul_of_Fright', 12],
  ]),
  recipe('True_Excalibur', 1, 'Mythril_Anvil', [
    ['Excalibur', 1],
    ['Broken_Hero_Sword', 1],
  ]),
  recipe("True_Night's_Edge", 1, 'Mythril_Anvil', [
    ["Night's_Edge", 1],
    ['Broken_Hero_Sword', 1],
  ]),
  recipe('Terra_Blade', 1, 'Mythril_Anvil', [
    ['True_Excalibur', 1],
    ["True_Night's_Edge", 1],
  ]),

  // -------------------------------------------------------------- clorofita y escarabajo
  recipe('Chlorophyte_Pickaxe', 1, 'Mythril_Anvil', [['Chlorophyte_Bar', 18]]),
  recipe('Chlorophyte_Greataxe', 1, 'Mythril_Anvil', [['Chlorophyte_Bar', 16]]),
  recipe('Chlorophyte_Saber', 1, 'Mythril_Anvil', [['Chlorophyte_Bar', 12]]),
  recipe('Chlorophyte_Helmet', 1, 'Mythril_Anvil', [['Chlorophyte_Bar', 12]]),
  recipe('Chlorophyte_Plate_Mail', 1, 'Mythril_Anvil', [['Chlorophyte_Bar', 20]]),
  recipe('Chlorophyte_Greaves', 1, 'Mythril_Anvil', [['Chlorophyte_Bar', 16]]),
  recipe('Beetle_Helmet', 1, 'Mythril_Anvil', [
    ['Beetle_Husk', 8],
    ['Chlorophyte_Helmet', 1],
  ]),
  recipe('Beetle_Scale_Mail', 1, 'Mythril_Anvil', [
    ['Beetle_Husk', 12],
    ['Chlorophyte_Plate_Mail', 1],
  ]),
  recipe('Beetle_Leggings', 1, 'Mythril_Anvil', [
    ['Beetle_Husk', 10],
    ['Chlorophyte_Greaves', 1],
  ]),
  recipe('Beetle_Wings', 1, 'Mythril_Anvil', [
    ['Beetle_Shell', 2],
    ['Beetle_Husk', 10],
    ['Soul_of_Flight', 20],
  ]),

  // -------------------------------------------------------------- magia de hardmode
  recipe('Crystal_Storm', 1, 'Mythril_Anvil', [
    ['Crystal_Shard', 25],
    ['Soul_of_Light', 15],
  ]),
  recipe('Rainbow_Rod', 1, 'Mythril_Anvil', [
    ['Crystal_Shard', 30],
    ['Soul_of_Light', 20],
    ['Pixie_Dust', 15],
  ]),
  recipe('Cursed_Flames', 1, 'Mythril_Anvil', [
    ['Soul_of_Night', 25],
    ['Dark_Shard', 2],
  ]),
  recipe('Golden_Shower', 1, 'Mythril_Anvil', [
    ['Soul_of_Night', 20],
    ['Ectoplasm', 10],
  ]),
  recipe('Optic_Staff', 1, "Tinkerer's_Workshop", [
    ['Soul_of_Sight', 20],
    ['Black_Lens', 2],
    ['Lens', 10],
  ]),
  recipe('Death_Sickle', 1, 'Mythril_Anvil', [
    ['Ectoplasm', 20],
    ['Soul_of_Fright', 10],
  ]),

  // -------------------------------------------------------------- pociones de hardmode
  recipe('Super_Healing_Potion', 1, 'Alchemy_Table', [
    ['Greater_Healing_Potion', 2],
    ['Crystal_Shard', 1],
  ]),
  recipe('Lifeforce_Potion', 1, 'Alchemy_Table', [
    ['Greater_Healing_Potion', 1],
    ['Moonglow', 2],
    ['Pixie_Dust', 1],
  ]),

  // -------------------------------------------------------------- magia
  recipe('Amethyst_Staff', 1, 'Iron_Anvil', [
    ['Amethyst', 10],
    ['Wood', 10],
  ]),
  recipe('Topaz_Staff', 1, 'Iron_Anvil', [
    ['Topaz', 10],
    ['Wood', 10],
  ]),
  recipe('Sapphire_Staff', 1, 'Iron_Anvil', [
    ['Sapphire', 10],
    ['Wood', 10],
  ]),
  recipe('Emerald_Staff', 1, 'Iron_Anvil', [
    ['Emerald', 10],
    ['Wood', 10],
  ]),
  recipe('Ruby_Staff', 1, 'Iron_Anvil', [
    ['Ruby', 10],
    ['Wood', 10],
  ]),
  recipe('Diamond_Staff', 1, 'Iron_Anvil', [
    ['Diamond', 10],
    ['Wood', 10],
  ]),
  recipe('Aqua_Scepter', 1, 'Iron_Anvil', [
    ['Coral', 15],
    ['Sapphire', 5],
    ['Silver_Bar', 8],
  ]),
  recipe('Magic_Missile', 1, 'Iron_Anvil', [
    ['Fallen_Star', 10],
    ['Gold_Bar', 8],
    ['Emerald', 5],
  ]),
  recipe('Bee_Gun', 1, 'Iron_Anvil', [
    ['Bee_Wax', 12],
    ['Stinger', 10],
    ['Jungle_Spores', 10],
  ]),
  recipe('Flower_of_Fire', 1, 'Hellforge', [
    ['Hellstone_Bar', 10],
    ['Fireblossom', 4],
  ]),
  recipe('Demon_Scythe', 1, 'Hellforge', [
    ['Hellstone_Bar', 15],
    ['Obsidian', 20],
    ['Fallen_Star', 15],
  ]),
  recipe('Band_of_Starpower', 1, 'Iron_Anvil', [
    ['Fallen_Star', 8],
    ['Gold_Bar', 4],
  ]),
  recipe('Celestial_Magnet', 1, 'Iron_Anvil', [
    ['Fallen_Star', 15],
    ['Silver_Bar', 10],
  ]),
  recipe('Mana_Flower', 1, "Tinkerer's_Workshop", [
    ['Band_of_Starpower', 1],
    ['Lesser_Mana_Potion', 5],
    ['Jungle_Rose', 1],
  ]),
  recipe('Lesser_Mana_Potion', 2, 'Alchemy_Table', [
    ['Fallen_Star', 1],
    ['Bottled_Water', 1],
  ]),
  recipe('Mana_Potion', 1, 'Alchemy_Table', [
    ['Lesser_Mana_Potion', 2],
    ['Moonglow', 1],
  ]),
  recipe('Magic_Mirror', 1, "Tinkerer's_Workshop", [
    ['Glass', 10],
    ['Silver_Bar', 8],
  ]),

  // -------------------------------------------------------------- metales alternativos
  recipe('Tin_Bar', 1, 'Furnace', [['Tin_Ore', 3]]),
  recipe('Lead_Bar', 1, 'Furnace', [['Lead_Ore', 3]]),
  recipe('Tungsten_Bar', 1, 'Furnace', [['Tungsten_Ore', 4]]),
  recipe('Platinum_Bar', 1, 'Furnace', [['Platinum_Ore', 4]]),
  recipe('Lead_Anvil', 1, 'Work_Bench', [['Lead_Bar', 5]]),

  recipe('Tin_Pickaxe', 1, 'Iron_Anvil', [
    ['Tin_Bar', 12],
    ['Wood', 3],
  ]),
  recipe('Lead_Pickaxe', 1, 'Iron_Anvil', [
    ['Lead_Bar', 12],
    ['Wood', 3],
  ]),
  recipe('Tungsten_Pickaxe', 1, 'Iron_Anvil', [
    ['Tungsten_Bar', 12],
    ['Wood', 3],
  ]),
  recipe('Platinum_Pickaxe', 1, 'Iron_Anvil', [
    ['Platinum_Bar', 12],
    ['Wood', 4],
  ]),
  recipe('Tin_Axe', 1, 'Iron_Anvil', [
    ['Tin_Bar', 9],
    ['Wood', 3],
  ]),
  recipe('Lead_Axe', 1, 'Iron_Anvil', [
    ['Lead_Bar', 9],
    ['Wood', 3],
  ]),
  recipe('Tungsten_Axe', 1, 'Iron_Anvil', [
    ['Tungsten_Bar', 9],
    ['Wood', 3],
  ]),
  recipe('Platinum_Axe', 1, 'Iron_Anvil', [
    ['Platinum_Bar', 9],
    ['Wood', 3],
  ]),
  recipe('Tin_Broadsword', 1, 'Iron_Anvil', [['Tin_Bar', 8]]),
  recipe('Lead_Broadsword', 1, 'Iron_Anvil', [['Lead_Bar', 8]]),
  recipe('Tungsten_Broadsword', 1, 'Iron_Anvil', [['Tungsten_Bar', 8]]),
  recipe('Platinum_Broadsword', 1, 'Iron_Anvil', [['Platinum_Bar', 8]]),
  recipe('Tin_Shortsword', 1, 'Iron_Anvil', [['Tin_Bar', 7]]),
  recipe('Tin_Helmet', 1, 'Iron_Anvil', [['Tin_Bar', 15]]),
  recipe('Tin_Chainmail', 1, 'Iron_Anvil', [['Tin_Bar', 25]]),
  recipe('Tin_Greaves', 1, 'Iron_Anvil', [['Tin_Bar', 20]]),
  recipe('Lead_Helmet', 1, 'Iron_Anvil', [['Lead_Bar', 15]]),
  recipe('Lead_Chainmail', 1, 'Iron_Anvil', [['Lead_Bar', 25]]),
  recipe('Lead_Greaves', 1, 'Iron_Anvil', [['Lead_Bar', 20]]),
  recipe('Tungsten_Helmet', 1, 'Iron_Anvil', [['Tungsten_Bar', 15]]),
  recipe('Tungsten_Chainmail', 1, 'Iron_Anvil', [['Tungsten_Bar', 25]]),
  recipe('Tungsten_Greaves', 1, 'Iron_Anvil', [['Tungsten_Bar', 20]]),
  recipe('Platinum_Helmet', 1, 'Iron_Anvil', [['Platinum_Bar', 15]]),
  recipe('Platinum_Chainmail', 1, 'Iron_Anvil', [['Platinum_Bar', 25]]),
  recipe('Platinum_Greaves', 1, 'Iron_Anvil', [['Platinum_Bar', 20]]),

  // -------------------------------------------------------------- oceano
  recipe('Bowl_of_Soup', 1, 'Cooking_Pot', [
    ['Starfish', 2],
    ['Bottled_Water', 1],
  ]),
  recipe('Glass', 2, 'Furnace', [['Seashell', 2]]),

  // -------------------------------------------------------------- utilidades
  recipe("Tinkerer's_Workshop", 1, 'Work_Bench', [
    ['Iron_Bar', 15],
    ['Wood', 15],
  ]),
  recipe('Mana_Crystal', 1, 'Work_Bench', [['Fallen_Star', 3]]),
  recipe('Purification_Powder', 5, 'Alchemy_Table', [['Daybloom', 1]]),

  // -------------------------------------------------------------- desierto y nieve
  recipe('Glass', 2, 'Furnace', [['Hardened_Sand_Block', 3]]),
  recipe('Bowl_of_Soup', 1, 'Cooking_Pot', [
    ['Mushroom', 3],
    ['Bottled_Water', 1],
  ]),
  recipe('Cooking_Pot', 1, 'Work_Bench', [['Iron_Bar', 10]]),
  recipe('Keg', 1, 'Work_Bench', [
    ['Wood', 15],
    ['Iron_Bar', 4],
  ]),
  recipe('Bookcase', 1, 'Sawmill', [
    ['Wood', 20],
    ['Silk', 10],
  ]),

  // -------------------------------------------------------------- hachas nuevas
  recipe('Silver_Axe', 1, 'Iron_Anvil', [
    ['Silver_Bar', 9],
    ['Wood', 3],
  ]),
  recipe('Gold_Axe', 1, 'Iron_Anvil', [
    ['Gold_Bar', 9],
    ['Wood', 3],
  ]),
  recipe('War_Axe_of_the_Night', 1, 'Iron_Anvil', [
    ['Demonite_Bar', 10],
    ['Shadow_Scale', 4],
  ]),

  // -------------------------------------------------------------- armadura de plata
  recipe('Silver_Helmet', 1, 'Iron_Anvil', [['Silver_Bar', 15]]),
  recipe('Silver_Chainmail', 1, 'Iron_Anvil', [['Silver_Bar', 25]]),
  recipe('Silver_Greaves', 1, 'Iron_Anvil', [['Silver_Bar', 20]]),

  // -------------------------------------------------------------- corrupcion
  recipe("Ball_O'_Hurt", 1, 'Iron_Anvil', [
    ['Demonite_Bar', 6],
    ['Rotten_Chunk', 10],
  ]),
  recipe('Vilethorn', 1, 'Iron_Anvil', [
    ['Demonite_Bar', 8],
    ['Vile_Mushroom', 15],
  ]),

  // -------------------------------------------------------------- jungla
  recipe('Blade_of_Grass', 1, 'Iron_Anvil', [
    ['Jungle_Spores', 12],
    ['Stinger', 6],
    ['Vine', 3],
  ]),
  recipe('Thorn_Chakram', 1, 'Iron_Anvil', [
    ['Jungle_Spores', 8],
    ['Stinger', 10],
    ['Vine', 4],
  ]),
  recipe('Jungle_Hat', 1, 'Iron_Anvil', [
    ['Jungle_Spores', 12],
    ['Stinger', 8],
    ['Vine', 4],
  ]),
  recipe('Jungle_Shirt', 1, 'Iron_Anvil', [
    ['Jungle_Spores', 16],
    ['Stinger', 12],
    ['Vine', 6],
  ]),
  recipe('Jungle_Pants', 1, 'Iron_Anvil', [
    ['Jungle_Spores', 14],
    ['Stinger', 10],
    ['Vine', 5],
  ]),
  recipe('Anklet_of_the_Wind', 1, 'Iron_Anvil', [
    ['Vine', 6],
    ['Jungle_Spores', 5],
  ]),
  recipe('Abeemination', 1, 'Demon_Altar', [
    ['Honey_Block', 12],
    ['Stinger', 8],
    ['Bee_Wax', 3],
    ['Jungle_Rose', 1],
  ]),
  recipe('Honeyfin', 2, 'Cooking_Pot', [
    ['Honey_Block', 4],
    ['Mushroom', 2],
  ]),

  // -------------------------------------------------------------- meteorito
  recipe('Meteorite_Bar', 1, 'Furnace', [['Meteorite', 3]]),
  recipe('Meteor_Helmet', 1, 'Iron_Anvil', [['Meteorite_Bar', 20]]),
  recipe('Meteor_Suit', 1, 'Iron_Anvil', [['Meteorite_Bar', 25]]),
  recipe('Meteor_Leggings', 1, 'Iron_Anvil', [['Meteorite_Bar', 22]]),
  recipe('Space_Gun', 1, 'Iron_Anvil', [
    ['Meteorite_Bar', 20],
    ['Fallen_Star', 5],
  ]),
  recipe('Meteor_Hamaxe', 1, 'Iron_Anvil', [['Meteorite_Bar', 18]]),
  recipe('Starfury', 1, 'Iron_Anvil', [
    ['Meteorite_Bar', 15],
    ['Fallen_Star', 20],
  ]),

  // -------------------------------------------------------------- mazmorra
  recipe('Necro_Helmet', 1, 'Iron_Anvil', [
    ['Bone', 45],
    ['Cobweb', 25],
  ]),
  recipe('Necro_Breastplate', 1, 'Iron_Anvil', [
    ['Bone', 60],
    ['Cobweb', 35],
  ]),
  recipe('Necro_Greaves', 1, 'Iron_Anvil', [
    ['Bone', 50],
    ['Cobweb', 30],
  ]),
  recipe('Clothier_Voodoo_Doll', 1, 'Demon_Altar', [
    ['Silk', 20],
    ['Bone', 25],
    ['Golden_Key', 3],
  ]),

  // -------------------------------------------------------------- filo nocturno
  recipe("Night's_Edge", 1, 'Demon_Altar', [
    ["Light's_Bane", 1],
    ['Muramasa', 1],
    ['Blade_of_Grass', 1],
    ['Fiery_Greatsword', 1],
  ]),

  // -------------------------------------------------------------- infierno
  recipe('Hellstone_Bar', 1, 'Hellforge', [
    ['Hellstone', 3],
    ['Obsidian', 1],
  ]),
  recipe('Molten_Pickaxe', 1, 'Iron_Anvil', [['Hellstone_Bar', 18]]),
  recipe('Fiery_Greatsword', 1, 'Iron_Anvil', [['Hellstone_Bar', 20]]),
  recipe('Sunfury', 1, 'Iron_Anvil', [
    ['Hellstone_Bar', 22],
    ['Fireblossom', 5],
  ]),
  recipe('Flamarang', 1, 'Iron_Anvil', [
    ['Hellstone_Bar', 12],
    ['Fireblossom', 3],
  ]),
  recipe('Molten_Helmet', 1, 'Iron_Anvil', [['Hellstone_Bar', 20]]),
  recipe('Molten_Breastplate', 1, 'Iron_Anvil', [['Hellstone_Bar', 25]]),
  recipe('Molten_Greaves', 1, 'Iron_Anvil', [['Hellstone_Bar', 22]]),
  recipe('Obsidian_Skull', 1, 'Iron_Anvil', [['Obsidian', 20]]),

  // -------------------------------------------------------------- pociones
  recipe('Greater_Healing_Potion', 1, 'Alchemy_Table', [
    ['Healing_Potion', 2],
    ['Fireblossom', 1],
  ]),
  // -------------------------------------------------------------- a mano
  recipe('Work_Bench', 1, null, [['Wood', 10]]),
  recipe('Torch', 3, null, [
    ['Wood', 1],
    ['Gel', 1],
  ]),

  // -------------------------------------------------------------- mesa de trabajo
  recipe('Furnace', 1, 'Work_Bench', [
    ['Stone_Block', 20],
    ['Wood', 4],
    ['Torch', 3],
  ]),
  recipe('Loom', 1, 'Work_Bench', [['Wood', 12]]),
  recipe('Sawmill', 1, 'Work_Bench', [
    ['Wood', 10],
    ['Iron_Bar', 2],
  ]),
  recipe('Alchemy_Table', 1, 'Work_Bench', [
    ['Wood', 8],
    ['Glass', 4],
  ]),
  recipe('Chest', 1, 'Work_Bench', [
    ['Wood', 8],
    ['Iron_Bar', 2],
  ]),
  recipe('Balloon_Work_Bench', 1, 'Work_Bench', [
    ['Wood', 10],
    ['Gel', 20],
    ['Silk', 5],
  ]),
  recipe('Wooden_Sword', 1, 'Work_Bench', [['Wood', 7]]),
  recipe('Wooden_Bow', 1, 'Work_Bench', [['Wood', 10]]),
  recipe('Iron_Anvil', 1, 'Work_Bench', [['Iron_Bar', 5]]),
  recipe('Bottled_Water', 1, 'Work_Bench', [['Glass', 1]]),
  recipe('Suspicious_Looking_Eye', 1, 'Demon_Altar', [['Lens', 6]]),

  // -------------------------------------------------------------- horno
  recipe('Copper_Bar', 1, 'Furnace', [['Copper_Ore', 3]]),
  recipe('Iron_Bar', 1, 'Furnace', [['Iron_Ore', 3]]),
  recipe('Silver_Bar', 1, 'Furnace', [['Silver_Ore', 4]]),
  recipe('Gold_Bar', 1, 'Furnace', [['Gold_Ore', 4]]),
  recipe('Demonite_Bar', 1, 'Furnace', [['Demonite_Ore', 3]]),
  recipe('Glass', 1, 'Furnace', [['Sand_Block', 2]]),

  // -------------------------------------------------------------- telar
  recipe('Silk', 1, 'Loom', [['Cobweb', 7]]),

  // -------------------------------------------------------------- yunque: picos y hachas
  recipe('Iron_Pickaxe', 1, 'Iron_Anvil', [
    ['Iron_Bar', 12],
    ['Wood', 3],
  ]),
  recipe('Silver_Pickaxe', 1, 'Iron_Anvil', [
    ['Silver_Bar', 12],
    ['Wood', 3],
  ]),
  recipe('Gold_Pickaxe', 1, 'Iron_Anvil', [
    ['Gold_Bar', 12],
    ['Wood', 4],
  ]),
  recipe('Nightmare_Pickaxe', 1, 'Iron_Anvil', [
    ['Demonite_Bar', 12],
    ['Shadow_Scale', 6],
  ]),
  recipe('Iron_Axe', 1, 'Iron_Anvil', [
    ['Iron_Bar', 9],
    ['Wood', 3],
  ]),
  recipe('Iron_Hammer', 1, 'Iron_Anvil', [
    ['Iron_Bar', 10],
    ['Wood', 3],
  ]),

  // -------------------------------------------------------------- yunque: armas
  recipe('Copper_Broadsword', 1, 'Iron_Anvil', [['Copper_Bar', 8]]),
  recipe('Iron_Broadsword', 1, 'Iron_Anvil', [['Iron_Bar', 8]]),
  recipe('Silver_Broadsword', 1, 'Iron_Anvil', [['Silver_Bar', 8]]),
  recipe('Gold_Broadsword', 1, 'Iron_Anvil', [['Gold_Bar', 8]]),
  recipe("Light's_Bane", 1, 'Iron_Anvil', [['Demonite_Bar', 10]]),

  // -------------------------------------------------------------- yunque: armaduras
  recipe('Copper_Helmet', 1, 'Iron_Anvil', [['Copper_Bar', 15]]),
  recipe('Copper_Chainmail', 1, 'Iron_Anvil', [['Copper_Bar', 25]]),
  recipe('Copper_Greaves', 1, 'Iron_Anvil', [['Copper_Bar', 20]]),
  recipe('Iron_Helmet', 1, 'Iron_Anvil', [['Iron_Bar', 15]]),
  recipe('Iron_Chainmail', 1, 'Iron_Anvil', [['Iron_Bar', 25]]),
  recipe('Iron_Greaves', 1, 'Iron_Anvil', [['Iron_Bar', 20]]),
  recipe('Gold_Helmet', 1, 'Iron_Anvil', [['Gold_Bar', 15]]),
  recipe('Gold_Chainmail', 1, 'Iron_Anvil', [['Gold_Bar', 25]]),
  recipe('Gold_Greaves', 1, 'Iron_Anvil', [['Gold_Bar', 20]]),
  recipe('Shadow_Helmet', 1, 'Iron_Anvil', [
    ['Demonite_Bar', 10],
    ['Shadow_Scale', 15],
  ]),
  recipe('Shadow_Scalemail', 1, 'Iron_Anvil', [
    ['Demonite_Bar', 15],
    ['Shadow_Scale', 20],
  ]),
  recipe('Shadow_Greaves', 1, 'Iron_Anvil', [
    ['Demonite_Bar', 12],
    ['Shadow_Scale', 18],
  ]),

  // -------------------------------------------------------------- yunque: invocaciones
  recipe('Slime_Crown', 1, 'Demon_Altar', [
    ['Gold_Bar', 5],
    ['Gel', 99],
  ]),
  recipe('Aglet', 1, 'Iron_Anvil', [
    ['Iron_Bar', 6],
    ['Silk', 2],
  ]),

  // -------------------------------------------------------------- polvora y estrellas
  recipe('Star_Cannon', 1, 'Iron_Anvil', [
    ['Minishark', 1],
    ['Fallen_Star', 20],
    ['Meteorite_Bar', 10],
  ]),

  // -------------------------------------------------------------- alquimia
  recipe('Vile_Powder', 5, 'Alchemy_Table', [['Vile_Mushroom', 1]]),
  recipe('Lesser_Healing_Potion', 2, 'Alchemy_Table', [
    ['Mushroom', 2],
    ['Bottled_Water', 1],
  ]),
  recipe('Healing_Potion', 1, 'Alchemy_Table', [
    ['Lesser_Healing_Potion', 2],
    ['Daybloom', 1],
  ]),
  recipe('Ale', 2, 'Alchemy_Table', [
    ['Bottled_Water', 1],
    ['Mushroom', 1],
  ]),
  recipe('Worm_Food', 1, 'Demon_Altar', [
    ['Vile_Powder', 30],
    ['Rotten_Chunk', 15],
  ]),
];
