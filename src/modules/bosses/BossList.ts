import type { DropDef, ItemId } from '../items/ItemType';

/**
 * Una fase de la pelea. Se activa cuando la vida del jefe baja del umbral y
 * cambia su comportamiento (mas dano, mas rapido), como el Ojo de Cthulhu real.
 */
export interface BossPhaseDef {
  /** Porcentaje de vida por debajo del cual entra esta fase (100 = desde el inicio). */
  atHealthPercent: number;
  name: string;
  damageMultiplier: number;
  speedMultiplier: number;
  /** Aviso que se muestra al entrar en la fase. */
  taunt: string;
}

export interface BossDef {
  id: string;
  name: string;
  sprite: string;
  description: string;
  health: number;
  /** Dano base por ataque, antes de defensa y multiplicador de fase. */
  damage: number;
  /** Intervalo base entre ataques, en ms. */
  attackIntervalMs: number;
  /**
   * Objeto que se consume para invocarlo. Los jefes del evento lunar no tienen:
   * los trae el evento, no el jugador.
   */
  summonItem?: ItemId;
  /** Zona desde la que se invoca. */
  zoneId: string;
  /**
   * Solo aparece durante el evento lunar. No se puede invocar desde el panel de
   * jefes como los demas, y perder contra el no devuelve ningun objeto.
   */
  eventBoss?: boolean;
  /**
   * Escudo: bichos que hay que matar en su zona antes de poder tocarlo. Es lo
   * que tienen los cuatro pilares.
   */
  shieldKills?: number;
  /** Id del pilar del evento, si este jefe es un pilar. */
  pillarId?: string;
  /**
   * Id de la invasion que lo trae, si es el jefe que la cierra. Solo se puede
   * pelear cuando esa invasion ha superado todas sus oleadas.
   */
  invasionId?: string;
  /** No devuelve dano: la pelea es contra el contador, no contra el. */
  harmless?: boolean;
  phases: BossPhaseDef[];
  drops: DropDef[];
  /** Monedas al vencer, en cobre. */
  coins: [min: number, max: number];
  /** Botin garantizado la primera vez que se le derrota. */
  firstClearDrops: DropDef[];
}

