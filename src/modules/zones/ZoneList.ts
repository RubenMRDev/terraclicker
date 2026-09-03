import type { StationId } from '../crafting/RecipeList';
import type { Requirement } from '../requirements/Requirement';

export interface ZoneDef {
  id: string;
  name: string;
  description: string;
  /** Sprite representativo de la zona en el selector. */
  icon: string;
  /** Fondo de bioma sacado de la wiki, en public/assets/backgrounds. */
  background: string;
  /** Tinte que se superpone al fondo para que el sprite del objetivo destaque. */
  palette: [string, string];
  /** Ids de NodeList que pueden aparecer. */
  nodes: string[];
  /** Ids de EnemyList que pueden aparecer. */
  enemies: string[];
  /** Proporcion de apariciones que son enemigos (0-1). */
  enemyRate: number;
  /** Jefes invocables desde esta zona. */
  bosses: string[];
  /**
   * Estaciones fijas del bioma: no se pican ni se llevan en la mochila, basta
   * con haber estado aqui. El altar demoniaco es el caso tipico.
   */
  stations?: StationId[];
  /** Requisitos para poder viajar aqui. */
  unlock: Requirement[];
  /**
   * Zona de evento: solo existe mientras su requisito se cumple, y fuera de ahi
   * ni siquiera aparece bloqueada en el selector. Son los pilares celestiales.
   */
  event?: boolean;
  /** Bichos que hay que matar aqui para poder romper el pilar. */
  pillarId?: string;
}

/**
 * Las zonas se desbloquean por hitos de equipo, no por cantidad farmeada: cada
 * una pide la herramienta, la estacion o el jefe que demuestra que ya puedes
 * sacarle partido a lo que hay dentro.
 *
 * La fauna y los materiales van por bioma, sin mezclas: las hormigas leon son
 * del desierto, los devoraplantas de la jungla y las medusas del oceano.
 */
