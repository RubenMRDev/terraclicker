import type { ItemId, ItemStats } from '../items/ItemType';
import type { Requirement } from '../requirements/Requirement';

/**
 * Lo que sabe hacer un vecino. Un NPC puede tener varios: el inventor duende
 * vende y ademas reforja.
 */
export type NpcRole =
  /** Da consejos sobre lo siguiente que toca hacer. */
  | 'guide'
  /** Tiene tienda. */
  | 'shop'
  /** Reforja rasgos (los prefijos de Terraria). */
  | 'reforge'
  /** Cura a cambio de monedas. */
  | 'heal'
  /** Recauda impuestos: renta pasiva mientras juegas. */
  | 'tax'
  /** Solo esta ahi para contar cosas. */
  | 'lore';

export interface ShopEntry {
  itemId: ItemId;
  /** Precio en cobre. */
  price: number;
  /** Si esta, el articulo no aparece en la tienda hasta que se cumple. */
  requires?: Requirement[];
}

export interface NpcDef {
  id: string;
  name: string;
  /** Sprite en public/assets/npcs. */
  sprite: string;
  /** Oficio, en una linea. */
  title: string;
  description: string;
  roles: NpcRole[];
  /** Que tiene que pasar para que quiera mudarse. Vacio = desde el minuto uno. */
  arrival: Requirement[];
  /**
   * Bonificacion pasiva que aporta mientras vive en el pueblo. Es el sustituto
   * de la felicidad de los NPCs de Terraria: aqui tener vecinos suma stats.
   */
  bonus?: ItemStats;
  shop?: ShopEntry[];
  /** Frases sueltas, para que cada uno tenga voz propia. */
  quotes: string[];
}

const hardmode: Requirement[] = [{ kind: 'bossDefeated', bossId: 'wall_of_flesh' }];

/**
 * Los 25 vecinos de Terraria. El orden es el de llegada aproximada: la lista se
 * pinta en ese orden, asi que se lee como una linea de progresion.
 */