export const BossList: Record<string, BossDef> = {
  // ================================================================ INVASIONES
  // Los tres jefes que cierran un evento. No se invocan: aparecen cuando la
  // invasion ha aguantado todas sus oleadas.
  mothron: {
    id: 'mothron',
    name: 'Mothron',
    sprite: 'Mothron',
    description:
      'Lo que sale del Eclipse cuando el cielo ya lleva un rato negro. Pone huevos mientras te pega.',
    health: 400_000,
    damage: 80,
    attackIntervalMs: 900,
    eventBoss: true,
    invasionId: 'solar_eclipse',
    zoneId: 'hallow',
    phases: [
      { atHealthPercent: 100, name: 'Vuelo bajo', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El cielo se apaga del todo y Mothron baja.' },
      { atHealthPercent: 50, name: 'Frenesi', damageMultiplier: 1.5, speedMultiplier: 1.5, taunt: 'Empieza a poner huevos. Se acelera.' },
    ],
    drops: [
      { itemId: 'Broken_Hero_Sword', min: 1, max: 2, chance: 1 },
      { itemId: 'Mothron_Wings', min: 1, max: 1, chance: 0.4, affectedByLuck: true },
      { itemId: 'Death_Sickle', min: 1, max: 1, chance: 0.4, affectedByLuck: true },
      { itemId: 'Solar_Tablet_Fragment', min: 3, max: 6, chance: 0.8 },
    ],
    coins: [200000, 400000],
    firstClearDrops: [{ itemId: 'Broken_Hero_Sword', min: 1, max: 1, chance: 1 }],
  },

  ice_queen: {
    id: 'ice_queen',
    name: 'Reina de Hielo',
    sprite: 'Ice_Queen',
    description: 'La ultima oleada de la Luna de escarcha. Congela el aire por donde pasa.',
    health: 900_000,
    damage: 110,
    attackIntervalMs: 800,
    eventBoss: true,
    invasionId: 'frost_moon',
    zoneId: 'snow',
    phases: [
      { atHealthPercent: 100, name: 'Ventisca', damageMultiplier: 1, speedMultiplier: 1, taunt: 'La Reina de Hielo cierra la Luna de escarcha.' },
      { atHealthPercent: 60, name: 'Tormenta', damageMultiplier: 1.4, speedMultiplier: 1.4, taunt: 'La nieve tapa la pantalla.' },
      { atHealthPercent: 25, name: 'Cero absoluto', damageMultiplier: 1.9, speedMultiplier: 1.6, taunt: 'Todo se congela. Ultimo empujon.' },
    ],
    drops: [
      { itemId: 'North_Pole', min: 1, max: 1, chance: 0.35, affectedByLuck: true },
      { itemId: 'Razorpine', min: 1, max: 1, chance: 0.35, affectedByLuck: true },
      { itemId: 'Christmas_Tree_Sword', min: 1, max: 1, chance: 0.3, affectedByLuck: true },
      { itemId: 'Ectoplasm', min: 10, max: 20, chance: 1 },
    ],
    coins: [500000, 1000000],
    firstClearDrops: [{ itemId: 'North_Pole', min: 1, max: 1, chance: 1 }],
  },

  martian_saucer: {
    id: 'martian_saucer',
    name: 'Platillo marciano',
    sprite: 'Martian_Saucer',
    description:
      'Cuatro torretas y un nucleo. Cuando le revientas las armas se vuelve loco y embiste.',
    health: 1_200_000,
    damage: 130,
    attackIntervalMs: 750,
    eventBoss: true,
    invasionId: 'martian_madness',
    zoneId: 'hallow',
    phases: [
      { atHealthPercent: 100, name: 'Torretas', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El platillo aparece disparando por los cuatro lados.' },
      { atHealthPercent: 50, name: 'Sin armas', damageMultiplier: 1.6, speedMultiplier: 1.6, taunt: 'Le revientas las torretas: ahora embiste.' },
      { atHealthPercent: 20, name: 'Nucleo al aire', damageMultiplier: 2, speedMultiplier: 1.8, taunt: 'El nucleo queda al descubierto.' },
    ],
    drops: [
      { itemId: 'Laser_Machinegun', min: 1, max: 1, chance: 0.25, affectedByLuck: true },
      { itemId: 'Charged_Blaster_Cannon', min: 1, max: 1, chance: 0.25, affectedByLuck: true },
      { itemId: 'Electrosphere_Launcher', min: 1, max: 1, chance: 0.25, affectedByLuck: true },
      { itemId: 'Cosmic_Car_Key', min: 1, max: 1, chance: 0.25, affectedByLuck: true },
      { itemId: 'Martian_Conduit_Plating', min: 20, max: 40, chance: 1 },
    ],
    coins: [800000, 1600000],
    firstClearDrops: [
      { itemId: 'Influx_Waver', min: 1, max: 1, chance: 1 },
      { itemId: 'Cosmic_Car_Key', min: 1, max: 1, chance: 1 },
    ],
  },


  queen_bee: {
    id: 'queen_bee',
    name: 'Abeja Reina',
    sprite: 'Queen_Bee',
    description:
      'La duena de la colmena. Alterna entre embestidas horizontales y lluvias de abejas.',
    health: 13000,
    damage: 18,
    attackIntervalMs: 1400,
    summonItem: 'Abeemination',
    zoneId: 'jungle',
    phases: [
      {
        atHealthPercent: 100,
        name: 'Embestidas',
        damageMultiplier: 1,
        speedMultiplier: 1,
        taunt: 'La colmena se abre y la Abeja Reina carga contra ti.',
      },
      {
        atHealthPercent: 45,
        name: 'Enjambre furioso',
        damageMultiplier: 1.5,
        speedMultiplier: 1.5,
        taunt: 'Llama a todas sus crias a la vez.',
      },
    ],
    drops: [
      { itemId: 'Bee_Wax', min: 12, max: 25, chance: 1 },
      { itemId: 'Honey_Block', min: 10, max: 20, chance: 1 },
      { itemId: 'Bee_Keeper', min: 1, max: 1, chance: 0.35, affectedByLuck: true },
      { itemId: 'Stinger', min: 5, max: 12, chance: 0.8 },
    ],
    coins: [4500, 9000],
    firstClearDrops: [
      { itemId: 'Life_Crystal', min: 1, max: 1, chance: 1 },
      { itemId: 'Feral_Claws', min: 1, max: 1, chance: 1 },
    ],
  },

  skeletron: {
    id: 'skeletron',
    name: 'Esqueletron',
    sprite: 'Skeletron',
    description:
      'El guardian de la Mazmorra. Mientras le queden manos apenas te deja respirar; sin ellas, gira sin control.',
    health: 42000,
    damage: 22,
    attackIntervalMs: 1200,
    summonItem: 'Clothier_Voodoo_Doll',
    zoneId: 'dungeon',
    phases: [
      {
        atHealthPercent: 100,
        name: 'Con las dos manos',
        damageMultiplier: 1,
        speedMultiplier: 1,
        taunt: 'Esqueletron despliega las dos manos y te rodea.',
      },
      {
        atHealthPercent: 55,
        name: 'Una mano menos',
        damageMultiplier: 1.35,
        speedMultiplier: 1.3,
        taunt: 'Le arrancas una mano. La otra golpea el doble de fuerte.',
      },
      {
        atHealthPercent: 20,
        name: 'Craneo giratorio',
        damageMultiplier: 1.8,
        speedMultiplier: 1.6,
        taunt: 'Sin manos, el craneo empieza a girar a toda velocidad.',
      },
    ],
    drops: [
      { itemId: 'Bone', min: 30, max: 60, chance: 1 },
      { itemId: 'Golden_Key', min: 2, max: 5, chance: 1 },
      { itemId: 'Cobalt_Shield', min: 1, max: 1, chance: 0.3, affectedByLuck: true },
      { itemId: 'Muramasa', min: 1, max: 1, chance: 0.25, affectedByLuck: true },
    ],
    coins: [12000, 24000],
    firstClearDrops: [
      { itemId: 'Life_Crystal', min: 2, max: 2, chance: 1 },
      { itemId: 'Water_Bolt', min: 1, max: 1, chance: 1 },
    ],
  },

  wall_of_flesh: {
    id: 'wall_of_flesh',
    name: 'Muro de Carne',
    sprite: 'Wall_of_Flesh',
    description:
      'La pared viva que cruza el inframundo. Cuanto menos le queda, mas rapido avanza. No hay donde esconderse.',
    health: 95000,
    damage: 28,
    attackIntervalMs: 1100,
    summonItem: 'Guide_Voodoo_Doll',
    zoneId: 'underworld',
    phases: [
      {
        atHealthPercent: 100,
        name: 'Avanzando',
        damageMultiplier: 1,
        speedMultiplier: 1,
        taunt: 'El Muro de Carne emerge de la lava y empieza a avanzar.',
      },
      {
        atHealthPercent: 60,
        name: 'Acelerando',
        damageMultiplier: 1.3,
        speedMultiplier: 1.4,
        taunt: 'Escupe sanguijuelas y aprieta el paso.',
      },
      {
        atHealthPercent: 25,
        name: 'Ultimo tramo',
        damageMultiplier: 1.9,
        speedMultiplier: 1.7,
        taunt: 'Los ojos se abren del todo. Ahora o nunca.',
      },
    ],
    drops: [
      { itemId: 'Cobalt_Ore', min: 30, max: 60, chance: 1 },
      { itemId: 'Palladium_Ore', min: 30, max: 60, chance: 1 },
      { itemId: 'Magma_Stone', min: 1, max: 1, chance: 0.4, affectedByLuck: true },
      { itemId: 'Lava_Charm', min: 1, max: 1, chance: 0.25, affectedByLuck: true },
    ],
    coins: [40000, 80000],
    firstClearDrops: [
      { itemId: 'Life_Crystal', min: 3, max: 3, chance: 1 },
      { itemId: 'Pwnhammer', min: 1, max: 1, chance: 1 },
      { itemId: 'Cobalt_Ore', min: 60, max: 60, chance: 1 },
    ],
  },
  king_slime: {
    id: 'king_slime',
    name: 'Rey Slime',
    sprite: 'King_Slime',
    description:
      'Una montana de gelatina con una corona robada. Lento, pero cada salto quita media barra.',
    health: 2600,
    damage: 11,
    attackIntervalMs: 1800,
    summonItem: 'Slime_Crown',
    zoneId: 'forest',
    phases: [
      {
        atHealthPercent: 100,
        name: 'Saltos pesados',
        damageMultiplier: 1,
        speedMultiplier: 1,
        taunt: 'El Rey Slime aterriza delante de ti.',
      },
      {
        atHealthPercent: 40,
        name: 'Enfurecido',
        damageMultiplier: 1.4,
        speedMultiplier: 1.35,
        taunt: 'Se encoge y empieza a saltar mucho mas rapido.',
      },
    ],
    drops: [
      { itemId: 'Gel', min: 20, max: 40, chance: 1 },
      { itemId: 'Slime_Staff', min: 1, max: 1, chance: 0.08, affectedByLuck: true },
      { itemId: 'Gold_Ore', min: 3, max: 8, chance: 0.6 },
    ],
    coins: [800, 1600],
    firstClearDrops: [
      { itemId: 'Life_Crystal', min: 1, max: 1, chance: 1 },
      { itemId: 'Gold_Crown', min: 1, max: 1, chance: 1 },
    ],
  },

  eye_of_cthulhu: {
    id: 'eye_of_cthulhu',
    name: 'Ojo de Cthulhu',
    sprite: 'Eye_of_Cthulhu',
    description:
      'El primer jefe de verdad. A media vida se rompe la cornea y se lanza a por ti sin parar.',
    health: 2200,
    damage: 14,
    attackIntervalMs: 1500,
    summonItem: 'Suspicious_Looking_Eye',
    zoneId: 'forest',
    phases: [
      {
        atHealthPercent: 100,
        name: 'Observando',
        damageMultiplier: 1,
        speedMultiplier: 1,
        taunt: 'El Ojo de Cthulhu te rodea invocando sirvientes.',
      },
      {
        atHealthPercent: 50,
        name: 'Segunda forma',
        damageMultiplier: 1.9,
        speedMultiplier: 1.6,
        taunt: 'La cornea se rompe. Ahora solo embiste.',
      },
    ],
    drops: [
      { itemId: 'Demonite_Ore', min: 10, max: 25, chance: 1 },
      { itemId: 'Lens', min: 3, max: 6, chance: 1 },
      { itemId: 'Black_Lens', min: 1, max: 1, chance: 0.2, affectedByLuck: true },
      { itemId: 'Shadow_Scale', min: 2, max: 5, chance: 0.5 },
    ],
    coins: [2500, 5000],
    firstClearDrops: [
      { itemId: 'Life_Crystal', min: 1, max: 1, chance: 1 },
      { itemId: 'Band_of_Regeneration', min: 1, max: 1, chance: 1 },
    ],
  },

  eater_of_worlds: {
    id: 'eater_of_worlds',
    name: 'Devorador de Mundos',
    sprite: 'Eater_of_Worlds',
    description:
      'Un gusano interminable que atraviesa la Corrupcion. Cuanto mas corto, mas agresivo se vuelve.',
    health: 22000,
    damage: 16,
    attackIntervalMs: 1300,
    summonItem: 'Worm_Food',
    zoneId: 'corruption',
    phases: [
      {
        atHealthPercent: 100,
        name: 'Cuerpo completo',
        damageMultiplier: 1,
        speedMultiplier: 1,
        taunt: 'El suelo se abre y el gusano emerge entero.',
      },
      {
        atHealthPercent: 60,
        name: 'Partido en dos',
        damageMultiplier: 1.3,
        speedMultiplier: 1.4,
        taunt: 'Se parte en dos mitades y ambas van a por ti.',
      },
      {
        atHealthPercent: 25,
        name: 'Enjambre',
        damageMultiplier: 1.7,
        speedMultiplier: 1.9,
        taunt: 'Ya solo quedan cabezas sueltas mordiendo a ciegas.',
      },
    ],
    drops: [
      { itemId: 'Demonite_Ore', min: 20, max: 45, chance: 1 },
      { itemId: 'Shadow_Scale', min: 10, max: 20, chance: 1 },
      { itemId: 'Vile_Mushroom', min: 3, max: 8, chance: 0.6 },
    ],
    coins: [6000, 12000],
    firstClearDrops: [{ itemId: 'Life_Crystal', min: 2, max: 2, chance: 1 }],
  },

  // ================================================================ HARDMODE
  the_twins: {
    id: 'the_twins',
    name: 'Los Gemelos',
    sprite: 'Retinazer',
    description:
      'Dos ojos mecanicos que se turnan. Retinazer dispara laser; Spazmatism escupe fuego maldito.',
    health: 180000,
    damage: 46,
    attackIntervalMs: 900,
    summonItem: 'Mechanical_Eye',
    zoneId: 'hallow',
    phases: [
      { atHealthPercent: 100, name: 'Los dos enteros', damageMultiplier: 1, speedMultiplier: 1, taunt: 'Los Gemelos se separan y te rodean.' },
      { atHealthPercent: 50, name: 'Segunda forma', damageMultiplier: 1.6, speedMultiplier: 1.5, taunt: 'Los dos se transforman a la vez. Esto va en serio.' },
    ],
    drops: [
      { itemId: 'Hallowed_Bar', min: 15, max: 30, chance: 1 },
      { itemId: 'Soul_of_Sight', min: 20, max: 35, chance: 1 },
    ],
    coins: [150000, 300000],
    firstClearDrops: [{ itemId: 'Life_Crystal', min: 2, max: 2, chance: 1 }],
  },

  the_destroyer: {
    id: 'the_destroyer',
    name: 'El Destructor',
    sprite: 'The_Destroyer',
    description:
      'El Devorador de Mundos, pero de metal y con laseres. Cuanto mas corto, mas sondas suelta.',
    health: 250000,
    damage: 52,
    attackIntervalMs: 950,
    summonItem: 'Mechanical_Worm',
    zoneId: 'corruption_deep',
    phases: [
      { atHealthPercent: 100, name: 'Cuerpo entero', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El suelo tiembla y sale el Destructor.' },
      { atHealthPercent: 60, name: 'Sondas sueltas', damageMultiplier: 1.35, speedMultiplier: 1.35, taunt: 'Se le desprenden las sondas y todas disparan.' },
      { atHealthPercent: 25, name: 'Cabeza a la vista', damageMultiplier: 1.8, speedMultiplier: 1.6, taunt: 'Ya solo queda la cabeza, y va directa a ti.' },
    ],
    drops: [
      { itemId: 'Hallowed_Bar', min: 20, max: 35, chance: 1 },
      { itemId: 'Soul_of_Might', min: 20, max: 35, chance: 1 },
    ],
    coins: [180000, 360000],
    firstClearDrops: [{ itemId: 'Life_Crystal', min: 2, max: 2, chance: 1 }],
  },

  skeletron_prime: {
    id: 'skeletron_prime',
    name: 'Esqueletron Primigenio',
    sprite: 'Skeletron_Prime',
    description:
      'Esqueletron con sierra, taladro, canon y pinza. Una por brazo, y todas apuntan a ti.',
    health: 220000,
    damage: 56,
    attackIntervalMs: 880,
    summonItem: 'Mechanical_Skull',
    zoneId: 'dungeon',
    phases: [
      { atHealthPercent: 100, name: 'Cuatro brazos', damageMultiplier: 1, speedMultiplier: 1, taunt: 'Esqueletron Primigenio despliega los cuatro brazos.' },
      { atHealthPercent: 55, name: 'Sin brazos', damageMultiplier: 1.45, speedMultiplier: 1.4, taunt: 'Le arrancas los brazos y el craneo empieza a girar.' },
      { atHealthPercent: 20, name: 'Sierra a fondo', damageMultiplier: 1.9, speedMultiplier: 1.7, taunt: 'La sierra alcanza su velocidad maxima.' },
    ],
    drops: [
      { itemId: 'Hallowed_Bar', min: 20, max: 35, chance: 1 },
      { itemId: 'Soul_of_Fright', min: 20, max: 35, chance: 1 },
    ],
    coins: [175000, 350000],
    firstClearDrops: [{ itemId: 'Life_Crystal', min: 2, max: 2, chance: 1 }],
  },

  plantera: {
    id: 'plantera',
    name: 'Plantera',
    sprite: 'Plantera',
    description:
      'El bulbo se abre y sale la planta. Al llegar a la mitad tira los petalos y se lanza a por ti.',
    health: 450000,
    damage: 72,
    attackIntervalMs: 800,
    summonItem: "Plantera's_Bulb",
    zoneId: 'jungle_deep',
    phases: [
      { atHealthPercent: 100, name: 'En el bulbo', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El bulbo revienta y Plantera se despliega.' },
      { atHealthPercent: 50, name: 'Segunda forma', damageMultiplier: 1.8, speedMultiplier: 1.7, taunt: 'Suelta los petalos y va directa a por ti.' },
    ],
    drops: [
      { itemId: 'Temple_Key', min: 1, max: 1, chance: 1 },
      { itemId: 'Chlorophyte_Ore', min: 30, max: 60, chance: 1 },
      { itemId: 'Ectoplasm', min: 5, max: 12, chance: 0.6 },
    ],
    coins: [350000, 700000],
    firstClearDrops: [{ itemId: 'Life_Crystal', min: 2, max: 2, chance: 1 }],
  },

  golem: {
    id: 'golem',
    name: 'Golem',
    sprite: 'Golem',
    description:
      'El guardian del Templo. Primero pierde las manos, luego la cabeza sale volando por su cuenta.',
    health: 700000,
    damage: 92,
    attackIntervalMs: 850,
    summonItem: 'Lihzahrd_Power_Cell',
    zoneId: 'temple',
    phases: [
      { atHealthPercent: 100, name: 'Entero', damageMultiplier: 1, speedMultiplier: 1, taunt: 'Golem se levanta del altar.' },
      { atHealthPercent: 60, name: 'Sin punos', damageMultiplier: 1.4, speedMultiplier: 1.35, taunt: 'Le revientas los punos. Ahora salta.' },
      { atHealthPercent: 25, name: 'Cabeza libre', damageMultiplier: 1.9, speedMultiplier: 1.6, taunt: 'La cabeza se desprende y dispara laseres.' },
    ],
    drops: [
      { itemId: 'Beetle_Husk', min: 8, max: 18, chance: 1 },
      { itemId: 'Beetle_Shell', min: 1, max: 3, chance: 0.5, affectedByLuck: true },
      { itemId: 'Picksaw', min: 1, max: 1, chance: 0.4, affectedByLuck: true },
      { itemId: 'Stynger', min: 1, max: 1, chance: 0.3, affectedByLuck: true },
      { itemId: 'Chlorophyte_Bar', min: 10, max: 20, chance: 0.7 },
    ],
    coins: [600000, 1200000],
    firstClearDrops: [
      { itemId: 'Life_Crystal', min: 2, max: 2, chance: 1 },
      { itemId: 'Picksaw', min: 1, max: 1, chance: 1 },
      { itemId: 'Ancient_Manipulator', min: 1, max: 1, chance: 1 },
    ],
  },

  moon_lord: {
    id: 'moon_lord',
    name: 'Senor de la Luna',
    sprite: 'Moon_Lord',
    description:
      'Cthulhu entero, no solo su ojo. Tres nucleos, un corazon y ninguna intencion de dejarte marchar.',
    // Es el ultimo jefe y ahora se llega a el por el evento lunar entero, no
    // viajando a la Luna: se le sube la vida para que la pelea este a la altura
    // de las cuatro mil muertes que hacen falta para invocarlo. El dano por
    // golpe se queda donde estaba: con la cuarta fase a 2,4x y armadura de
    // escarabajo se moria en dos segundos y medio, y despues de ese grindeo
    // morir por un multiplicador y no por jugar mal es una tomadura de pelo.
    health: 1_600_000,
    damage: 105,
    attackIntervalMs: 750,
    summonItem: 'Celestial_Sigil',
    eventBoss: true,
    zoneId: 'moon',
    phases: [
      { atHealthPercent: 100, name: 'Nucleos cerrados', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El cielo se parte y baja el Senor de la Luna.' },
      { atHealthPercent: 70, name: 'Manos abiertas', damageMultiplier: 1.4, speedMultiplier: 1.3, taunt: 'Los ojos de las manos se abren.' },
      { atHealthPercent: 40, name: 'Ojo de la frente', damageMultiplier: 1.8, speedMultiplier: 1.5, taunt: 'Se abre el ojo de la frente. Lanza rayos.' },
      { atHealthPercent: 15, name: 'Corazon expuesto', damageMultiplier: 2, speedMultiplier: 1.7, taunt: 'El corazon queda al descubierto. Todo o nada.' },
    ],
    drops: [
      { itemId: 'Luminite', min: 60, max: 110, chance: 1 },
      { itemId: 'Meowmere', min: 1, max: 1, chance: 0.25, affectedByLuck: true },
      { itemId: 'Star_Wrath', min: 1, max: 1, chance: 0.25, affectedByLuck: true },
      { itemId: 'Influx_Waver', min: 1, max: 1, chance: 0.25, affectedByLuck: true },
    ],
    coins: [2000000, 4000000],
    firstClearDrops: [
      { itemId: 'Life_Crystal', min: 3, max: 3, chance: 1 },
      { itemId: 'Meowmere', min: 1, max: 1, chance: 1 },
      { itemId: 'Terrarian', min: 1, max: 1, chance: 1 },
    ],
  },

  // ================================================================ EVENTO LUNAR
  lunatic_cultist: {
    id: 'lunatic_cultist',
    name: 'Cultista Lunatico',
    sprite: 'Lunatic_Cultist',
    description:
      'El que abre el cielo. Se clona, se teleporta y dibuja runas que explotan. No se invoca: aparece.',
    health: 700_000,
    damage: 95,
    attackIntervalMs: 800,
    eventBoss: true,
    zoneId: 'dungeon',
    phases: [
      { atHealthPercent: 100, name: 'Ritual', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El circulo de cultistas se abre y el Lunatico se gira hacia ti.' },
      { atHealthPercent: 60, name: 'Clones', damageMultiplier: 1.4, speedMultiplier: 1.4, taunt: 'Se desdobla. Ahora hay cuatro, y solo uno es el bueno.' },
      { atHealthPercent: 25, name: 'Dragon antiguo', damageMultiplier: 2, speedMultiplier: 1.7, taunt: 'Llama al dragon de luz antigua. Ultima runa.' },
    ],
    drops: [
      { itemId: 'Ectoplasm', min: 10, max: 20, chance: 1 },
      { itemId: 'Solar_Fragment', min: 4, max: 8, chance: 0.5 },
    ],
    coins: [700000, 1400000],
    firstClearDrops: [{ itemId: 'Ancient_Manipulator', min: 1, max: 1, chance: 1 }],
  },

  // Los cuatro pilares. No devuelven dano: lo que cuesta es el escudo, mil
  // bichos por pilar, y luego romperlo a clicks con calma.
  solar_pillar: {
    id: 'solar_pillar',
    name: 'Pilar Solar',
    sprite: 'Solar_Pillar',
    description: 'Una columna de fuego. Con el escudo bajado es un saco de golpes que no responde.',
    health: 600_000,
    damage: 0,
    attackIntervalMs: 4000,
    eventBoss: true,
    harmless: true,
    shieldKills: 1000,
    pillarId: 'solar',
    zoneId: 'pillar_solar',
    phases: [
      { atHealthPercent: 100, name: 'Sin escudo', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El escudo esta caido. El pilar no se defiende: solo aguanta.' },
    ],
    drops: [
      { itemId: 'Solar_Fragment', min: 140, max: 220, chance: 1 },
      // 20-30 de luminita por pilar: los cuatro dejan entre 20 y 30 lingotes
      // antes de pelear con el Senor de la Luna, que es lo que se queda en la
      // mochila si la pelea sale mal.
      { itemId: 'Luminite', min: 20, max: 30, chance: 1 },
    ],
    coins: [900000, 1800000],
    firstClearDrops: [],
  },
  vortex_pillar: {
    id: 'vortex_pillar',
    name: 'Pilar del Vortice',
    sprite: 'Vortex_Pillar',
    description: 'Un ojo de tormenta clavado en el suelo. Tampoco devuelve dano.',
    health: 600_000,
    damage: 0,
    attackIntervalMs: 4000,
    eventBoss: true,
    harmless: true,
    shieldKills: 1000,
    pillarId: 'vortex',
    zoneId: 'pillar_vortex',
    phases: [
      { atHealthPercent: 100, name: 'Sin escudo', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El escudo esta caido. Dale.' },
    ],
    drops: [
      { itemId: 'Vortex_Fragment', min: 140, max: 220, chance: 1 },
      // 20-30 de luminita por pilar: los cuatro dejan entre 20 y 30 lingotes
      // antes de pelear con el Senor de la Luna, que es lo que se queda en la
      // mochila si la pelea sale mal.
      { itemId: 'Luminite', min: 20, max: 30, chance: 1 },
    ],
    coins: [900000, 1800000],
    firstClearDrops: [],
  },
  nebula_pillar: {
    id: 'nebula_pillar',
    name: 'Pilar de la Nebulosa',
    sprite: 'Nebula_Pillar',
    description: 'Colores que no deberian existir, apilados. Inofensivo sin escudo.',
    health: 600_000,
    damage: 0,
    attackIntervalMs: 4000,
    eventBoss: true,
    harmless: true,
    shieldKills: 1000,
    pillarId: 'nebula',
    zoneId: 'pillar_nebula',
    phases: [
      { atHealthPercent: 100, name: 'Sin escudo', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El escudo esta caido. Dale.' },
    ],
    drops: [
      { itemId: 'Nebula_Fragment', min: 140, max: 220, chance: 1 },
      // 20-30 de luminita por pilar: los cuatro dejan entre 20 y 30 lingotes
      // antes de pelear con el Senor de la Luna, que es lo que se queda en la
      // mochila si la pelea sale mal.
      { itemId: 'Luminite', min: 20, max: 30, chance: 1 },
    ],
    coins: [900000, 1800000],
    firstClearDrops: [],
  },
  stardust_pillar: {
    id: 'stardust_pillar',
    name: 'Pilar del Polvo Estelar',
    sprite: 'Stardust_Pillar',
    description: 'La misma materia que las estrellas, en columna. Inofensivo sin escudo.',
    health: 600_000,
    damage: 0,
    attackIntervalMs: 4000,
    eventBoss: true,
    harmless: true,
    shieldKills: 1000,
    pillarId: 'stardust',
    zoneId: 'pillar_stardust',
    phases: [
      { atHealthPercent: 100, name: 'Sin escudo', damageMultiplier: 1, speedMultiplier: 1, taunt: 'El escudo esta caido. Dale.' },
    ],
    drops: [
      { itemId: 'Stardust_Fragment', min: 140, max: 220, chance: 1 },
      // 20-30 de luminita por pilar: los cuatro dejan entre 20 y 30 lingotes
      // antes de pelear con el Senor de la Luna, que es lo que se queda en la
      // mochila si la pelea sale mal.
      { itemId: 'Luminite', min: 20, max: 30, chance: 1 },
    ],
    coins: [900000, 1800000],
    firstClearDrops: [],
  },
};

export const getBoss = (id: string): BossDef => {
  const boss = BossList[id];
  if (!boss) throw new Error(`Jefe desconocido: ${id}`);
  return boss;
};