export const ZoneList: ZoneDef[] = [
  {
    id: 'forest',
    name: 'Bosque',
    description:
      'Donde empieza toda partida de Terraria. Tierra, piedra a flor de suelo, arboles y slimes.',
    icon: 'Acorn',
    background: 'Forest_background_18',
    palette: ['rgba(63,109,58,0.55)', 'rgba(29,58,38,0.75)'],
    nodes: ['dirt', 'stone', 'tree', 'mushroom_patch', 'daybloom_patch', 'fallen_star_node'],
    enemies: ['green_slime', 'blue_slime', 'demon_eye', 'zombie', 'goblin_scout'],
    enemyRate: 0.4,
    bosses: ['king_slime', 'eye_of_cthulhu'],
    unlock: [],
  },
  {
    id: 'desert',
    name: 'Desierto',
    description:
      'Dunas, cactus y hormigas leon enterradas en la arena. De aqui salen el ambar y la hoja de agua.',
    icon: 'Cactus',
    background: 'Desert_background_3DS',
    palette: ['rgba(201,165,92,0.35)', 'rgba(107,79,40,0.7)'],
    nodes: [
      'sand',
      'hardened_sand',
      'sandstone',
      'cactus_patch',
      'waterleaf_patch',
      'amber_vein',
      'silt',
      'fallen_star_node',
    ],
    enemies: ['vulture', 'antlion', 'sand_slime'],
    enemyRate: 0.35,
    bosses: [],
    unlock: [{ kind: 'itemGathered', itemId: 'Wood', amount: 25 }],
  },
  {
    id: 'ocean',
    name: 'Oceano',
    description:
      'La costa y sus arrecifes. Corales, conchas y bichos con demasiados tentaculos o demasiados dientes.',
    icon: 'Seashell',
    background: 'Ocean_background_1',
    palette: ['rgba(46,116,168,0.4)', 'rgba(12,38,72,0.75)'],
    nodes: ['sand', 'coral_reef', 'seashell_bed'],
    enemies: ['crab', 'squid', 'blue_jellyfish', 'green_jellyfish', 'pink_jellyfish', 'shark'],
    enemyRate: 0.55,
    bosses: [],
    unlock: [{ kind: 'itemGathered', itemId: 'Sand_Block', amount: 30 }],
  },
  {
    id: 'underground',
    name: 'Subsuelo',
    description:
      'Las primeras cuevas: tierra, piedra y los cuatro metales basicos. Con suerte encuentras un altar demoniaco.',
    icon: 'Copper_Ore',
    background: 'Underground_background_1',
    palette: ['rgba(90,68,51,0.45)', 'rgba(36,26,19,0.8)'],
    nodes: [
      'dirt',
      'stone',
      'copper_vein',
      'tin_vein',
      'iron_vein',
      'lead_vein',
      'cobweb',
      'blinkroot_patch',
      'gem_amethyst',
      'gem_topaz',
      'life_crystal_node',
    ],
    enemies: ['cave_bat', 'giant_worm', 'skeleton', 'undead_miner', 'mother_slime', 'yellow_slime'],
    enemyRate: 0.35,
    bosses: [],
    stations: ['Demon_Altar'],
    // El horno es lo que convierte el mineral en algo util: sin el, bajar no sirve.
    unlock: [{ kind: 'itemOwned', itemId: 'Furnace', amount: 1 }],
  },
  {
    id: 'caverns',
    name: 'Cavernas',
    description:
      'Mucho mas abajo. Casi nada de piedra suelta y en cambio plata, tungsteno, oro, platino y las gemas grandes.',
    icon: 'Gold_Ore',
    background: 'Cavern_background_4',
    palette: ['rgba(74,74,94,0.4)', 'rgba(22,22,31,0.82)'],
    nodes: [
      'stone',
      'silver_vein',
      'tungsten_vein',
      'gold_vein',
      'platinum_vein',
      'gem_sapphire',
      'gem_emerald',
      'gem_ruby',
      'gem_diamond',
      'life_crystal_node',
    ],
    enemies: ['skeleton', 'undead_miner', 'giant_bat', 'salamander', 'tim', 'mother_slime'],
    enemyRate: 0.4,
    bosses: [],
    stations: ['Demon_Altar'],
    unlock: [
      { kind: 'itemOwned', itemId: 'Iron_Anvil', amount: 1 },
      { kind: 'pickPower', amount: 40 },
    ],
  },
  {
    id: 'snow',
    name: 'Nieve',
    description:
      'Tundra helada. El aguanieve esconde plata y oro, y los vikingos no muertos no perdonan.',
    icon: 'Snow_Block',
    background: 'Map_Background_Ice',
    palette: ['rgba(169,198,222,0.3)', 'rgba(61,85,112,0.7)'],
    nodes: ['snow', 'ice', 'boreal_tree', 'shiverthorn_patch', 'slush', 'life_crystal_node'],
    enemies: ['ice_slime', 'zombie_eskimo', 'undead_viking', 'wolf', 'ice_bat', 'snow_flinx'],
    enemyRate: 0.4,
    bosses: [],
    unlock: [{ kind: 'bossDefeated', bossId: 'king_slime' }],
  },
  {
    id: 'jungle',
    name: 'Jungla',
    description:
      'Caoba, esporas y bichos que pican. De aqui sale la armadura de jungla y la Hoja de Hierba.',
    icon: 'Jungle_Spores',
    background: 'Jungle_background_7',
    palette: ['rgba(47,122,69,0.45)', 'rgba(15,44,28,0.8)'],
    nodes: [
      'mahogany_tree',
      'jungle_spore_patch',
      'vine_cluster',
      'moonglow_patch',
      'jungle_rose_patch',
      'mushroom_patch',
      'hive',
      'life_crystal_node',
    ],
    enemies: [
      'hornet',
      'man_eater',
      'jungle_slime',
      'spiked_jungle_slime',
      'piranha',
      'snatcher',
      'doctor_bones',
      'purple_slime',
    ],
    enemyRate: 0.45,
    bosses: ['queen_bee'],
    unlock: [{ kind: 'itemDiscovered', itemId: 'Silver_Broadsword' }],
  },
  {
    id: 'corruption',
    name: 'Corrupcion',
    description:
      'Ebonita, demonita y cosas que reptan. Los altares de aqui son los mas faciles de encontrar.',
    icon: 'Demonite_Ore',
    background: 'Corruption_background_1',
    palette: ['rgba(75,58,99,0.45)', 'rgba(21,15,32,0.82)'],
    nodes: [
      'ebonstone',
      'demonite_vein',
      'vile_mushroom_patch',
      'ebonwood_tree',
      'deathweed_patch',
    ],
    enemies: ['eater_of_souls', 'devourer', 'corrupt_slime'],
    enemyRate: 0.55,
    bosses: ['eater_of_worlds'],
    stations: ['Demon_Altar'],
    // El hito que pidio el jugador: sin mandoble de oro, la Corrupcion te come.
    unlock: [
      { kind: 'itemDiscovered', itemId: 'Gold_Broadsword' },
      { kind: 'pickPower', amount: 55 },
    ],
  },
  {
    id: 'meteorite',
    name: 'Meteorito',
    description:
      'El crater que cayo tras derrotar al Ojo. Metal del cielo y cabezas que te persiguen.',
    icon: 'Meteorite',
    background: 'Map_Background_Space',
    palette: ['rgba(107,74,107,0.4)', 'rgba(36,20,40,0.8)'],
    nodes: ['meteorite_vein', 'ash_from_impact', 'stone', 'mana_crystal_node'],
    enemies: ['meteor_head'],
    enemyRate: 0.4,
    bosses: [],
    unlock: [
      { kind: 'bossDefeated', bossId: 'eye_of_cthulhu' },
      { kind: 'pickPower', amount: 50 },
    ],
  },
  {
    id: 'dungeon',
    name: 'Mazmorra',
    description:
      'Pasillos de ladrillo azul llenos de huesos con ganas. Despues de Golem, aqui se reunen los cultistas.',
    icon: 'Blue_Brick',
    background: 'Map_Background_Dungeon',
    palette: ['rgba(58,74,122,0.4)', 'rgba(17,24,48,0.82)'],
    nodes: ['blue_brick', 'bone_block', 'life_crystal_node'],
    enemies: [
      'angry_bones',
      'dark_caster',
      'cursed_skull',
      'dungeon_slime',
      'blue_armored_bones',
      'diabolist',
      'rune_wizard',
    ],
    enemyRate: 0.6,
    bosses: ['skeletron', 'skeletron_prime'],
    unlock: [
      { kind: 'bossDefeated', bossId: 'eye_of_cthulhu' },
      { kind: 'pickPower', amount: 50 },
    ],
  },
  {
    id: 'underworld',
    name: 'Infierno',
    description:
      'Ceniza, lava y piedra infernal. El ultimo escalon antes del Hardmode: aqui vive el Muro de Carne.',
    icon: 'Hellstone',
    background: 'Underworld_background_1',
    palette: ['rgba(140,47,31,0.42)', 'rgba(42,12,8,0.8)'],
    nodes: [
      'hellstone_vein',
      'obsidian_chunk',
      'ash',
      'fireblossom_patch',
      'hellforge_ruin',
      'life_crystal_node',
    ],
    enemies: ['fire_imp', 'lava_slime', 'demon', 'hellbat', 'bone_serpent', 'voodoo_demon'],
    enemyRate: 0.55,
    bosses: ['wall_of_flesh'],
    unlock: [
      { kind: 'itemDiscovered', itemId: 'Nightmare_Pickaxe' },
      { kind: 'bossDefeated', bossId: 'eater_of_worlds' },
    ],
  },
  {
    id: 'hallow',
    name: 'Sagrado',
    description:
      'El bioma que nace al romper el Muro de Carne. Todo brilla, todo intenta matarte, y aqui aparecen el cobalto y el paladio.',
    icon: 'Crystal_Shard',
    background: 'Hallow_background_1',
    palette: ['rgba(214,158,222,0.32)', 'rgba(70,44,110,0.72)'],
    nodes: ['pearlstone', 'crystal_shard_node', 'cobalt_vein', 'palladium_vein', 'life_crystal_node'],
    enemies: [
      'pixie',
      'unicorn',
      'gastropod',
      'illuminant_bat',
      'chaos_elemental',
      'enchanted_sword',
      'wyvern',
    ],
    enemyRate: 0.5,
    bosses: ['the_twins'],
    stations: ['Demon_Altar'],
    unlock: [{ kind: 'bossDefeated', bossId: 'wall_of_flesh' }],
  },
  {
    id: 'corruption_deep',
    name: 'Corrupcion profunda',
    description:
      'La Corrupcion se extendio con el Hardmode. Mitrilo, oricalco y almas de noche, con cosas peores esperando.',
    icon: 'Mythril_Ore',
    background: 'Corruption_background_1',
    palette: ['rgba(75,58,99,0.5)', 'rgba(14,10,22,0.86)'],
    nodes: ['mythril_vein', 'orichalcum_vein', 'ebonstone', 'demonite_vein', 'life_crystal_node'],
    enemies: [
      'corruptor',
      'clinger',
      'slimer',
      'armored_skeleton',
      'possessed_armor',
      'mimic',
      'werewolf',
    ],
    enemyRate: 0.55,
    bosses: ['the_destroyer'],
    stations: ['Demon_Altar'],
    unlock: [
      { kind: 'bossDefeated', bossId: 'wall_of_flesh' },
      { kind: 'pickPower', amount: 110 },
    ],
  },
  {
    id: 'jungle_deep',
    name: 'Selva profunda',
    description:
      'Bajo la jungla se esconden la adamantita, el titanio y la clorofita. Y Plantera, que no quiere visitas.',
    icon: 'Chlorophyte_Ore',
    background: 'Map_Background_Underground_Jungle',
    palette: ['rgba(47,122,69,0.4)', 'rgba(10,32,20,0.86)'],
    nodes: [
      'adamantite_vein',
      'titanium_vein',
      'chlorophyte_vein',
      'jungle_spore_patch',
      'mahogany_tree',
      'life_crystal_node',
      'life_fruit_node',
    ],
    enemies: ['arapaima', 'giant_tortoise', 'moss_hornet', 'angler_fish', 'moss_hornet'],
    enemyRate: 0.45,
    bosses: ['plantera'],
    unlock: [
      { kind: 'bossDefeated', bossId: 'wall_of_flesh' },
      { kind: 'pickPower', amount: 150 },
    ],
  },
  {
    id: 'temple',
    name: 'Templo Lihzahrd',
    description:
      'Se abre con la llave que suelta Plantera. Ladrillo que solo cede ante la sierra de Golem.',
    icon: 'Lihzahrd_Brick',
    background: 'Map_Background_Dungeon',
    palette: ['rgba(150,86,40,0.38)', 'rgba(40,18,10,0.86)'],
    nodes: ['lihzahrd_brick_node'],
    enemies: ['lihzahrd', 'flying_snake'],
    enemyRate: 0.65,
    bosses: ['golem'],
    unlock: [
      { kind: 'bossDefeated', bossId: 'plantera' },
      { kind: 'itemDiscovered', itemId: 'Temple_Key' },
    ],
  },
  {
    id: 'moon',
    name: 'Luna',
    description:
      'Lo que queda cuando el Senor de la Luna cae. Luminita, los cuatro fragmentos y nada que te de miedo.',
    icon: 'Luminite',
    background: 'Map_Background_Space',
    palette: ['rgba(60,40,120,0.42)', 'rgba(6,4,18,0.9)'],
    nodes: [
      'luminite_vein',
      'solar_fragment_node',
      'vortex_fragment_node',
      'nebula_fragment_node',
      'stardust_fragment_node',
    ],
    enemies: ['selenian', 'nebula_floater'],
    enemyRate: 0.4,
    bosses: ['moon_lord'],
    stations: ['Ancient_Manipulator'],
    // Ya no se "llega" a la Luna: se abre despues de matar al Senor de la Luna,
    // y a el se llega por el evento lunar (Cultista -> pilares -> cuenta atras).
    unlock: [{ kind: 'bossDefeated', bossId: 'moon_lord' }],
  },

  // ================================================================ PILARES
  // Cuatro zonas temporales, abiertas solo mientras el evento esta en la etapa
  // de los pilares. No tienen nodos a proposito: aqui solo se cuenta bichos,
  // asi que todo lo que aparece suma para el escudo.
  {
    id: 'pillar_solar',
    name: 'Pilar Solar',
    description:
      'Una columna de fuego clavada en el mundo. Mil bichos y el escudo cae.',
    icon: 'Solar_Fragment',
    background: 'Underworld_background_2',
    palette: ['rgba(190,70,30,0.45)', 'rgba(52,10,6,0.85)'],
    nodes: [],
    enemies: ['drakomire', 'corite', 'sroller', 'crawltipede', 'selenian'],
    enemyRate: 1,
    bosses: ['solar_pillar'],
    event: true,
    pillarId: 'solar',
    unlock: [{ kind: 'lunarStage', stage: 'pillars' }],
  },
  {
    id: 'pillar_vortex',
    name: 'Pilar del Vortice',
    description: 'Un ojo de tormenta que no se mueve. Mil bichos y el escudo cae.',
    icon: 'Vortex_Fragment',
    background: 'Map_Background_Space',
    palette: ['rgba(40,150,120,0.4)', 'rgba(4,30,28,0.88)'],
    nodes: [],
    enemies: ['storm_diver', 'vortexian', 'alien_queen'],
    enemyRate: 1,
    bosses: ['vortex_pillar'],
    event: true,
    pillarId: 'vortex',
    unlock: [{ kind: 'lunarStage', stage: 'pillars' }],
  },
  {
    id: 'pillar_nebula',
    name: 'Pilar de la Nebulosa',
    description: 'Colores que no existen, en forma de columna. Mil bichos y el escudo cae.',
    icon: 'Nebula_Fragment',
    background: 'Map_Background_Space',
    palette: ['rgba(170,50,150,0.42)', 'rgba(30,4,34,0.88)'],
    nodes: [],
    enemies: ['nebula_floater_lunar', 'brain_suckler', 'predictor', 'evolution_beast'],
    enemyRate: 1,
    bosses: ['nebula_pillar'],
    event: true,
    pillarId: 'nebula',
    unlock: [{ kind: 'lunarStage', stage: 'pillars' }],
  },
  {
    id: 'pillar_stardust',
    name: 'Pilar del Polvo Estelar',
    description: 'Hecho de la misma cosa que las estrellas. Mil bichos y el escudo cae.',
    icon: 'Stardust_Fragment',
    background: 'Map_Background_Space',
    palette: ['rgba(60,110,200,0.4)', 'rgba(6,14,44,0.9)'],
    nodes: [],
    enemies: ['star_cell', 'flow_invader', 'twinkle_popper', 'milkyway_weaver', 'stargazer'],
    enemyRate: 1,
    bosses: ['stardust_pillar'],
    event: true,
    pillarId: 'stardust',
    unlock: [{ kind: 'lunarStage', stage: 'pillars' }],
  },
];

export const getZone = (id: string): ZoneDef => {
  const zone = ZoneList.find((z) => z.id === id);
  if (!zone) throw new Error(`Zona desconocida: ${id}`);
  return zone;
};

export const FIRST_ZONE_ID = ZoneList[0].id;
