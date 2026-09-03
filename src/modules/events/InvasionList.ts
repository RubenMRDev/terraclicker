import type { DropDef, ItemId } from '../items/ItemType';
import type { Requirement } from '../requirements/Requirement';

/**
 * Una oleada de una invasion. El multiplicador de vida es lo que hace que la
 * cuarta oleada no sea la primera repetida: los mismos bichos, mas duros.
 */
export interface WaveDef {
  /** Ids de EnemyList que aparecen en esta oleada. */
  enemies: string[];
  /** Bichos que hay que matar para pasar a la siguiente. */
  kills: number;
  /** Multiplicador de vida sobre la ficha del bicho. */
  healthMultiplier: number;
}

export interface InvasionDef {
  id: string;
  name: string;
  sprite: string;
  description: string;
  /** Requisitos para que el evento este disponible. */
  unlock: Requirement[];
  /**
   * Objeto que lo lanza. La primera vez sale gratis (la invasion "pasa"), y
   * para repetirla hace falta el objeto, igual que en Terraria.
   */
  triggerItem: ItemId;
  waves: WaveDef[];
  /** Jefe que la cierra, si tiene. Se pelea despues de la ultima oleada. */
  finalBoss?: string;
  /** Botin garantizado al completarla. */
  rewards: DropDef[];
  coins: [min: number, max: number];
}

/**
 * Las cinco invasiones. Mientras una esta activa sustituye la fauna de la zona
 * en la que estes: el mundo entero esta invadido, no hace falta viajar.
 *
 * Están ordenadas por el momento de la partida en el que se abren, que es el
 * orden en el que se pintan.
 */