export const NpcList: NpcDef[] = [
  {
    id: 'guide',
    name: 'Guia',
    sprite: 'Guide',
    title: 'Consejero',
    description:
      'Se muda a la primera casa que construyas y no se va nunca. Te dice lo siguiente que toca.',
    roles: ['guide'],
    arrival: [],
    quotes: [
      'Prueba a talar un arbol. La madera lo arregla todo.',
      'Si un bloque no cede, no es que pegues poco: es que el pico no llega.',
      'Los altares demoniacos no se pican. Estan donde estan.',
    ],
  },
  {
    id: 'merchant',
    name: 'Mercader',
    sprite: 'Merchant',
    title: 'Tienda general',
    description: 'Compra cualquier cosa y vende lo basico. Tenerlo cerca hace que rinda mas el botin.',
    roles: ['shop'],
    arrival: [{ kind: 'coinsEarned', amount: 5_000 }],
    bonus: { coinBonus: 0.05 },
    shop: [
      { itemId: 'Torch', price: 8 },
      { itemId: 'Copper_Pickaxe', price: 600 },
      { itemId: 'Copper_Axe', price: 600 },
      { itemId: 'Rope', price: 12 },
      { itemId: 'Glowstick', price: 20 },
      { itemId: 'Lesser_Healing_Potion', price: 150 },
      { itemId: 'Mining_Helmet', price: 3_000 },
      { itemId: 'Iron_Anvil', price: 8_000 },
      { itemId: 'Piggy_Bank', price: 20_000 },
    ],
    quotes: ['Compro cualquier cosa. Cualquiera.', 'La hucha se paga sola, hazme caso.'],
  },
  {
    id: 'nurse',
    name: 'Enfermera',
    sprite: 'Nurse',
    title: 'Curandera',
    description: 'Te cura a cambio de monedas, sin gastar la espera de las pociones.',
    roles: ['heal', 'shop'],
    arrival: [{ kind: 'itemDiscovered', itemId: 'Life_Crystal' }],
    bonus: { regen: 2 },
    shop: [
      { itemId: 'Healing_Potion', price: 600 },
      { itemId: 'Bottled_Water', price: 30 },
      { itemId: 'Nurse_Hat', price: 12_000 },
      {
        itemId: 'Super_Healing_Potion',
        price: 6_000,
        requires: [{ kind: 'bossDefeated', bossId: 'plantera' }],
      },
    ],
    quotes: ['Eso no es nada. Sientate.', 'Si vuelves con eso otra vez te cobro el doble.'],
  },
  {
    id: 'demolitionist',
    name: 'Demoledor',
    sprite: 'Demolitionist',
    title: 'Explosivos',
    description: 'Vende bombas: revientan el bloque que tengas delante sin pegarle un solo click.',
    roles: ['shop'],
    arrival: [{ kind: 'itemGathered', itemId: 'Stone_Block', amount: 100 }],
    bonus: { damage: 3 },
    shop: [
      { itemId: 'Bomb', price: 500 },
      { itemId: 'Grenade', price: 400 },
      { itemId: 'Dynamite', price: 6_000 },
    ],
    quotes: ['Todo se puede minar. Algunas cosas mas rapido.', 'No corras con la dinamita.'],
  },
  {
    id: 'dryad',
    name: 'Driada',
    sprite: 'Dryad',
    title: 'Guardiana del bosque',
    description: 'Sabe de hierbas y de corrupcion. Su presencia te hace mas duro.',
    roles: ['shop'],
    arrival: [{ kind: 'bossDefeated', bossId: 'eye_of_cthulhu' }],
    bonus: { defense: 4 },
    shop: [
      { itemId: 'Acorn', price: 60 },
      { itemId: 'Purification_Powder', price: 150 },
      { itemId: 'Vile_Powder', price: 150 },
      { itemId: 'Sunflower', price: 15_000 },
    ],
    quotes: ['La Corrupcion crece. Siempre crece.', 'Planta bellotas. Te lo agradecera el hacha.'],
  },
  {
    id: 'arms_dealer',
    name: 'Traficante de armas',
    sprite: 'Arms_Dealer',
    title: 'Armas de fuego',
    description: 'Aparece cuando hueles a polvora. Vende pistolas y municion.',
    roles: ['shop'],
    arrival: [{ kind: 'enemiesDefeated', amount: 150 }],
    bonus: { damage: 6 },
    shop: [
      { itemId: 'Musket_Ball', price: 20 },
      { itemId: 'Flintlock_Pistol', price: 6_000 },
      { itemId: 'Silver_Bullet', price: 60 },
      { itemId: 'Musket', price: 25_000, requires: [{ kind: 'zoneVisited', zoneId: 'corruption' }] },
      { itemId: 'Revolver', price: 20_000, requires: [{ kind: 'zoneVisited', zoneId: 'desert' }] },
      { itemId: 'Boomstick', price: 30_000, requires: [{ kind: 'zoneVisited', zoneId: 'jungle' }] },
      { itemId: 'Minishark', price: 250_000 },
    ],
    quotes: ['Tengo balas. Tengo mas balas.', 'La plata pega mas que el plomo, creeme.'],
  },
  {
    id: 'old_man',
    name: 'Viejo',
    sprite: 'Old_Man',
    title: 'Maldito',
    description:
      'Ronda la puerta de la Mazmorra. No vende nada, pero sabe quien guarda el pasillo.',
    roles: ['lore'],
    arrival: [{ kind: 'zoneVisited', zoneId: 'dungeon' }],
    bonus: { luck: 0.03 },
    quotes: [
      'Ese que guarda la puerta... yo era el.',
      'No bajes de noche. Bueno, baja. Pero no digas que no te lo dije.',
    ],
  },
  {
    id: 'clothier',
    name: 'Sastre',
    sprite: 'Clothier',
    title: 'Ropa y muebles',
    description: 'Libre por fin de la maldicion de Esqueletron. Vende muebles para las casas.',
    roles: ['shop'],
    arrival: [{ kind: 'bossDefeated', bossId: 'skeletron' }],
    bonus: { defense: 3 },
    shop: [
      { itemId: 'Wooden_Door', price: 200 },
      { itemId: 'Bed', price: 1_500 },
      { itemId: 'Silk', price: 300 },
    ],
    quotes: ['Gracias por lo de los huesos.', 'Una casa sin puerta no es una casa.'],
  },
  {
    id: 'dye_trader',
    name: 'Comerciante de tintes',
    sprite: 'Dye_Trader',
    title: 'Rarezas',
    description: 'Cambia cosas raras por otras cosas raras. Vende lentes que nadie sabe de donde saca.',
    roles: ['shop'],
    arrival: [{ kind: 'itemGathered', itemId: 'Daybloom', amount: 10 }],
    bonus: { luck: 0.03 },
    shop: [
      { itemId: 'Lens', price: 600 },
      { itemId: 'Black_Lens', price: 4_000 },
    ],
    quotes: ['Traeme algo raro y te doy algo mas raro.'],
  },
  {
    id: 'angler',
    name: 'Pescador',
    sprite: 'Angler',
    title: 'Pesca',
    description: 'Un nino insufrible que, aun asi, tiene el mejor equipo de pesca del mundo.',
    roles: ['shop'],
    arrival: [
      { kind: 'zoneVisited', zoneId: 'ocean' },
      { kind: 'npcsHoused', amount: 3 },
    ],
    bonus: { coinBonus: 0.05 },
    shop: [
      { itemId: 'Honeyfin', price: 500 },
      { itemId: 'Golden_Fishing_Rod', price: 200_000 },
    ],
    quotes: ['Trae peces. Ya.', 'No, un pez de verdad.'],
  },
  {
    id: 'goblin_tinkerer',
    name: 'Inventor duende',
    sprite: 'Goblin_Tinkerer',
    title: 'Reforjado',
    description:
      'El unico del mundo que sabe cambiarle el rasgo a una pieza. Cobra por intento, y el dado es el dado.',
    roles: ['reforge', 'shop'],
    arrival: [{ kind: 'enemyKills', enemyId: 'goblin_scout', amount: 25 }],
    bonus: { damage: 8 },
    shop: [
      { itemId: "Tinkerer's_Workshop", price: 100_000 },
      { itemId: 'Handgun', price: 60_000 },
      { itemId: 'Rocket_Boots', price: 80_000 },
      { itemId: 'Safe', price: 200_000 },
    ],
    quotes: [
      'Dame la espada y unas monedas. No prometo nada.',
      'Legendario? Eso sale una de cada muchas. Sigue pagando.',
    ],
  },
  {
    id: 'witch_doctor',
    name: 'Doctor brujo',
    sprite: 'Witch_Doctor',
    title: 'Magia de la jungla',
    description: 'Llega cuando cae la Abeja Reina. Vende alas y baculos de invocacion.',
    roles: ['shop'],
    arrival: [{ kind: 'bossDefeated', bossId: 'queen_bee' }],
    bonus: { mana: 20, manaRegen: 2 },
    shop: [
      { itemId: 'Blowgun', price: 40_000 },
      { itemId: 'Imp_Staff', price: 80_000 },
      {
        itemId: 'Leaf_Wings',
        price: 400_000,
        requires: [{ kind: 'bossDefeated', bossId: 'plantera' }],
      },
      {
        itemId: 'Pygmy_Staff',
        price: 500_000,
        requires: [{ kind: 'bossDefeated', bossId: 'plantera' }],
      },
    ],
    quotes: ['La jungla recuerda.', 'Las alas de hoja son mejores de lo que parecen.'],
  },
  {
    id: 'mechanic',
    name: 'Mecanica',
    sprite: 'Mechanic',
    title: 'Cableado',
    description: 'Rescatada de la Mazmorra. Cablea lo que le pongas delante y acelera tu equipo.',
    roles: ['shop'],
    arrival: [
      { kind: 'bossDefeated', bossId: 'skeletron' },
      { kind: 'zoneVisited', zoneId: 'dungeon' },
    ],
    bonus: { autoDps: 12 },
    shop: [
      { itemId: 'Wire', price: 300 },
      { itemId: 'Wrench', price: 5_000 },
      { itemId: 'Wire_Cutter', price: 5_000 },
    ],
    quotes: ['Dame cable y te monto lo que quieras.'],
  },
  {
    id: 'stylist',
    name: 'Estilista',
    sprite: 'Stylist',
    title: 'Peluqueria',
    description: 'La encontraste enredada en telaranas. Ahora corta el pelo y trae suerte.',
    roles: ['shop'],
    arrival: [{ kind: 'itemGathered', itemId: 'Cobweb', amount: 200 }],
    bonus: { luck: 0.04 },
    shop: [{ itemId: 'Silk', price: 250 }],
    quotes: ['Ese pelo no puede quedarse asi.'],
  },
  {
    id: 'painter',
    name: 'Pintor',
    sprite: 'Painter',
    title: 'Decoracion',
    description: 'Llega cuando el pueblo ya parece un pueblo. Vende muebles y sube el valor del botin.',
    roles: ['shop'],
    arrival: [{ kind: 'npcsHoused', amount: 8 }],
    bonus: { coinBonus: 0.08 },
    shop: [
      { itemId: 'Wooden_Table', price: 250 },
      { itemId: 'Wooden_Chair', price: 150 },
      { itemId: 'Bookcase', price: 30_000 },
    ],
    quotes: ['Un pueblo sin cuadros es un almacen.'],
  },
  {
    id: 'wizard',
    name: 'Mago',
    sprite: 'Wizard',
    title: 'Magia',
    description: 'Aparece con el Hardmode. Vende mana y cosas que no deberia vender.',
    roles: ['shop'],
    arrival: hardmode,
    bonus: { mana: 40, manaRegen: 3 },
    shop: [
      { itemId: 'Lesser_Mana_Potion', price: 300 },
      { itemId: 'Mana_Potion', price: 800 },
      { itemId: 'Crystal_Ball', price: 100_000 },
    ],
    quotes: ['El mana se regenera. La paciencia no.'],
  },
  {
    id: 'tavernkeep',
    name: 'Tabernero',
    sprite: 'Tavernkeep',
    title: 'Taberna',
    description: 'Viene de otro mundo y de otro juego. Sirve, sobre todo, bebida.',
    roles: ['shop'],
    arrival: hardmode,
    bonus: { regen: 3 },
    shop: [
      { itemId: 'Ale', price: 300 },
      { itemId: 'Sake', price: 1_200 },
      { itemId: 'Bowl_of_Soup', price: 800 },
    ],
    quotes: ['Una ronda. Va por la casa. La primera.'],
  },
  {
    id: 'steampunker',
    name: 'Ingeniera steampunk',
    sprite: 'Steampunker',
    title: 'Maquinaria',
    description: 'Llega con el primer jefe mecanico. Vende cosas que hacen mucho ruido.',
    roles: ['shop'],
    arrival: [{ kind: 'bossDefeated', bossId: 'the_twins' }],
    bonus: { autoDps: 60 },
    shop: [
      { itemId: 'Jetpack', price: 500_000 },
      { itemId: 'Clentaminator', price: 800_000 },
    ],
    quotes: ['El vapor lo mueve todo. Todo.'],
  },
  {
    id: 'truffle',
    name: 'Trufa',
    sprite: 'Truffle',
    title: 'Setas',
    description: 'Una seta que habla. Vende el automartillo, que es lo que abre la clorofita.',
    roles: ['shop'],
    arrival: [{ kind: 'bossDefeated', bossId: 'plantera' }],
    bonus: { damage: 120 },
    shop: [
      { itemId: 'Autohammer', price: 400_000 },
      { itemId: 'Mushroom_Spear', price: 600_000 },
      { itemId: 'Hammush', price: 600_000 },
    ],
    quotes: ['No soy un champinon. Soy una trufa.'],
  },
  {
    id: 'cyborg',
    name: 'Ciborg',
    sprite: 'Cyborg',
    title: 'Tecnologia',
    description: 'Mitad hombre, mitad cohete. Sube el DPS pasivo mas que ningun otro vecino.',
    roles: ['shop'],
    arrival: [{ kind: 'bossDefeated', bossId: 'plantera' }],
    bonus: { autoDps: 200 },
    shop: [
      { itemId: 'Heat_Ray', price: 900_000, requires: [{ kind: 'bossDefeated', bossId: 'golem' }] },
      { itemId: 'Solar_Monolith', price: 1_000_000 },
    ],
    quotes: ['Objetivo adquirido.'],
  },
  {
    id: 'pirate',
    name: 'Pirata',
    sprite: 'Pirate',
    title: 'Contrabando',
    description: 'Se queda por el oro. Con el en el pueblo, todo lo que rompes vale mas.',
    roles: ['shop'],
    arrival: [{ kind: 'coinsEarned', amount: 5_000_000 }],
    bonus: { coinBonus: 0.12 },
    shop: [
      { itemId: 'Musket_Ball', price: 15 },
      { itemId: 'Ale', price: 200 },
      { itemId: 'Coral', price: 400 },
    ],
    quotes: ['Arr. El oro es el oro.'],
  },
  {
    id: 'zoologist',
    name: 'Zoologa',
    sprite: 'Zoologist',
    title: 'Bestiario',
    description: 'Cataloga todo lo que matas. Cuanto mas mata el pueblo, mas suerte tienes.',
    roles: ['shop'],
    arrival: [{ kind: 'enemiesDefeated', amount: 2_000 }],
    bonus: { luck: 0.06 },
    shop: [
      { itemId: 'Bowl_of_Soup', price: 600 },
      { itemId: 'Honeyfin', price: 500 },
    ],
    quotes: ['Otro bicho para el catalogo.'],
  },
  {
    id: 'party_girl',
    name: 'Fiestera',
    sprite: 'Party_Girl',
    title: 'Fiestas',
    description: 'Solo se muda si el pueblo ya esta lleno. Trae suerte y monedas, a su manera.',
    roles: ['shop'],
    arrival: [{ kind: 'npcsHoused', amount: 10 }],
    bonus: { luck: 0.05, coinBonus: 0.05 },
    shop: [{ itemId: 'Glowstick', price: 30 }],
    quotes: ['Fiesta! Bueno, fiesta pequena.'],
  },
  {
    id: 'tax_collector',
    name: 'Recaudador',
    sprite: 'Tax_Collector',
    title: 'Impuestos',
    description:
      'Cobra a los demas vecinos y te pasa la parte. Cuanta mas gente en el pueblo, mas renta.',
    roles: ['tax'],
    arrival: [{ kind: 'bossDefeated', bossId: 'golem' }],
    quotes: ['Los impuestos son los impuestos.', 'Tu parte. Menos mi parte.'],
  },
  {
    id: 'santa_claus',
    name: 'Papa Noel',
    sprite: 'Santa_Claus',
    title: 'Regalos',
    description: 'Solo viene cuando ya has matado al Senor de la Luna. Trae lo mejor de todo.',
    roles: ['shop'],
    arrival: [{ kind: 'bossDefeated', bossId: 'moon_lord' }],
    bonus: { coinBonus: 0.2, luck: 0.1 },
    shop: [{ itemId: 'Snowball_Cannon', price: 100_000 }],
    quotes: ['Jo, jo, jo. Te lo has ganado.'],
  },
];

export const getNpc = (id: string): NpcDef => {
  const npc = NpcList.find((candidate) => candidate.id === id);
  if (!npc) throw new Error(`NPC desconocido: ${id}`);
  return npc;
};