export const InvasionList: InvasionDef[] = [
  {
    id: 'goblin_army',
    name: 'Ejercito de duendes',
    sprite: 'Goblin_Warrior',
    description:
      'La primera invasion de cualquier partida. Trae tela andrajosa y, si aguantas al invocador, sus armas de llama sombria.',
    unlock: [{ kind: 'bossDefeated', bossId: 'eye_of_cthulhu' }],
    triggerItem: 'Goblin_Battle_Standard',
    waves: [
      {
        enemies: ['goblin_peon', 'goblin_thief', 'goblin_archer'],
        kills: 40,
        healthMultiplier: 1,
      },
      {
        enemies: ['goblin_peon', 'goblin_warrior', 'goblin_archer', 'goblin_sorcerer'],
        kills: 60,
        healthMultiplier: 1.4,
      },
      {
        enemies: ['goblin_warrior', 'goblin_sorcerer', 'goblin_archer', 'goblin_summoner'],
        kills: 80,
        healthMultiplier: 1.8,
      },
    ],
    rewards: [
      { itemId: 'Tattered_Cloth', min: 12, max: 20, chance: 1 },
      { itemId: 'Goblin_Battle_Standard', min: 1, max: 1, chance: 1 },
      { itemId: 'Shadowflame_Bow', min: 1, max: 1, chance: 0.35, affectedByLuck: true },
    ],
    coins: [30_000, 60_000],
  },

  {
    id: 'frost_legion',
    name: 'Legion de escarcha',
    sprite: 'Snowman_Gangsta',
    description:
      'Tres muñecos de nieve con muy malas intenciones. Es el evento de Navidad corto: rapido y rentable.',
    unlock: [{ kind: 'bossDefeated', bossId: 'wall_of_flesh' }],
    triggerItem: 'Snow_Globe',
    waves: [
      { enemies: ['mister_stabby', 'snow_balla'], kills: 50, healthMultiplier: 1 },
      {
        enemies: ['mister_stabby', 'snowman_gangsta', 'snow_balla'],
        kills: 70,
        healthMultiplier: 1.4,
      },
      {
        enemies: ['snowman_gangsta', 'snow_balla', 'mister_stabby'],
        kills: 90,
        healthMultiplier: 1.9,
      },
    ],
    rewards: [
      { itemId: 'Snow_Globe', min: 1, max: 1, chance: 1 },
      { itemId: 'Present', min: 10, max: 20, chance: 1 },
      { itemId: 'Snowball_Cannon', min: 1, max: 1, chance: 0.4, affectedByLuck: true },
    ],
    coins: [200_000, 400_000],
  },

  {
    id: 'solar_eclipse',
    name: 'Eclipse solar',
    sprite: 'Mothron',
    description:
      'El cielo se pone negro a mediodia y sale todo lo que no deberia existir. Es la unica fuente de espadas de heroe rotas, que es lo que gatea la Terra Blade.',
    unlock: [{ kind: 'bossDefeated', bossId: 'the_destroyer' }],
    triggerItem: 'Solar_Tablet',
    waves: [
      {
        enemies: ['swamp_thing', 'frankenstein', 'fritz', 'creature_from_the_deep'],
        kills: 60,
        healthMultiplier: 1,
      },
      {
        enemies: ['vampire', 'the_possessed', 'eyezor', 'nailhead', 'psycho'],
        kills: 80,
        healthMultiplier: 1.3,
      },
      {
        enemies: ['butcher', 'deadly_sphere', 'dr_man_fly', 'reaper'],
        kills: 100,
        healthMultiplier: 1.6,
      },
    ],
    finalBoss: 'mothron',
    rewards: [
      { itemId: 'Solar_Tablet_Fragment', min: 6, max: 10, chance: 1 },
      { itemId: 'Broken_Bat_Wing', min: 2, max: 5, chance: 0.7 },
    ],
    coins: [400_000, 800_000],
  },

  {
    id: 'frost_moon',
    name: 'Luna de escarcha',
    sprite: 'Ice_Queen',
    description:
      'La version larga de la Navidad: elfos, regalos con dientes, Krampus, el Grito eterno y Santa-NK1, y al final la Reina de Hielo. Todo suelta regalos, y cada regalo son monedas.',
    unlock: [{ kind: 'bossDefeated', bossId: 'plantera' }],
    triggerItem: 'Naughty_Present',
    waves: [
      { enemies: ['flocko', 'gingerbread_man', 'zombie_elf'], kills: 70, healthMultiplier: 1 },
      {
        enemies: ['zombie_elf', 'elf_archer', 'elf_copter', 'present_mimic'],
        kills: 90,
        healthMultiplier: 1.3,
      },
      {
        enemies: ['elf_copter', 'present_mimic', 'krampus', 'everscream'],
        kills: 110,
        healthMultiplier: 1.5,
      },
      {
        enemies: ['krampus', 'everscream', 'santa_nk1', 'present_mimic'],
        kills: 130,
        healthMultiplier: 1.8,
      },
    ],
    finalBoss: 'ice_queen',
    rewards: [
      { itemId: 'Naughty_Present', min: 1, max: 1, chance: 1 },
      { itemId: 'Present', min: 20, max: 40, chance: 1 },
      { itemId: 'Chain_Gun', min: 1, max: 1, chance: 0.3, affectedByLuck: true },
      { itemId: 'Elf_Melter', min: 1, max: 1, chance: 0.3, affectedByLuck: true },
    ],
    coins: [1_200_000, 2_400_000],
  },

  {
    id: 'martian_madness',
    name: 'Locura marciana',
    sprite: 'Martian_Saucer',
    description:
      'Una sonda te escanea y vuelve con toda la flota. El equipo marciano es lo mejor que hay antes de la luminita.',
    unlock: [{ kind: 'bossDefeated', bossId: 'golem' }],
    triggerItem: 'Martian_Probe',
    waves: [
      {
        enemies: ['martian_drone', 'scutlix_gunner', 'ray_gunner'],
        kills: 70,
        healthMultiplier: 1,
      },
      {
        enemies: ['ray_gunner', 'gigazapper', 'martian_engineer'],
        kills: 90,
        healthMultiplier: 1.3,
      },
      {
        enemies: ['gigazapper', 'martian_engineer', 'martian_officer'],
        kills: 110,
        healthMultiplier: 1.5,
      },
      {
        enemies: ['martian_officer', 'martian_walker', 'gigazapper'],
        kills: 130,
        healthMultiplier: 1.8,
      },
    ],
    finalBoss: 'martian_saucer',
    rewards: [
      { itemId: 'Martian_Conduit_Plating', min: 40, max: 80, chance: 1 },
      { itemId: 'Martian_Probe', min: 1, max: 1, chance: 1 },
      { itemId: 'Xenopopper', min: 1, max: 1, chance: 0.35, affectedByLuck: true },
      { itemId: 'Xeno_Staff', min: 1, max: 1, chance: 0.35, affectedByLuck: true },
    ],
    coins: [1_600_000, 3_200_000],
  },
];

export const getInvasion = (id: string): InvasionDef => {
  const invasion = InvasionList.find((candidate) => candidate.id === id);
  if (!invasion) throw new Error(`Invasion desconocida: ${id}`);
  return invasion;
};

/** Total de bichos de una invasion, para pintar el progreso global. */
export const totalKills = (invasion: InvasionDef): number =>
  invasion.waves.reduce((sum, wave) => sum + wave.kills, 0);
