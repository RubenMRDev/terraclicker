import { EquipmentSlot, ToolKind } from '../GameConstants';
import { humanize } from '../GameHelper';
import { ItemCategory, type ItemDef, type ItemId } from './ItemType';

/**
 * Catalogo de objetos. El id coincide con el nombre del sprite descargado de la
 * wiki, asi que spriteUrl(id) resuelve la imagen sin tabla intermedia.
 */

type ItemSeed = Omit<ItemDef, 'name'> & { name?: string };

const seed: ItemSeed[] = [
  // ---------------------------------------------------------------- materiales
  { id: 'Dirt_Block', name: 'Bloque de tierra', category: ItemCategory.Material, description: 'Tierra. Hay mucha.', sellPrice: 1 },
  { id: 'Stone_Block', name: 'Bloque de piedra', category: ItemCategory.Material, description: 'La base de todo lo subterraneo.', sellPrice: 2 },
  { id: 'Wood', name: 'Madera', category: ItemCategory.Material, description: 'Sale de los arboles. Sirve para casi todo.', sellPrice: 3 },
  { id: 'Ebonwood', name: 'Madera sombria', category: ItemCategory.Material, description: 'Madera corrupta, mas oscura y mas dura.', sellPrice: 8 },
  { id: 'Acorn', name: 'Bellota', category: ItemCategory.Material, description: 'Se plantan para que crezcan mas arboles.', sellPrice: 5 },
  { id: 'Gel', name: 'Gel', category: ItemCategory.Material, description: 'Baba de slime. Combustible de antorchas.', sellPrice: 2 },
  { id: 'Mushroom', name: 'Champinon', category: ItemCategory.Material, description: 'Ingrediente base de las pociones curativas.', sellPrice: 10 },
  { id: 'Daybloom', name: 'Flor del dia', category: ItemCategory.Material, description: 'Hierba alquimica que solo abre de dia.', sellPrice: 20 },
  { id: 'Cobweb', name: 'Telarana', category: ItemCategory.Material, description: 'Se hila para obtener seda.', sellPrice: 1 },
  { id: 'Silk', name: 'Seda', category: ItemCategory.Material, description: 'Telarana hilada en el telar.', sellPrice: 15 },
  { id: 'Sand_Block', name: 'Bloque de arena', category: ItemCategory.Material, description: 'Se funde para hacer cristal.', sellPrice: 1 },
  { id: 'Glass', name: 'Cristal', category: ItemCategory.Material, description: 'Arena fundida en el horno.', sellPrice: 4 },
  { id: 'Cactus', name: 'Cactus', category: ItemCategory.Material, description: 'Pincha, pero se craftea.', sellPrice: 4 },
  { id: 'Bone', name: 'Hueso', category: ItemCategory.Material, description: 'Recuerdo de un esqueleto.', sellPrice: 20 },
  { id: 'Worm_Tooth', name: 'Diente de gusano', category: ItemCategory.Material, description: 'Arrancado a un gusano gigante.', sellPrice: 15 },
  { id: 'Rotten_Chunk', name: 'Trozo podrido', category: ItemCategory.Material, description: 'Carne corrupta. Huele fatal.', sellPrice: 20 },
  { id: 'Vile_Mushroom', name: 'Champinon vil', category: ItemCategory.Material, description: 'Crece solo en la Corrupcion.', sellPrice: 40 },
  { id: 'Vile_Powder', name: 'Polvo vil', category: ItemCategory.Material, description: 'Champinon vil molido.', sellPrice: 10 },
  { id: 'Shadow_Scale', name: 'Escama de sombra', category: ItemCategory.Material, description: 'Solo la sueltan las criaturas del Devorador.', sellPrice: 90 },
  { id: 'Lens', name: 'Lente', category: ItemCategory.Material, description: 'El ojo de un demon eye. Sigue mirandote.', sellPrice: 50 },
  { id: 'Black_Lens', name: 'Lente negra', category: ItemCategory.Material, description: 'Una lente tenida de oscuridad.', sellPrice: 150 },
  { id: 'Antlion_Mandible', name: 'Mandibula de hormiga leon', category: ItemCategory.Material, description: 'Afilada y ligera.', sellPrice: 30 },
  { id: 'Fallen_Star', name: 'Estrella caida', category: ItemCategory.Material, description: 'Cae del cielo por la noche.', sellPrice: 100 },
  { id: 'Torch', name: 'Antorcha', category: ItemCategory.Material, description: 'Ilumina las cuevas. Requisito del horno.', sellPrice: 5 },

  // ------------------------------------------------------------- desierto
  { id: 'Hardened_Sand_Block', name: 'Arena endurecida', category: ItemCategory.Material, description: 'Arena compactada por el peso de las dunas.', sellPrice: 3 },
  { id: 'Sandstone_Block', name: 'Bloque de arenisca', category: ItemCategory.Material, description: 'La roca del desierto profundo.', sellPrice: 6 },
  { id: 'Silt_Block', name: 'Bloque de limo', category: ItemCategory.Material, description: 'A veces esconde algo de valor.', sellPrice: 4 },

  // ------------------------------------------------------------- jungla
  { id: 'Rich_Mahogany', name: 'Caoba', category: ItemCategory.Material, description: 'Madera roja de la jungla. Dura de talar.', sellPrice: 12 },
  { id: 'Jungle_Spores', name: 'Esporas de jungla', category: ItemCategory.Material, description: 'Brillan en las paredes de la jungla subterranea.', sellPrice: 45 },
  { id: 'Stinger', name: 'Aguijon', category: ItemCategory.Material, description: 'Arrancado a un avispon. Sigue caliente.', sellPrice: 35 },
  { id: 'Vine', name: 'Liana', category: ItemCategory.Material, description: 'Cuelga de todas partes en la jungla.', sellPrice: 25 },
  { id: 'Bee_Wax', name: 'Cera de abeja', category: ItemCategory.Material, description: 'Solo la sueltan las colmenas y la Abeja Reina.', sellPrice: 120 },
  { id: 'Honey_Block', name: 'Bloque de miel', category: ItemCategory.Material, description: 'Pegajoso y dulce.', sellPrice: 20 },
  { id: 'Jungle_Rose', name: 'Rosa de la jungla', category: ItemCategory.Material, description: 'Flor rara entre la maleza.', sellPrice: 90 },
  { id: 'Moonglow', name: 'Brillo lunar', category: ItemCategory.Material, description: 'Hierba alquimica que solo abre de noche.', sellPrice: 60 },
  { id: 'Waterleaf', name: 'Hoja de agua', category: ItemCategory.Material, description: 'Crece en la arena cuando llueve.', sellPrice: 50 },

  // ------------------------------------------------------------- nieve
  { id: 'Snow_Block', name: 'Bloque de nieve', category: ItemCategory.Material, description: 'Nieve compactada.', sellPrice: 2 },
  { id: 'Ice_Block', name: 'Bloque de hielo', category: ItemCategory.Material, description: 'Resbala. Necesita pico.', sellPrice: 5 },
  { id: 'Boreal_Wood', name: 'Madera boreal', category: ItemCategory.Material, description: 'Madera palida de los pinos del norte.', sellPrice: 9 },
  { id: 'Shiverthorn', name: 'Espina helada', category: ItemCategory.Material, description: 'Hierba alquimica de la tundra.', sellPrice: 55 },
  { id: 'Slush_Block', name: 'Bloque de aguanieve', category: ItemCategory.Material, description: 'Barro helado. A veces trae mineral.', sellPrice: 6 },

  // ------------------------------------------------------------- meteorito
  { id: 'Meteorite', name: 'Meteorito', category: ItemCategory.Material, description: 'Cayo del cielo tras derrotar al Ojo. Quema al tocarlo.', sellPrice: 70 },


  // ------------------------------------------------------------- mazmorra
  { id: 'Blue_Brick', name: 'Ladrillo azul', category: ItemCategory.Material, description: 'Los muros de la Mazmorra.', sellPrice: 15 },
  { id: 'Bone_Block', name: 'Bloque de hueso', category: ItemCategory.Material, description: 'Huesos prensados.', sellPrice: 25 },
  { id: 'Golden_Key', name: 'Llave dorada', category: ItemCategory.Material, description: 'Abre los cofres de la Mazmorra.', sellPrice: 200 },

  // ------------------------------------------------------------- infierno
  { id: 'Hellstone', name: 'Piedra infernal', category: ItemCategory.Material, description: 'Mineral al rojo vivo. Hace falta un pico pesadilla.', sellPrice: 150 },
  { id: 'Obsidian', name: 'Obsidiana', category: ItemCategory.Material, description: 'Lava enfriada de golpe.', sellPrice: 80 },
  { id: 'Ash_Block', name: 'Bloque de ceniza', category: ItemCategory.Material, description: 'El suelo del inframundo.', sellPrice: 4 },
  { id: 'Fireblossom', name: 'Flor de fuego', category: ItemCategory.Material, description: 'Solo florece en el infierno.', sellPrice: 140 },
  { id: 'Blinkroot', name: 'Raiz parpadeante', category: ItemCategory.Material, description: 'Hierba alquimica subterranea.', sellPrice: 40 },
  { id: 'Deathweed', name: 'Hierba de la muerte', category: ItemCategory.Material, description: 'Crece en la Corrupcion en luna de sangre.', sellPrice: 70 },

  // ---------------------------------------------------------------- minerales
  { id: 'Copper_Ore', name: 'Mineral de cobre', category: ItemCategory.Material, description: 'El metal mas basico.', sellPrice: 5 },
  { id: 'Iron_Ore', name: 'Mineral de hierro', category: ItemCategory.Material, description: 'Mas duro que el cobre.', sellPrice: 10 },
  { id: 'Silver_Ore', name: 'Mineral de plata', category: ItemCategory.Material, description: 'Brilla en la oscuridad de las cavernas.', sellPrice: 18 },
  { id: 'Gold_Ore', name: 'Mineral de oro', category: ItemCategory.Material, description: 'Vale tanto como parece.', sellPrice: 30 },
  { id: 'Demonite_Ore', name: 'Mineral de demonita', category: ItemCategory.Material, description: 'Mineral maldito de la Corrupcion.', sellPrice: 60 },
  { id: 'Ebonstone_Block', name: 'Bloque de ebonita', category: ItemCategory.Material, description: 'Piedra infectada. Necesita un pico potente.', sellPrice: 12 },

  // Metales alternativos: en Terraria cada mundo tiene cobre o estano, hierro o
  // plomo... Aqui conviven, con estadisticas ligeramente distintas.
  { id: 'Tin_Ore', name: 'Mineral de estano', category: ItemCategory.Material, description: 'Alternativa al cobre. Pega un poco mas fuerte.', sellPrice: 6 },
  { id: 'Lead_Ore', name: 'Mineral de plomo', category: ItemCategory.Material, description: 'Alternativa al hierro. Mas pesado y mas duro.', sellPrice: 11 },
  { id: 'Tungsten_Ore', name: 'Mineral de tungsteno', category: ItemCategory.Material, description: 'Alternativa a la plata. Denso y afilado.', sellPrice: 20 },
  { id: 'Platinum_Ore', name: 'Mineral de platino', category: ItemCategory.Material, description: 'Alternativa al oro. El mejor metal comun.', sellPrice: 34 },

  // Del oceano.
  { id: 'Coral', name: 'Coral', category: ItemCategory.Material, description: 'Crece en los arrecifes de la costa.', sellPrice: 12 },
  { id: 'Seashell', name: 'Concha', category: ItemCategory.Material, description: 'Suena el mar si te la pones en la oreja.', sellPrice: 18 },
  { id: 'Starfish', name: 'Estrella de mar', category: ItemCategory.Material, description: 'Ingrediente alquimico de la costa.', sellPrice: 25 },
  { id: 'Shark_Fin', name: 'Aleta de tiburon', category: ItemCategory.Material, description: 'Arrancada a un tiburon. Con cuidado.', sellPrice: 90 },

  // ---------------------------------------------------------------- lingotes
  { id: 'Copper_Bar', name: 'Lingote de cobre', category: ItemCategory.Bar, description: 'Tres minerales fundidos en el horno.', sellPrice: 20 },
  { id: 'Iron_Bar', name: 'Lingote de hierro', category: ItemCategory.Bar, description: 'Base de yunques y armaduras.', sellPrice: 40 },
  { id: 'Silver_Bar', name: 'Lingote de plata', category: ItemCategory.Bar, description: 'Ligero y resistente.', sellPrice: 75 },
  { id: 'Gold_Bar', name: 'Lingote de oro', category: ItemCategory.Bar, description: 'Pesado y valioso.', sellPrice: 130 },
  { id: 'Demonite_Bar', name: 'Lingote de demonita', category: ItemCategory.Bar, description: 'Late levemente al tocarlo.', sellPrice: 260 },
  { id: 'Tin_Bar', name: 'Lingote de estano', category: ItemCategory.Bar, description: 'Tres minerales de estano fundidos.', sellPrice: 24 },
  { id: 'Lead_Bar', name: 'Lingote de plomo', category: ItemCategory.Bar, description: 'Base del yunque de plomo.', sellPrice: 46 },
  { id: 'Tungsten_Bar', name: 'Lingote de tungsteno', category: ItemCategory.Bar, description: 'Duro de trabajar, mejor de usar.', sellPrice: 84 },
  { id: 'Platinum_Bar', name: 'Lingote de platino', category: ItemCategory.Bar, description: 'Brilla mas que el oro y aguanta mas.', sellPrice: 150 },
  { id: 'Meteorite_Bar', name: 'Lingote de meteorito', category: ItemCategory.Bar, description: 'Metal caido del cielo.', sellPrice: 320 },
  { id: 'Hellstone_Bar', name: 'Lingote infernal', category: ItemCategory.Bar, description: 'El mejor metal antes del Hardmode.', sellPrice: 700 },

  // ---------------------------------------------------------------- gemas
  { id: 'Amethyst', name: 'Amatista', category: ItemCategory.Gem, description: 'Gema morada comun.', sellPrice: 75 },
  { id: 'Topaz', name: 'Topacio', category: ItemCategory.Gem, description: 'Gema amarilla.', sellPrice: 100 },
  { id: 'Sapphire', name: 'Zafiro', category: ItemCategory.Gem, description: 'Gema azul.', sellPrice: 150 },
  { id: 'Emerald', name: 'Esmeralda', category: ItemCategory.Gem, description: 'Gema verde.', sellPrice: 200 },
  { id: 'Ruby', name: 'Rubi', category: ItemCategory.Gem, description: 'Gema roja, muy buscada.', sellPrice: 300 },
  { id: 'Diamond', name: 'Diamante', category: ItemCategory.Gem, description: 'La gema mas valiosa de las cavernas.', sellPrice: 500 },
  { id: 'Amber', name: 'Ambar', category: ItemCategory.Gem, description: 'Resina fosil del desierto.', sellPrice: 250 },

  // ---------------------------------------------------------------- picos
  { id: 'Copper_Pickaxe', name: 'Pico de cobre', category: ItemCategory.Tool, description: 'El pico con el que todos empiezan.', sellPrice: 20, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 35, damage: 2 } },
  { id: 'Tin_Pickaxe', name: 'Pico de estano', category: ItemCategory.Tool, description: 'Como el de cobre pero pega mas.', sellPrice: 24, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 35, damage: 3 } },
  { id: 'Lead_Pickaxe', name: 'Pico de plomo', category: ItemCategory.Tool, description: 'Alternativa al de hierro, con mas dano.', sellPrice: 100, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 43, damage: 5, autoDps: 2 } },
  { id: 'Tungsten_Pickaxe', name: 'Pico de tungsteno', category: ItemCategory.Tool, description: 'Alternativa al de plata, mas potente.', sellPrice: 200, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 50, damage: 7, autoDps: 7 } },
  { id: 'Platinum_Pickaxe', name: 'Pico de platino', category: ItemCategory.Tool, description: 'Alternativa al de oro. Llega igual a la demonita.', sellPrice: 400, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 59, damage: 10, autoDps: 16 } },
  { id: 'Iron_Pickaxe', name: 'Pico de hierro', category: ItemCategory.Tool, description: 'Primer pico con minado automatico.', sellPrice: 90, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 40, damage: 4, autoDps: 2 } },
  { id: 'Silver_Pickaxe', name: 'Pico de plata', category: ItemCategory.Tool, description: 'Rompe la plata y el oro sin esfuerzo.', sellPrice: 180, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 45, damage: 6, autoDps: 6 } },
  { id: 'Gold_Pickaxe', name: 'Pico de oro', category: ItemCategory.Tool, description: 'Llega a la demonita.', sellPrice: 350, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 55, damage: 8, autoDps: 14 } },
  { id: 'Nightmare_Pickaxe', name: 'Pico pesadilla', category: ItemCategory.Tool, description: 'Atraviesa la ebonita corrupta.', sellPrice: 900, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 65, damage: 15, autoDps: 32 } },
  { id: 'Molten_Pickaxe', name: 'Pico fundido', category: ItemCategory.Tool, description: 'Rompe cualquier cosa del pre-Hardmode.', sellPrice: 2600, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 100, damage: 30, autoDps: 70 } },

  // ---------------------------------------------------------------- hachas
  { id: 'Copper_Axe', name: 'Hacha de cobre', category: ItemCategory.Tool, description: 'Tala arboles despacio pero tala.', sellPrice: 20, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 35, damage: 1 } },
  { id: 'Tin_Axe', name: 'Hacha de estano', category: ItemCategory.Tool, description: 'Un pelin mejor que la de cobre.', sellPrice: 24, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 37, damage: 2 } },
  { id: 'Lead_Axe', name: 'Hacha de plomo', category: ItemCategory.Tool, description: 'Alternativa a la de hierro.', sellPrice: 100, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 47, damage: 4, autoDps: 2 } },
  { id: 'Tungsten_Axe', name: 'Hacha de tungsteno', category: ItemCategory.Tool, description: 'Alternativa a la de plata.', sellPrice: 200, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 52, damage: 6, autoDps: 6 } },
  { id: 'Platinum_Axe', name: 'Hacha de platino', category: ItemCategory.Tool, description: 'Alternativa a la de oro.', sellPrice: 380, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 62, damage: 9, autoDps: 11 } },
  { id: 'Iron_Axe', name: 'Hacha de hierro', category: ItemCategory.Tool, description: 'El doble de rapida con la madera.', sellPrice: 90, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 45, damage: 3, autoDps: 2 } },
  { id: 'Iron_Hammer', name: 'Martillo de hierro', category: ItemCategory.Tool, description: 'Rompe ebonita en las zonas corruptas.', sellPrice: 90, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 55, damage: 5, autoDps: 3 } },
  { id: 'Silver_Axe', name: 'Hacha de plata', category: ItemCategory.Tool, description: 'Tala caoba de la jungla.', sellPrice: 180, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 50, damage: 5, autoDps: 5 } },
  { id: 'Gold_Axe', name: 'Hacha de oro', category: ItemCategory.Tool, description: 'Rapida y contundente.', sellPrice: 340, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 60, damage: 8, autoDps: 10 } },
  { id: 'War_Axe_of_the_Night', name: 'Hacha de guerra nocturna', category: ItemCategory.Tool, description: 'Forjada en demonita. Tala lo que sea.', sellPrice: 950, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 70, damage: 18, autoDps: 22 } },
  { id: 'Meteor_Hamaxe', name: 'Martihacha de meteorito', category: ItemCategory.Tool, description: 'Hacha y martillo a la vez, caida del cielo.', sellPrice: 1600, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 80, damage: 26, autoDps: 34 } },

  // ---------------------------------------------------------------- armas
  { id: 'Copper_Shortsword', name: 'Espada corta de cobre', category: ItemCategory.Weapon, description: 'Con esto se empieza la aventura.', sellPrice: 20, slot: EquipmentSlot.Weapon, stats: { damage: 5 } },
  { id: 'Tin_Shortsword', name: 'Espada corta de estano', category: ItemCategory.Weapon, description: 'La otra forma de empezar.', sellPrice: 24, slot: EquipmentSlot.Weapon, stats: { damage: 6 } },
  { id: 'Tin_Broadsword', name: 'Mandoble de estano', category: ItemCategory.Weapon, description: 'Alternativa al de cobre.', sellPrice: 70, slot: EquipmentSlot.Weapon, stats: { damage: 14 } },
  { id: 'Lead_Broadsword', name: 'Mandoble de plomo', category: ItemCategory.Weapon, description: 'Alternativa al de hierro.', sellPrice: 160, slot: EquipmentSlot.Weapon, stats: { damage: 25 } },
  { id: 'Tungsten_Broadsword', name: 'Mandoble de tungsteno', category: ItemCategory.Weapon, description: 'Alternativa al de plata.', sellPrice: 320, slot: EquipmentSlot.Weapon, stats: { damage: 42 } },
  { id: 'Platinum_Broadsword', name: 'Mandoble de platino', category: ItemCategory.Weapon, description: 'Alternativa al de oro. La mejor espada comun.', sellPrice: 540, slot: EquipmentSlot.Weapon, stats: { damage: 64 } },
  { id: 'Wooden_Sword', name: 'Espada de madera', category: ItemCategory.Weapon, description: 'Poco dano, pero es barata.', sellPrice: 10, slot: EquipmentSlot.Weapon, stats: { damage: 7 } },
  { id: 'Copper_Broadsword', name: 'Mandoble de cobre', category: ItemCategory.Weapon, description: 'Hoja ancha, golpe solido.', sellPrice: 60, slot: EquipmentSlot.Weapon, stats: { damage: 12 } },
  { id: 'Iron_Broadsword', name: 'Mandoble de hierro', category: ItemCategory.Weapon, description: 'La espada del pre-hardmode temprano.', sellPrice: 140, slot: EquipmentSlot.Weapon, stats: { damage: 22 } },
  { id: 'Silver_Broadsword', name: 'Mandoble de plata', category: ItemCategory.Weapon, description: 'Rapida y afilada.', sellPrice: 280, slot: EquipmentSlot.Weapon, stats: { damage: 38 } },
  { id: 'Gold_Broadsword', name: 'Mandoble de oro', category: ItemCategory.Weapon, description: 'La mejor espada no corrupta.', sellPrice: 480, slot: EquipmentSlot.Weapon, stats: { damage: 58 } },
  { id: "Light's_Bane", name: 'Perdicion de la luz', category: ItemCategory.Weapon, description: 'Forjada con demonita. Se alimenta de la Corrupcion.', sellPrice: 1200, slot: EquipmentSlot.Weapon, stats: { damage: 95, luck: 0.1 } },
  { id: 'Wooden_Bow', name: 'Arco de madera', category: ItemCategory.Weapon, description: 'Menos dano por golpe pero dispara solo.', sellPrice: 50, slot: EquipmentSlot.Weapon, stats: { damage: 8, autoDps: 6 } },
  { id: 'Slime_Staff', name: 'Baculo de slime', category: ItemCategory.Accessory, description: 'Invoca un slime que ataca por ti. Dropeo rarisimo.', sellPrice: 2000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 25 } },
  { id: "Ball_O'_Hurt", name: 'Bola de dolor', category: ItemCategory.Weapon, description: 'Mangual de la Corrupcion. Golpea solo mientras gira.', sellPrice: 300, slot: EquipmentSlot.Weapon, stats: { damage: 45, autoDps: 12 } },
  { id: 'Vilethorn', name: 'Espina vil', category: ItemCategory.Weapon, description: 'Atraviesa la tierra. Poco golpe, mucho goteo.', sellPrice: 400, slot: EquipmentSlot.Weapon, stats: { damage: 60, autoDps: 30 } },
  { id: 'Blade_of_Grass', name: 'Hoja de hierba', category: ItemCategory.Weapon, description: 'Forjada con esporas y aguijones de la jungla.', sellPrice: 900, slot: EquipmentSlot.Weapon, stats: { damage: 78, autoDps: 8 } },
  { id: 'Thorn_Chakram', name: 'Chakram de espinas', category: ItemCategory.Weapon, description: 'Vuelve solo a tu mano.', sellPrice: 800, slot: EquipmentSlot.Weapon, stats: { damage: 85, autoDps: 15 } },
  { id: 'Bee_Keeper', name: 'Apicultor', category: ItemCategory.Weapon, description: 'De la Abeja Reina. Cada golpe suelta abejas.', sellPrice: 2200, slot: EquipmentSlot.Weapon, stats: { damage: 100, autoDps: 28 } },
  { id: 'Muramasa', name: 'Muramasa', category: ItemCategory.Weapon, description: 'Katana de los cofres de la Mazmorra.', sellPrice: 1400, slot: EquipmentSlot.Weapon, stats: { damage: 85, autoDps: 10 } },
  { id: 'Blue_Moon', name: 'Luna azul', category: ItemCategory.Weapon, description: 'Mangual pesado de la Mazmorra.', sellPrice: 1600, slot: EquipmentSlot.Weapon, stats: { damage: 90, autoDps: 20 } },
  { id: 'Water_Bolt', name: 'Rayo de agua', category: ItemCategory.Weapon, description: 'Libro magico que rebota por las paredes.', sellPrice: 1800, slot: EquipmentSlot.Weapon, stats: { damage: 70, autoDps: 45 } },
  { id: 'Starfury', name: 'Furia estelar', category: ItemCategory.Weapon, description: 'Llama estrellas del cielo con cada golpe.', sellPrice: 2400, slot: EquipmentSlot.Weapon, stats: { damage: 120, autoDps: 25 } },
  { id: 'Space_Gun', name: 'Pistola espacial', category: ItemCategory.Weapon, description: 'Dispara sola sin parar.', sellPrice: 2000, slot: EquipmentSlot.Weapon, stats: { damage: 60, autoDps: 65 } },
  { id: 'Imp_Staff', name: 'Baculo de diablillo', category: ItemCategory.Accessory, description: 'Invoca un diablillo que lucha por ti.', sellPrice: 3000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 55 } },
  { id: 'Flamarang', name: 'Flamerang', category: ItemCategory.Weapon, description: 'Bumeran en llamas.', sellPrice: 3200, slot: EquipmentSlot.Weapon, stats: { damage: 140, autoDps: 30 } },
  { id: 'Fiery_Greatsword', name: 'Mandoble ardiente', category: ItemCategory.Weapon, description: 'Hoja de lingote infernal.', sellPrice: 4200, slot: EquipmentSlot.Weapon, stats: { damage: 155, autoDps: 15 } },
  { id: 'Sunfury', name: 'Furia solar', category: ItemCategory.Weapon, description: 'Mangual del inframundo.', sellPrice: 5200, slot: EquipmentSlot.Weapon, stats: { damage: 175, autoDps: 40 } },
  { id: "Night's_Edge", name: 'Filo nocturno', category: ItemCategory.Weapon, description: 'La espada definitiva del pre-Hardmode: funde cuatro hojas en una.', sellPrice: 9000, slot: EquipmentSlot.Weapon, stats: { damage: 230, autoDps: 45, luck: 0.1 } },

  // ---------------------------------------------------------------- armas magicas
  // Gastan mana por golpe: pegan mas que una espada del mismo momento, pero si
  // te quedas seco el golpe se queda en una cuarta parte.
  { id: 'Amethyst_Staff', name: 'Baculo de amatista', category: ItemCategory.Weapon, description: 'El primer baculo. Gasta 5 de mana por golpe.', sellPrice: 200, slot: EquipmentSlot.Weapon, stats: { damage: 24, manaCost: 5 } },
  { id: 'Topaz_Staff', name: 'Baculo de topacio', category: ItemCategory.Weapon, description: 'Gasta 5 de mana por golpe.', sellPrice: 300, slot: EquipmentSlot.Weapon, stats: { damage: 34, manaCost: 5 } },
  { id: 'Sapphire_Staff', name: 'Baculo de zafiro', category: ItemCategory.Weapon, description: 'Gasta 6 de mana por golpe.', sellPrice: 500, slot: EquipmentSlot.Weapon, stats: { damage: 48, manaCost: 6 } },
  { id: 'Emerald_Staff', name: 'Baculo de esmeralda', category: ItemCategory.Weapon, description: 'Gasta 7 de mana por golpe.', sellPrice: 750, slot: EquipmentSlot.Weapon, stats: { damage: 66, manaCost: 7 } },
  { id: 'Ruby_Staff', name: 'Baculo de rubi', category: ItemCategory.Weapon, description: 'Gasta 8 de mana por golpe.', sellPrice: 1100, slot: EquipmentSlot.Weapon, stats: { damage: 92, manaCost: 8 } },
  { id: 'Diamond_Staff', name: 'Baculo de diamante', category: ItemCategory.Weapon, description: 'El mejor baculo de gema. Gasta 9 de mana.', sellPrice: 1700, slot: EquipmentSlot.Weapon, stats: { damage: 125, manaCost: 9 } },
  { id: 'Aqua_Scepter', name: 'Cetro de agua', category: ItemCategory.Weapon, description: 'Chorro continuo. Gasta 7 de mana y anade DPS pasivo.', sellPrice: 1400, slot: EquipmentSlot.Weapon, stats: { damage: 105, autoDps: 30, manaCost: 7 } },
  { id: 'Magic_Missile', name: 'Misil magico', category: ItemCategory.Weapon, description: 'Lo guias tu. Gasta 10 de mana.', sellPrice: 1800, slot: EquipmentSlot.Weapon, stats: { damage: 140, manaCost: 10 } },
  { id: 'Flower_of_Fire', name: 'Flor de fuego', category: ItemCategory.Weapon, description: 'Bolas de fuego del inframundo. Gasta 12 de mana.', sellPrice: 3400, slot: EquipmentSlot.Weapon, stats: { damage: 185, manaCost: 12 } },
  { id: 'Demon_Scythe', name: 'Guadana demoniaca', category: ItemCategory.Weapon, description: 'La mejor magia del pre-Hardmode. Gasta 14 de mana.', sellPrice: 5000, slot: EquipmentSlot.Weapon, stats: { damage: 240, autoDps: 25, manaCost: 14 } },
  { id: 'Bee_Gun', name: 'Pistola de abejas', category: ItemCategory.Weapon, description: 'De la Abeja Reina. Gasta 9 de mana y suelta abejas.', sellPrice: 2600, slot: EquipmentSlot.Weapon, stats: { damage: 95, autoDps: 45, manaCost: 9 } },

  // ---------------------------------------------------------------- accesorios de mana
  { id: 'Mana_Flower', name: 'Flor de mana', category: ItemCategory.Accessory, description: '+40 de mana maximo y regeneras mas rapido.', sellPrice: 2200, slot: EquipmentSlot.Accessory1, stats: { mana: 40, manaRegen: 4 } },
  { id: 'Band_of_Starpower', name: 'Banda de poder estelar', category: ItemCategory.Accessory, description: '+20 de mana maximo.', sellPrice: 900, slot: EquipmentSlot.Accessory1, stats: { mana: 20, manaRegen: 2 } },
  { id: 'Celestial_Magnet', name: 'Iman celestial', category: ItemCategory.Accessory, description: 'Atrae las estrellas: +6 de regeneracion de mana.', sellPrice: 1600, slot: EquipmentSlot.Accessory1, stats: { manaRegen: 6 } },

  // ---------------------------------------------------------------- armaduras
  { id: 'Copper_Helmet', name: 'Casco de cobre', category: ItemCategory.Armor, description: '+1 de defensa.', sellPrice: 60, slot: EquipmentSlot.Helmet, stats: { defense: 1 } },
  { id: 'Copper_Chainmail', name: 'Cota de cobre', category: ItemCategory.Armor, description: '+2 de defensa.', sellPrice: 100, slot: EquipmentSlot.Chest, stats: { defense: 2 } },
  { id: 'Copper_Greaves', name: 'Grebas de cobre', category: ItemCategory.Armor, description: '+1 de defensa.', sellPrice: 80, slot: EquipmentSlot.Legs, stats: { defense: 1 } },
  { id: 'Tin_Helmet', name: 'Casco de estano', category: ItemCategory.Armor, description: '+1 de defensa.', sellPrice: 70, slot: EquipmentSlot.Helmet, stats: { defense: 1 } },
  { id: 'Tin_Chainmail', name: 'Cota de estano', category: ItemCategory.Armor, description: '+2 de defensa.', sellPrice: 115, slot: EquipmentSlot.Chest, stats: { defense: 2 } },
  { id: 'Tin_Greaves', name: 'Grebas de estano', category: ItemCategory.Armor, description: '+2 de defensa.', sellPrice: 95, slot: EquipmentSlot.Legs, stats: { defense: 2 } },
  { id: 'Lead_Helmet', name: 'Casco de plomo', category: ItemCategory.Armor, description: '+3 de defensa.', sellPrice: 160, slot: EquipmentSlot.Helmet, stats: { defense: 3 } },
  { id: 'Lead_Chainmail', name: 'Cota de plomo', category: ItemCategory.Armor, description: '+3 de defensa.', sellPrice: 250, slot: EquipmentSlot.Chest, stats: { defense: 3 } },
  { id: 'Lead_Greaves', name: 'Grebas de plomo', category: ItemCategory.Armor, description: '+2 de defensa.', sellPrice: 200, slot: EquipmentSlot.Legs, stats: { defense: 2 } },
  { id: 'Tungsten_Helmet', name: 'Casco de tungsteno', category: ItemCategory.Armor, description: '+3 de defensa.', sellPrice: 290, slot: EquipmentSlot.Helmet, stats: { defense: 3 } },
  { id: 'Tungsten_Chainmail', name: 'Cota de tungsteno', category: ItemCategory.Armor, description: '+5 de defensa.', sellPrice: 440, slot: EquipmentSlot.Chest, stats: { defense: 5 } },
  { id: 'Tungsten_Greaves', name: 'Grebas de tungsteno', category: ItemCategory.Armor, description: '+3 de defensa.', sellPrice: 360, slot: EquipmentSlot.Legs, stats: { defense: 3 } },
  { id: 'Platinum_Helmet', name: 'Casco de platino', category: ItemCategory.Armor, description: '+4 de defensa.', sellPrice: 440, slot: EquipmentSlot.Helmet, stats: { defense: 4 } },
  { id: 'Platinum_Chainmail', name: 'Cota de platino', category: ItemCategory.Armor, description: '+6 de defensa.', sellPrice: 680, slot: EquipmentSlot.Chest, stats: { defense: 6 } },
  { id: 'Platinum_Greaves', name: 'Grebas de platino', category: ItemCategory.Armor, description: '+5 de defensa.', sellPrice: 550, slot: EquipmentSlot.Legs, stats: { defense: 5 } },
  { id: 'Iron_Helmet', name: 'Casco de hierro', category: ItemCategory.Armor, description: '+2 de defensa.', sellPrice: 140, slot: EquipmentSlot.Helmet, stats: { defense: 2 } },
  { id: 'Iron_Chainmail', name: 'Cota de hierro', category: ItemCategory.Armor, description: '+3 de defensa.', sellPrice: 220, slot: EquipmentSlot.Chest, stats: { defense: 3 } },
  { id: 'Iron_Greaves', name: 'Grebas de hierro', category: ItemCategory.Armor, description: '+2 de defensa.', sellPrice: 180, slot: EquipmentSlot.Legs, stats: { defense: 2 } },
  { id: 'Gold_Helmet', name: 'Casco de oro', category: ItemCategory.Armor, description: '+3 de defensa.', sellPrice: 400, slot: EquipmentSlot.Helmet, stats: { defense: 3 } },
  { id: 'Gold_Chainmail', name: 'Cota de oro', category: ItemCategory.Armor, description: '+5 de defensa.', sellPrice: 620, slot: EquipmentSlot.Chest, stats: { defense: 5 } },
  { id: 'Gold_Greaves', name: 'Grebas de oro', category: ItemCategory.Armor, description: '+4 de defensa.', sellPrice: 500, slot: EquipmentSlot.Legs, stats: { defense: 4 } },
  { id: 'Shadow_Helmet', name: 'Casco de sombra', category: ItemCategory.Armor, description: '+4 de defensa y dano por click.', sellPrice: 900, slot: EquipmentSlot.Helmet, stats: { defense: 4, damage: 8 } },
  { id: 'Shadow_Scalemail', name: 'Cota de escamas de sombra', category: ItemCategory.Armor, description: '+6 de defensa y dano por click.', sellPrice: 1200, slot: EquipmentSlot.Chest, stats: { defense: 6, damage: 10 } },
  { id: 'Shadow_Greaves', name: 'Grebas de sombra', category: ItemCategory.Armor, description: '+5 de defensa y DPS pasivo.', sellPrice: 1000, slot: EquipmentSlot.Legs, stats: { defense: 5, autoDps: 10 } },
  { id: 'Silver_Helmet', name: 'Casco de plata', category: ItemCategory.Armor, description: '+3 de defensa.', sellPrice: 260, slot: EquipmentSlot.Helmet, stats: { defense: 3 } },
  { id: 'Silver_Chainmail', name: 'Cota de plata', category: ItemCategory.Armor, description: '+4 de defensa.', sellPrice: 400, slot: EquipmentSlot.Chest, stats: { defense: 4 } },
  { id: 'Silver_Greaves', name: 'Grebas de plata', category: ItemCategory.Armor, description: '+3 de defensa.', sellPrice: 330, slot: EquipmentSlot.Legs, stats: { defense: 3 } },
  { id: 'Jungle_Hat', name: 'Sombrero de jungla', category: ItemCategory.Armor, description: '+2 de defensa y DPS pasivo.', sellPrice: 700, slot: EquipmentSlot.Helmet, stats: { defense: 2, autoDps: 12 } },
  { id: 'Jungle_Shirt', name: 'Camisa de jungla', category: ItemCategory.Armor, description: '+3 de defensa y DPS pasivo.', sellPrice: 950, slot: EquipmentSlot.Chest, stats: { defense: 3, autoDps: 16 } },
  { id: 'Jungle_Pants', name: 'Pantalones de jungla', category: ItemCategory.Armor, description: '+2 de defensa, DPS pasivo y suerte.', sellPrice: 800, slot: EquipmentSlot.Legs, stats: { defense: 2, autoDps: 10, luck: 0.1 } },
  { id: 'Meteor_Helmet', name: 'Casco de meteorito', category: ItemCategory.Armor, description: '+5 de defensa, DPS pasivo y regeneracion de mana.', sellPrice: 1500, slot: EquipmentSlot.Helmet, stats: { defense: 5, autoDps: 22, manaRegen: 5, mana: 20 } },
  { id: 'Meteor_Suit', name: 'Traje de meteorito', category: ItemCategory.Armor, description: '+7 de defensa, DPS pasivo y mana maximo.', sellPrice: 2000, slot: EquipmentSlot.Chest, stats: { defense: 7, autoDps: 30, manaRegen: 5, mana: 30 } },
  { id: 'Meteor_Leggings', name: 'Perneras de meteorito', category: ItemCategory.Armor, description: '+6 de defensa, DPS pasivo y mana maximo.', sellPrice: 1700, slot: EquipmentSlot.Legs, stats: { defense: 6, autoDps: 26, manaRegen: 4, mana: 20 } },
  { id: 'Necro_Helmet', name: 'Casco necro', category: ItemCategory.Armor, description: '+4 de defensa y suerte.', sellPrice: 1400, slot: EquipmentSlot.Helmet, stats: { defense: 4, luck: 0.12 } },
  { id: 'Necro_Breastplate', name: 'Peto necro', category: ItemCategory.Armor, description: '+5 de defensa y suerte.', sellPrice: 1900, slot: EquipmentSlot.Chest, stats: { defense: 5, luck: 0.15 } },
  { id: 'Necro_Greaves', name: 'Grebas necro', category: ItemCategory.Armor, description: '+4 de defensa y monedas.', sellPrice: 1600, slot: EquipmentSlot.Legs, stats: { defense: 4, coinBonus: 0.2 } },
  { id: 'Molten_Helmet', name: 'Casco fundido', category: ItemCategory.Armor, description: '+7 de defensa y dano por click.', sellPrice: 4000, slot: EquipmentSlot.Helmet, stats: { defense: 7, damage: 20 } },
  { id: 'Molten_Breastplate', name: 'Peto fundido', category: ItemCategory.Armor, description: '+8 de defensa y dano por click.', sellPrice: 5200, slot: EquipmentSlot.Chest, stats: { defense: 8, damage: 26 } },
  { id: 'Molten_Greaves', name: 'Grebas fundidas', category: ItemCategory.Armor, description: '+7 de defensa y DPS pasivo.', sellPrice: 4400, slot: EquipmentSlot.Legs, stats: { defense: 7, autoDps: 40 } },

  // ---------------------------------------------------------------- accesorios
  { id: 'Hermes_Boots', name: 'Botas de Hermes', category: ItemCategory.Accessory, description: 'Corres mas: +20% de DPS pasivo... y de monedas.', sellPrice: 500, slot: EquipmentSlot.Accessory1, stats: { autoDps: 8, coinBonus: 0.2 } },
  { id: 'Cloud_in_a_Bottle', name: 'Nube en una botella', category: ItemCategory.Accessory, description: 'Un salto extra. Aqui: +10 de dano por click.', sellPrice: 400, slot: EquipmentSlot.Accessory1, stats: { damage: 10 } },
  { id: 'Aglet', name: 'Herrete', category: ItemCategory.Accessory, description: 'Pequeno pero suma.', sellPrice: 200, slot: EquipmentSlot.Accessory1, stats: { autoDps: 4 } },
  { id: 'Shackle', name: 'Grillete', category: ItemCategory.Accessory, description: '+1 de defensa. Lo sueltan los zombis.', sellPrice: 150, slot: EquipmentSlot.Accessory1, stats: { defense: 1 } },
  { id: 'Band_of_Regeneration', name: 'Banda de regeneracion', category: ItemCategory.Accessory, description: 'Regeneras vida mas rapido.', sellPrice: 600, slot: EquipmentSlot.Accessory1, stats: { regen: 3 } },
  { id: 'Lucky_Horseshoe', name: 'Herradura de la suerte', category: ItemCategory.Accessory, description: '+25% de probabilidad en drops raros.', sellPrice: 700, slot: EquipmentSlot.Accessory1, stats: { luck: 0.25 } },
  { id: 'Grappling_Hook', name: 'Gancho', category: ItemCategory.Accessory, description: 'Te mueves mas rapido entre nodos: +15% de DPS pasivo.', sellPrice: 450, slot: EquipmentSlot.Accessory1, stats: { autoDps: 6, coinBonus: 0.05 } },
  { id: 'Gold_Crown', name: 'Corona de oro', category: ItemCategory.Material, description: 'Corona de un rey caido. Base de la corona de slime.', sellPrice: 800 },
  { id: 'Anklet_of_the_Wind', name: 'Tobillera del viento', category: ItemCategory.Accessory, description: 'Ligereza de la jungla: +12 de DPS pasivo.', sellPrice: 650, slot: EquipmentSlot.Accessory1, stats: { autoDps: 12 } },
  { id: 'Feral_Claws', name: 'Garras feroces', category: ItemCategory.Accessory, description: 'Golpeas mas rapido: +18 de dano por click.', sellPrice: 900, slot: EquipmentSlot.Accessory1, stats: { damage: 18 } },
  { id: 'Shark_Tooth_Necklace', name: 'Collar de diente de tiburon', category: ItemCategory.Accessory, description: 'Ignora parte de la defensa: +22 de dano.', sellPrice: 1100, slot: EquipmentSlot.Accessory1, stats: { damage: 22 } },
  { id: 'Cobalt_Shield', name: 'Escudo de cobalto', category: ItemCategory.Accessory, description: '+4 de defensa. De los cofres de la Mazmorra.', sellPrice: 1200, slot: EquipmentSlot.Accessory1, stats: { defense: 4 } },
  { id: 'Obsidian_Skull', name: 'Craneo de obsidiana', category: ItemCategory.Accessory, description: 'Te protege del calor: +3 de defensa y regeneracion.', sellPrice: 1000, slot: EquipmentSlot.Accessory1, stats: { defense: 3, regen: 2 } },
  { id: 'Magma_Stone', name: 'Piedra de magma', category: ItemCategory.Accessory, description: 'Tus golpes queman: +35 de dano.', sellPrice: 2400, slot: EquipmentSlot.Accessory1, stats: { damage: 35 } },
  { id: 'Lava_Charm', name: 'Amuleto de lava', category: ItemCategory.Accessory, description: 'Aguantas en el infierno: +5 de defensa y regeneracion.', sellPrice: 2800, slot: EquipmentSlot.Accessory1, stats: { defense: 5, regen: 4 } },
  { id: 'Rocket_Boots', name: 'Botas cohete', category: ItemCategory.Accessory, description: 'Vuelas entre nodos: +25 de DPS pasivo.', sellPrice: 1800, slot: EquipmentSlot.Accessory1, stats: { autoDps: 25 } },
  { id: 'Flipper', name: 'Aletas', category: ItemCategory.Accessory, description: 'Nadas mejor. Aqui: +10% de monedas.', sellPrice: 350, slot: EquipmentSlot.Accessory1, stats: { coinBonus: 0.1 } },
  { id: 'Diving_Helmet', name: 'Casco de buceo', category: ItemCategory.Accessory, description: '+2 de defensa y suerte.', sellPrice: 800, slot: EquipmentSlot.Accessory1, stats: { defense: 2, luck: 0.1 } },
  { id: "Nature's_Gift", name: 'Regalo de la naturaleza', category: ItemCategory.Accessory, description: 'Flor de la jungla: +20% de suerte.', sellPrice: 1500, slot: EquipmentSlot.Accessory1, stats: { luck: 0.2 } },
  { id: 'Shiny_Red_Balloon', name: 'Globo rojo brillante', category: ItemCategory.Accessory, description: 'Salto extra: +15 de dano por click.', sellPrice: 900, slot: EquipmentSlot.Accessory1, stats: { damage: 15 } },
  { id: 'Depth_Meter', name: 'Medidor de profundidad', category: ItemCategory.Accessory, description: '+15% de monedas.', sellPrice: 550, slot: EquipmentSlot.Accessory1, stats: { coinBonus: 0.15 } },

  // ---------------------------------------------------------------- estaciones
  { id: 'Work_Bench', name: 'Mesa de trabajo', category: ItemCategory.Station, description: 'Desbloquea las recetas basicas.', sellPrice: 0 },
  { id: 'Furnace', name: 'Horno', category: ItemCategory.Station, description: 'Funde minerales en lingotes.', sellPrice: 0 },
  { id: 'Iron_Anvil', name: 'Yunque de hierro', category: ItemCategory.Station, description: 'Forja herramientas, armas y armaduras.', sellPrice: 0 },
  { id: 'Lead_Anvil', name: 'Yunque de plomo', category: ItemCategory.Station, description: 'Hace exactamente lo mismo que el de hierro.', sellPrice: 0 },
  { id: 'Alchemy_Table', name: 'Mesa de alquimia', category: ItemCategory.Station, description: 'Prepara pociones y polvos.', sellPrice: 0 },
  { id: 'Loom', name: 'Telar', category: ItemCategory.Station, description: 'Hila telaranas en seda.', sellPrice: 0 },
  { id: 'Sawmill', name: 'Aserradero', category: ItemCategory.Station, description: 'Recetas avanzadas de madera.', sellPrice: 0 },
  { id: 'Balloon_Work_Bench', name: 'Mesa de trabajo con globos', category: ItemCategory.Station, description: 'Decorativa. Un guino a la wiki.', sellPrice: 0 },
  { id: 'Chest', name: 'Cofre', category: ItemCategory.Station, description: 'Amplia el almacenamiento. Decorativo por ahora.', sellPrice: 0 },
  { id: 'Hellforge', name: 'Forja infernal', category: ItemCategory.Station, description: 'Lo unico que funde la piedra infernal. Se saca del inframundo.', sellPrice: 0 },
  { iconOnly: true, id: 'Demon_Altar', name: 'Altar demoniaco', category: ItemCategory.Station, description: 'No se puede picar: se usa donde esta. Hay altares en el Subsuelo, las Cavernas y la Corrupcion.', sellPrice: 0 },
  { id: 'Cooking_Pot', name: 'Olla', category: ItemCategory.Station, description: 'Cocina lo que cae de los enemigos.', sellPrice: 0 },
  { id: "Tinkerer's_Workshop", name: 'Taller del inventor', category: ItemCategory.Station, description: 'Combina accesorios en otros mejores.', sellPrice: 0 },
  { id: 'Bookcase', name: 'Estanteria', category: ItemCategory.Station, description: 'Decorativa. Queda bien.', sellPrice: 0 },
  { id: 'Keg', name: 'Barril', category: ItemCategory.Station, description: 'Para la cerveza.', sellPrice: 0 },

  // ---------------------------------------------------------------- consumibles
  { id: 'Lesser_Healing_Potion', name: 'Pocion curativa menor', category: ItemCategory.Consumable, description: 'Recupera 50 de vida.', sellPrice: 20, consumable: { kind: 'heal', amount: 50 } },
  { id: 'Healing_Potion', name: 'Pocion curativa', category: ItemCategory.Consumable, description: 'Recupera 100 de vida.', sellPrice: 60, consumable: { kind: 'heal', amount: 100 } },
  { id: 'Life_Crystal', name: 'Cristal de vida', category: ItemCategory.Consumable, description: 'Aumenta la vida maxima en 20 (max 15).', sellPrice: 200, consumable: { kind: 'maxHealth', amount: 20 } },
  { id: 'Bottled_Water', name: 'Agua embotellada', category: ItemCategory.Consumable, description: 'Base de las pociones.', sellPrice: 5 },
  { id: 'Mana_Crystal', name: 'Cristal de mana', category: ItemCategory.Consumable, description: 'Aumenta el mana maximo en 20 (max 9).', sellPrice: 100, consumable: { kind: 'maxMana', amount: 20 } },
  { id: 'Lesser_Mana_Potion', name: 'Pocion de mana menor', category: ItemCategory.Consumable, description: 'Recupera 50 de mana.', sellPrice: 20, consumable: { kind: 'mana', amount: 50 } },
  { id: 'Mana_Potion', name: 'Pocion de mana', category: ItemCategory.Consumable, description: 'Recupera 100 de mana.', sellPrice: 60, consumable: { kind: 'mana', amount: 100 } },
  { id: 'Magic_Mirror', name: 'Espejo magico', category: ItemCategory.Consumable, description: 'Decorativo. Un recuerdo de casa.', sellPrice: 500 },
  { id: 'Purification_Powder', name: 'Polvo purificador', category: ItemCategory.Consumable, description: 'Limpia la Corrupcion. Decorativo por ahora.', sellPrice: 10 },
  { id: 'Ale', name: 'Cerveza', category: ItemCategory.Consumable, description: 'Recupera 25 de vida. Salud.', sellPrice: 25, consumable: { kind: 'heal', amount: 25 } },
  { id: 'Greater_Healing_Potion', name: 'Pocion curativa mayor', category: ItemCategory.Consumable, description: 'Recupera 200 de vida.', sellPrice: 150, consumable: { kind: 'heal', amount: 200 } },
  { id: 'Bowl_of_Soup', name: 'Cuenco de sopa', category: ItemCategory.Consumable, description: 'Recupera 80 de vida.', sellPrice: 70, consumable: { kind: 'heal', amount: 80 } },
  { id: 'Honeyfin', name: 'Pez de miel', category: ItemCategory.Consumable, description: 'Recupera 120 de vida.', sellPrice: 100, consumable: { kind: 'heal', amount: 120 } },

  // ---------------------------------------------------------------- invocaciones
  { id: 'Slime_Crown', name: 'Corona de slime', category: ItemCategory.Summon, description: 'Invoca al Rey Slime.', sellPrice: 0, summons: 'king_slime' },
  { id: 'Suspicious_Looking_Eye', name: 'Ojo de aspecto sospechoso', category: ItemCategory.Summon, description: 'Invoca al Ojo de Cthulhu. Solo de noche, dicen.', sellPrice: 0, summons: 'eye_of_cthulhu' },
  { id: 'Worm_Food', name: 'Comida de gusano', category: ItemCategory.Summon, description: 'Invoca al Devorador de Mundos en la Corrupcion.', sellPrice: 0, summons: 'eater_of_worlds' },
  { id: 'Abeemination', name: 'Abejominacion', category: ItemCategory.Summon, description: 'Invoca a la Abeja Reina en la Jungla.', sellPrice: 0, summons: 'queen_bee' },
  { id: 'Clothier_Voodoo_Doll', name: 'Muneco vudu del sastre', category: ItemCategory.Summon, description: 'Invoca a Esqueletron en la Mazmorra.', sellPrice: 0, summons: 'skeletron' },
  { id: 'Guide_Voodoo_Doll', name: 'Muneco vudu de la guia', category: ItemCategory.Summon, description: 'Invoca al Muro de Carne en el Infierno.', sellPrice: 0, summons: 'wall_of_flesh' },


  // ================================================================ HARDMODE
  // Todo lo que sigue se desbloquea al derrotar al Muro de Carne.

  // ---------------------------------------------------------------- minerales
  { id: 'Cobalt_Ore', name: 'Mineral de cobalto', category: ItemCategory.Material, description: 'Aparece por el mundo tras romper el Muro de Carne.', sellPrice: 400 },
  { id: 'Palladium_Ore', name: 'Mineral de paladio', category: ItemCategory.Material, description: 'La alternativa al cobalto.', sellPrice: 440 },
  { id: 'Mythril_Ore', name: 'Mineral de mitrilo', category: ItemCategory.Material, description: 'Segundo escalon del Hardmode. Necesita pico de cobalto.', sellPrice: 700 },
  { id: 'Orichalcum_Ore', name: 'Mineral de oricalco', category: ItemCategory.Material, description: 'La alternativa al mitrilo.', sellPrice: 760 },
  { id: 'Adamantite_Ore', name: 'Mineral de adamantita', category: ItemCategory.Material, description: 'Tercer escalon. Solo cede ante un pico de mitrilo.', sellPrice: 1200 },
  { id: 'Titanium_Ore', name: 'Mineral de titanio', category: ItemCategory.Material, description: 'La alternativa a la adamantita.', sellPrice: 1300 },
  { id: 'Chlorophyte_Ore', name: 'Mineral de clorofita', category: ItemCategory.Material, description: 'Crece en la selva profunda. Exige potencia 200.', sellPrice: 2200 },
  { id: 'Pearlstone_Block', name: 'Bloque de piedra perlada', category: ItemCategory.Material, description: 'La roca del Sagrado.', sellPrice: 60 },
  { id: 'Crystal_Shard', name: 'Fragmento de cristal', category: ItemCategory.Material, description: 'Crece en las paredes del Sagrado subterraneo.', sellPrice: 320 },
  { id: 'Lihzahrd_Brick', name: 'Ladrillo lihzahrd', category: ItemCategory.Material, description: 'Los muros del Templo. Solo los rompe la sierra de Golem.', sellPrice: 900 },
  { id: 'Luminite', name: 'Luminita', category: ItemCategory.Material, description: 'Cae del Senor de la Luna. El ultimo mineral.', sellPrice: 6000 },

  // ---------------------------------------------------------------- lingotes
  { id: 'Cobalt_Bar', name: 'Lingote de cobalto', category: ItemCategory.Bar, description: 'Se funde en la forja infernal.', sellPrice: 1400 },
  { id: 'Palladium_Bar', name: 'Lingote de paladio', category: ItemCategory.Bar, description: 'Se funde en la forja infernal.', sellPrice: 1550 },
  { id: 'Mythril_Bar', name: 'Lingote de mitrilo', category: ItemCategory.Bar, description: 'Base del yunque de mitrilo.', sellPrice: 2400 },
  { id: 'Orichalcum_Bar', name: 'Lingote de oricalco', category: ItemCategory.Bar, description: 'La alternativa al mitrilo.', sellPrice: 2600 },
  { id: 'Adamantite_Bar', name: 'Lingote de adamantita', category: ItemCategory.Bar, description: 'Solo se funde en una forja de adamantita.', sellPrice: 4200 },
  { id: 'Titanium_Bar', name: 'Lingote de titanio', category: ItemCategory.Bar, description: 'Solo se funde en una forja de titanio.', sellPrice: 4500 },
  { id: 'Chlorophyte_Bar', name: 'Lingote de clorofita', category: ItemCategory.Bar, description: 'Verde y palpitante.', sellPrice: 7000 },
  { id: 'Hallowed_Bar', name: 'Lingote sagrado', category: ItemCategory.Bar, description: 'Solo lo sueltan los tres jefes mecanicos.', sellPrice: 9000 },
  { id: 'Luminite_Bar', name: 'Lingote de luminita', category: ItemCategory.Bar, description: 'Se funde en el manipulador antiguo.', sellPrice: 18000 },

  // ---------------------------------------------------------------- almas y esencias
  { id: 'Soul_of_Light', name: 'Alma de luz', category: ItemCategory.Material, description: 'La sueltan las criaturas del Sagrado.', sellPrice: 1000 },
  { id: 'Soul_of_Night', name: 'Alma de noche', category: ItemCategory.Material, description: 'La sueltan las criaturas de la Corrupcion profunda.', sellPrice: 1000 },
  { id: 'Soul_of_Flight', name: 'Alma de vuelo', category: ItemCategory.Material, description: 'De los wyverns que cruzan el cielo.', sellPrice: 1400 },
  { id: 'Soul_of_Might', name: 'Alma de poder', category: ItemCategory.Material, description: 'Del Destructor.', sellPrice: 3000 },
  { id: 'Soul_of_Sight', name: 'Alma de vista', category: ItemCategory.Material, description: 'De los Gemelos.', sellPrice: 3000 },
  { id: 'Soul_of_Fright', name: 'Alma de miedo', category: ItemCategory.Material, description: 'De Esqueletron Primigenio.', sellPrice: 3000 },
  { id: 'Pixie_Dust', name: 'Polvo de hada', category: ItemCategory.Material, description: 'Brilla como si fuera de dia.', sellPrice: 250 },
  { id: 'Unicorn_Horn', name: 'Cuerno de unicornio', category: ItemCategory.Material, description: 'Duro como el diamante.', sellPrice: 900 },
  { id: 'Light_Shard', name: 'Fragmento de luz', category: ItemCategory.Material, description: 'De las momias del Sagrado.', sellPrice: 1600 },
  { id: 'Dark_Shard', name: 'Fragmento oscuro', category: ItemCategory.Material, description: 'De las momias corruptas.', sellPrice: 1600 },
  { id: 'Ectoplasm', name: 'Ectoplasma', category: ItemCategory.Material, description: 'De los espectros de la Mazmorra en Hardmode.', sellPrice: 2500 },
  { id: 'Beetle_Husk', name: 'Caparazon de escarabajo', category: ItemCategory.Material, description: 'De Golem.', sellPrice: 5000 },
  { id: 'Solar_Fragment', name: 'Fragmento solar', category: ItemCategory.Material, description: 'Energia de los pilares celestiales.', sellPrice: 8000 },
  { id: 'Broken_Hero_Sword', name: 'Espada de heroe rota', category: ItemCategory.Material, description: 'Con ella se forjan las hojas verdaderas.', sellPrice: 5000 },
  { id: 'Temple_Key', name: 'Llave del templo', category: ItemCategory.Material, description: 'La suelta Plantera. Abre el Templo Lihzahrd.', sellPrice: 0 },

  // ---------------------------------------------------------------- picos
  { id: 'Cobalt_Pickaxe', name: 'Pico de cobalto', category: ItemCategory.Tool, description: 'Potencia 110: el primer pico del Hardmode.', sellPrice: 6000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 110, damage: 55, autoDps: 120 } },
  { id: 'Palladium_Pickaxe', name: 'Pico de paladio', category: ItemCategory.Tool, description: 'Potencia 115.', sellPrice: 6600, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 115, damage: 60, autoDps: 132 } },
  { id: 'Mythril_Pickaxe', name: 'Pico de mitrilo', category: ItemCategory.Tool, description: 'Potencia 150: abre la adamantita.', sellPrice: 12000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 150, damage: 90, autoDps: 210 } },
  { id: 'Orichalcum_Pickaxe', name: 'Pico de oricalco', category: ItemCategory.Tool, description: 'Potencia 155.', sellPrice: 13000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 155, damage: 96, autoDps: 225 } },
  { id: 'Adamantite_Pickaxe', name: 'Pico de adamantita', category: ItemCategory.Tool, description: 'Potencia 180.', sellPrice: 22000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 180, damage: 140, autoDps: 330 } },
  { id: 'Titanium_Pickaxe', name: 'Pico de titanio', category: ItemCategory.Tool, description: 'Potencia 185.', sellPrice: 24000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 185, damage: 150, autoDps: 350 } },
  { id: 'Pickaxe_Axe', name: 'Pico-hacha', category: ItemCategory.Tool, description: 'Potencia 200: de los tres jefes mecanicos. Abre la clorofita.', sellPrice: 40000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 200, damage: 210, autoDps: 480 } },
  { id: 'Drax', name: 'Taladro-hacha', category: ItemCategory.Tool, description: 'Potencia 200, mas rapido que el pico-hacha.', sellPrice: 40000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 200, damage: 190, autoDps: 560 } },
  { id: 'Chlorophyte_Pickaxe', name: 'Pico de clorofita', category: ItemCategory.Tool, description: 'Potencia 200 y muchisimo DPS pasivo.', sellPrice: 60000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 200, damage: 260, autoDps: 720 } },
  { id: 'Picksaw', name: 'Sierra-pico', category: ItemCategory.Tool, description: 'Potencia 210: lo suelta Golem y rompe el ladrillo lihzahrd.', sellPrice: 90000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 210, damage: 320, autoDps: 900 } },

  // ---------------------------------------------------------------- hachas
  { id: 'Cobalt_Waraxe', name: 'Hacha de guerra de cobalto', category: ItemCategory.Tool, description: 'Potencia 100 de hacha.', sellPrice: 6000, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 100, damage: 50, autoDps: 90 } },
  { id: 'Mythril_Waraxe', name: 'Hacha de guerra de mitrilo', category: ItemCategory.Tool, description: 'Potencia 110 de hacha.', sellPrice: 12000, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 110, damage: 85, autoDps: 160 } },
  { id: 'Adamantite_Waraxe', name: 'Hacha de guerra de adamantita', category: ItemCategory.Tool, description: 'Potencia 125 de hacha.', sellPrice: 22000, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 125, damage: 130, autoDps: 260 } },
  { id: 'Chlorophyte_Greataxe', name: 'Hacha grande de clorofita', category: ItemCategory.Tool, description: 'Potencia 150 de hacha.', sellPrice: 60000, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 150, damage: 240, autoDps: 480 } },
  { id: 'Pwnhammer', name: 'Martillo devastador', category: ItemCategory.Tool, description: 'Lo suelta el Muro de Carne. Rompe altares... y el equilibrio.', sellPrice: 8000, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 90, damage: 45, autoDps: 60 } },

  // ---------------------------------------------------------------- armas
  { id: 'Cobalt_Sword', name: 'Espada de cobalto', category: ItemCategory.Weapon, description: 'Primera espada del Hardmode.', sellPrice: 7000, slot: EquipmentSlot.Weapon, stats: { damage: 300 } },
  { id: 'Palladium_Sword', name: 'Espada de paladio', category: ItemCategory.Weapon, description: 'Alternativa al cobalto.', sellPrice: 7600, slot: EquipmentSlot.Weapon, stats: { damage: 320 } },
  { id: 'Mythril_Sword', name: 'Espada de mitrilo', category: ItemCategory.Weapon, description: 'Segundo escalon.', sellPrice: 14000, slot: EquipmentSlot.Weapon, stats: { damage: 420 } },
  { id: 'Orichalcum_Sword', name: 'Espada de oricalco', category: ItemCategory.Weapon, description: 'Alternativa al mitrilo.', sellPrice: 15000, slot: EquipmentSlot.Weapon, stats: { damage: 445 } },
  { id: 'Adamantite_Sword', name: 'Espada de adamantita', category: ItemCategory.Weapon, description: 'Tercer escalon.', sellPrice: 26000, slot: EquipmentSlot.Weapon, stats: { damage: 580 } },
  { id: 'Titanium_Sword', name: 'Espada de titanio', category: ItemCategory.Weapon, description: 'Alternativa a la adamantita.', sellPrice: 28000, slot: EquipmentSlot.Weapon, stats: { damage: 610 } },
  { id: 'Excalibur', name: 'Excalibur', category: ItemCategory.Weapon, description: 'Forjada con lingotes sagrados.', sellPrice: 45000, slot: EquipmentSlot.Weapon, stats: { damage: 820, luck: 0.1 } },
  { id: 'True_Excalibur', name: 'Excalibur verdadera', category: ItemCategory.Weapon, description: 'Excalibur reforjada con una espada de heroe rota.', sellPrice: 70000, slot: EquipmentSlot.Weapon, stats: { damage: 1050, autoDps: 200 } },
  { id: "True_Night's_Edge", name: 'Filo nocturno verdadero', category: ItemCategory.Weapon, description: 'El Filo Nocturno despierta en Hardmode.', sellPrice: 70000, slot: EquipmentSlot.Weapon, stats: { damage: 1100, autoDps: 180 } },
  { id: 'Terra_Blade', name: 'Hoja de Terra', category: ItemCategory.Weapon, description: 'La fusion de las dos hojas verdaderas. La espada de la portada.', sellPrice: 160000, slot: EquipmentSlot.Weapon, stats: { damage: 1600, autoDps: 420, luck: 0.15 } },
  { id: 'Chlorophyte_Saber', name: 'Sable de clorofita', category: ItemCategory.Weapon, description: 'Deja un rastro de esporas.', sellPrice: 55000, slot: EquipmentSlot.Weapon, stats: { damage: 900, autoDps: 260 } },
  { id: 'Death_Sickle', name: 'Guadana de la muerte', category: ItemCategory.Weapon, description: 'De los segadores de la Mazmorra.', sellPrice: 80000, slot: EquipmentSlot.Weapon, stats: { damage: 1200, autoDps: 320 } },
  { id: 'Megashark', name: 'Megatiburon', category: ItemCategory.Weapon, description: 'Dispara sin parar: muchisimo DPS pasivo.', sellPrice: 90000, slot: EquipmentSlot.Weapon, stats: { damage: 700, autoDps: 900 } },
  { id: 'Optic_Staff', name: 'Baculo optico', category: ItemCategory.Accessory, description: 'Invoca dos ojos que luchan por ti.', sellPrice: 70000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 420 } },
  { id: 'Rainbow_Rod', name: 'Vara de arcoiris', category: ItemCategory.Weapon, description: 'Magia del Sagrado. Gasta 20 de mana.', sellPrice: 60000, slot: EquipmentSlot.Weapon, stats: { damage: 950, manaCost: 20 } },
  { id: 'Crystal_Storm', name: 'Tormenta de cristal', category: ItemCategory.Weapon, description: 'Lluvia de cristales. Gasta 16 de mana.', sellPrice: 50000, slot: EquipmentSlot.Weapon, stats: { damage: 700, autoDps: 380, manaCost: 16 } },
  { id: 'Cursed_Flames', name: 'Llamas malditas', category: ItemCategory.Weapon, description: 'Fuego verde que no se apaga. Gasta 22 de mana.', sellPrice: 75000, slot: EquipmentSlot.Weapon, stats: { damage: 1150, manaCost: 22 } },
  { id: 'Golden_Shower', name: 'Lluvia dorada', category: ItemCategory.Weapon, description: 'Icor a presion. Gasta 18 de mana.', sellPrice: 65000, slot: EquipmentSlot.Weapon, stats: { damage: 1000, autoDps: 200, manaCost: 18 } },
  { id: 'Meowmere', name: 'Meowmere', category: ItemCategory.Weapon, description: 'Dispara gatos. Del Senor de la Luna.', sellPrice: 400000, slot: EquipmentSlot.Weapon, stats: { damage: 3600, autoDps: 900, luck: 0.2 } },
  { id: 'Star_Wrath', name: 'Ira estelar', category: ItemCategory.Weapon, description: 'Llama estrellas de verdad. Del Senor de la Luna.', sellPrice: 380000, slot: EquipmentSlot.Weapon, stats: { damage: 3300, autoDps: 1100 } },
  { id: 'Influx_Waver', name: 'Ondulador de influjo', category: ItemCategory.Weapon, description: 'Corta el espacio. Del Senor de la Luna.', sellPrice: 380000, slot: EquipmentSlot.Weapon, stats: { damage: 3400, autoDps: 800 } },

  // ---------------------------------------------------------------- armaduras
  { id: 'Cobalt_Helmet', name: 'Casco de cobalto', category: ItemCategory.Armor, description: '+8 de defensa.', sellPrice: 8000, slot: EquipmentSlot.Helmet, stats: { defense: 8, damage: 40 } },
  { id: 'Cobalt_Breastplate', name: 'Peto de cobalto', category: ItemCategory.Armor, description: '+9 de defensa.', sellPrice: 10000, slot: EquipmentSlot.Chest, stats: { defense: 9, damage: 50 } },
  { id: 'Cobalt_Leggings', name: 'Perneras de cobalto', category: ItemCategory.Armor, description: '+8 de defensa.', sellPrice: 9000, slot: EquipmentSlot.Legs, stats: { defense: 8, autoDps: 80 } },
  { id: 'Palladium_Helmet', name: 'Casco de paladio', category: ItemCategory.Armor, description: '+9 de defensa y regeneracion.', sellPrice: 8800, slot: EquipmentSlot.Helmet, stats: { defense: 9, regen: 8 } },
  { id: 'Palladium_Breastplate', name: 'Peto de paladio', category: ItemCategory.Armor, description: '+10 de defensa y regeneracion.', sellPrice: 11000, slot: EquipmentSlot.Chest, stats: { defense: 10, regen: 10 } },
  { id: 'Palladium_Leggings', name: 'Perneras de paladio', category: ItemCategory.Armor, description: '+9 de defensa y regeneracion.', sellPrice: 9900, slot: EquipmentSlot.Legs, stats: { defense: 9, regen: 8 } },
  { id: 'Mythril_Helmet', name: 'Casco de mitrilo', category: ItemCategory.Armor, description: '+10 de defensa.', sellPrice: 16000, slot: EquipmentSlot.Helmet, stats: { defense: 10, damage: 70 } },
  { id: 'Mythril_Chainmail', name: 'Cota de mitrilo', category: ItemCategory.Armor, description: '+11 de defensa.', sellPrice: 20000, slot: EquipmentSlot.Chest, stats: { defense: 11, damage: 85 } },
  { id: 'Mythril_Greaves', name: 'Grebas de mitrilo', category: ItemCategory.Armor, description: '+10 de defensa.', sellPrice: 18000, slot: EquipmentSlot.Legs, stats: { defense: 10, autoDps: 150 } },
  { id: 'Orichalcum_Helmet', name: 'Casco de oricalco', category: ItemCategory.Armor, description: '+11 de defensa y suerte.', sellPrice: 17000, slot: EquipmentSlot.Helmet, stats: { defense: 11, luck: 0.12 } },
  { id: 'Orichalcum_Breastplate', name: 'Peto de oricalco', category: ItemCategory.Armor, description: '+12 de defensa y suerte.', sellPrice: 21000, slot: EquipmentSlot.Chest, stats: { defense: 12, luck: 0.15 } },
  { id: 'Orichalcum_Leggings', name: 'Perneras de oricalco', category: ItemCategory.Armor, description: '+11 de defensa.', sellPrice: 19000, slot: EquipmentSlot.Legs, stats: { defense: 11, autoDps: 160 } },
  { id: 'Adamantite_Helmet', name: 'Casco de adamantita', category: ItemCategory.Armor, description: '+13 de defensa.', sellPrice: 30000, slot: EquipmentSlot.Helmet, stats: { defense: 13, damage: 120 } },
  { id: 'Adamantite_Breastplate', name: 'Peto de adamantita', category: ItemCategory.Armor, description: '+14 de defensa.', sellPrice: 38000, slot: EquipmentSlot.Chest, stats: { defense: 14, damage: 140 } },
  { id: 'Adamantite_Leggings', name: 'Perneras de adamantita', category: ItemCategory.Armor, description: '+13 de defensa.', sellPrice: 34000, slot: EquipmentSlot.Legs, stats: { defense: 13, autoDps: 260 } },
  { id: 'Titanium_Helmet', name: 'Casco de titanio', category: ItemCategory.Armor, description: '+14 de defensa.', sellPrice: 32000, slot: EquipmentSlot.Helmet, stats: { defense: 14, damage: 130 } },
  { id: 'Titanium_Breastplate', name: 'Peto de titanio', category: ItemCategory.Armor, description: '+15 de defensa.', sellPrice: 40000, slot: EquipmentSlot.Chest, stats: { defense: 15, damage: 150 } },
  { id: 'Titanium_Leggings', name: 'Perneras de titanio', category: ItemCategory.Armor, description: '+14 de defensa.', sellPrice: 36000, slot: EquipmentSlot.Legs, stats: { defense: 14, autoDps: 280 } },
  { id: 'Hallowed_Helmet', name: 'Casco sagrado', category: ItemCategory.Armor, description: '+16 de defensa. De los jefes mecanicos.', sellPrice: 60000, slot: EquipmentSlot.Helmet, stats: { defense: 16, damage: 180 } },
  { id: 'Hallowed_Plate_Mail', name: 'Coraza sagrada', category: ItemCategory.Armor, description: '+17 de defensa.', sellPrice: 75000, slot: EquipmentSlot.Chest, stats: { defense: 17, damage: 210 } },
  { id: 'Hallowed_Greaves', name: 'Grebas sagradas', category: ItemCategory.Armor, description: '+16 de defensa.', sellPrice: 68000, slot: EquipmentSlot.Legs, stats: { defense: 16, autoDps: 400 } },
  { id: 'Chlorophyte_Helmet', name: 'Casco de clorofita', category: ItemCategory.Armor, description: '+19 de defensa.', sellPrice: 100000, slot: EquipmentSlot.Helmet, stats: { defense: 19, damage: 260, regen: 10 } },
  { id: 'Chlorophyte_Plate_Mail', name: 'Coraza de clorofita', category: ItemCategory.Armor, description: '+20 de defensa.', sellPrice: 125000, slot: EquipmentSlot.Chest, stats: { defense: 20, damage: 300, regen: 12 } },
  { id: 'Chlorophyte_Greaves', name: 'Grebas de clorofita', category: ItemCategory.Armor, description: '+19 de defensa.', sellPrice: 110000, slot: EquipmentSlot.Legs, stats: { defense: 19, autoDps: 600 } },
  { id: 'Beetle_Helmet', name: 'Casco de escarabajo', category: ItemCategory.Armor, description: '+24 de defensa. La mejor armadura.', sellPrice: 200000, slot: EquipmentSlot.Helmet, stats: { defense: 24, damage: 380 } },
  { id: 'Beetle_Scale_Mail', name: 'Cota de escamas de escarabajo', category: ItemCategory.Armor, description: '+25 de defensa.', sellPrice: 250000, slot: EquipmentSlot.Chest, stats: { defense: 25, damage: 440 } },
  { id: 'Beetle_Leggings', name: 'Perneras de escarabajo', category: ItemCategory.Armor, description: '+24 de defensa.', sellPrice: 220000, slot: EquipmentSlot.Legs, stats: { defense: 24, autoDps: 900 } },

  // ---------------------------------------------------------------- accesorios
  { id: 'Spectre_Boots', name: 'Botas espectrales', category: ItemCategory.Accessory, description: 'Botas cohete y de Hermes en una.', sellPrice: 12000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 120, coinBonus: 0.25 } },
  { id: 'Lightning_Boots', name: 'Botas relampago', category: ItemCategory.Accessory, description: 'Aun mas rapidas.', sellPrice: 30000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 260, coinBonus: 0.3 } },
  { id: 'Frostspark_Boots', name: 'Botas de chispa helada', category: ItemCategory.Accessory, description: 'Las mejores botas.', sellPrice: 60000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 420, coinBonus: 0.35 } },
  { id: 'Obsidian_Shield', name: 'Escudo de obsidiana', category: ItemCategory.Accessory, description: '+8 de defensa.', sellPrice: 14000, slot: EquipmentSlot.Accessory1, stats: { defense: 8 } },
  { id: 'Ankh_Shield', name: 'Escudo de Ankh', category: ItemCategory.Accessory, description: '+14 de defensa. El escudo definitivo.', sellPrice: 90000, slot: EquipmentSlot.Accessory1, stats: { defense: 14, regen: 6 } },
  { id: 'Cross_Necklace', name: 'Collar de la cruz', category: ItemCategory.Accessory, description: '+10 de defensa tras recibir un golpe.', sellPrice: 40000, slot: EquipmentSlot.Accessory1, stats: { defense: 10 } },
  { id: 'Charm_of_Myths', name: 'Amuleto de los mitos', category: ItemCategory.Accessory, description: 'Regeneras mucho mas y las pociones tardan menos.', sellPrice: 70000, slot: EquipmentSlot.Accessory1, stats: { regen: 20, defense: 4 } },
  { id: "Philosopher's_Stone", name: 'Piedra filosofal', category: ItemCategory.Accessory, description: 'Acorta la espera entre pociones.', sellPrice: 35000, slot: EquipmentSlot.Accessory1, stats: { regen: 12 } },
  { id: 'Star_Veil', name: 'Velo estelar', category: ItemCategory.Accessory, description: '+6 de defensa y regeneracion tras el golpe.', sellPrice: 50000, slot: EquipmentSlot.Accessory1, stats: { defense: 6, regen: 10 } },
  { id: 'Fire_Gauntlet', name: 'Guantelete de fuego', category: ItemCategory.Accessory, description: 'Tus golpes queman: +320 de dano.', sellPrice: 80000, slot: EquipmentSlot.Accessory1, stats: { damage: 320 } },
  { id: 'Destroyer_Emblem', name: 'Emblema del destructor', category: ItemCategory.Accessory, description: '+280 de dano y +12% de suerte.', sellPrice: 75000, slot: EquipmentSlot.Accessory1, stats: { damage: 280, luck: 0.12 } },
  { id: 'Avenger_Emblem', name: 'Emblema del vengador', category: ItemCategory.Accessory, description: '+180 de dano.', sellPrice: 45000, slot: EquipmentSlot.Accessory1, stats: { damage: 180 } },
  { id: 'Angel_Wings', name: 'Alas de angel', category: ItemCategory.Accessory, description: 'Vuelas: mucho DPS pasivo y monedas.', sellPrice: 55000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 340, coinBonus: 0.2 } },
  { id: 'Fledgling_Wings', name: 'Alas de principiante', category: ItemCategory.Accessory, description: 'Unas alitas de nada, pero vuelan.', sellPrice: 9000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 90 } },

  // ---------------------------------------------------------------- estaciones
  { id: 'Mythril_Anvil', name: 'Yunque de mitrilo', category: ItemCategory.Station, description: 'Forja todo lo de mitrilo en adelante.', sellPrice: 0 },
  { id: 'Orichalcum_Anvil', name: 'Yunque de oricalco', category: ItemCategory.Station, description: 'Hace lo mismo que el de mitrilo.', sellPrice: 0 },
  { id: 'Adamantite_Forge', name: 'Forja de adamantita', category: ItemCategory.Station, description: 'Lo unico que funde adamantita y titanio.', sellPrice: 0 },
  { id: 'Titanium_Forge', name: 'Forja de titanio', category: ItemCategory.Station, description: 'Hace lo mismo que la de adamantita.', sellPrice: 0 },
  { id: 'Autohammer', name: 'Automartillo', category: ItemCategory.Station, description: 'Convierte la clorofita en lingotes.', sellPrice: 0 },
  { id: 'Ancient_Manipulator', name: 'Manipulador antiguo', category: ItemCategory.Station, description: 'Del Senor de la Luna. Trabaja la luminita.', sellPrice: 0 },
  { id: 'Crystal_Ball', name: 'Bola de cristal', category: ItemCategory.Station, description: 'Decorativa, pero queda bien.', sellPrice: 0 },

  // ---------------------------------------------------------------- consumibles e invocaciones
  { id: 'Life_Fruit', name: 'Fruta de vida', category: ItemCategory.Consumable, description: 'Crece en la selva profunda. Sube la vida maxima 5 (max 20).', sellPrice: 2000, consumable: { kind: 'maxHealthFruit', amount: 5 } },
  { id: 'Super_Healing_Potion', name: 'Pocion curativa suprema', category: ItemCategory.Consumable, description: 'Recupera 400 de vida.', sellPrice: 600, consumable: { kind: 'heal', amount: 400 } },
  { id: 'Lifeforce_Potion', name: 'Pocion de fuerza vital', category: ItemCategory.Consumable, description: 'Recupera 300 de vida.', sellPrice: 400, consumable: { kind: 'heal', amount: 300 } },
  { id: 'Mechanical_Eye', name: 'Ojo mecanico', category: ItemCategory.Summon, description: 'Invoca a los Gemelos en el Sagrado.', sellPrice: 0, summons: 'the_twins' },
  { id: 'Mechanical_Worm', name: 'Gusano mecanico', category: ItemCategory.Summon, description: 'Invoca al Destructor en la Corrupcion profunda.', sellPrice: 0, summons: 'the_destroyer' },
  { id: 'Mechanical_Skull', name: 'Craneo mecanico', category: ItemCategory.Summon, description: 'Invoca a Esqueletron Primigenio en la Mazmorra.', sellPrice: 0, summons: 'skeletron_prime' },
  { id: "Plantera's_Bulb", name: 'Bulbo de Plantera', category: ItemCategory.Summon, description: 'Invoca a Plantera en la selva profunda.', sellPrice: 0, summons: 'plantera' },
  { id: 'Lihzahrd_Power_Cell', name: 'Celula de energia lihzahrd', category: ItemCategory.Summon, description: 'Despierta a Golem en el Templo.', sellPrice: 0, summons: 'golem' },
  { id: 'Celestial_Sigil', name: 'Sello celestial', category: ItemCategory.Summon, description: 'Invoca al Senor de la Luna. Ultimo aviso.', sellPrice: 0, summons: 'moon_lord' },

  // ================================================================ EVENTO LUNAR
  // Los cuatro fragmentos celestiales, uno por pilar. Son la moneda del
  // postgame: lo que convierte 4000 bichos muertos en armadura de luminita.
  { id: 'Vortex_Fragment', name: 'Fragmento de vortice', category: ItemCategory.Material, description: 'Del Pilar del Vortice. Zumba como un motor.', sellPrice: 24000 },
  { id: 'Nebula_Fragment', name: 'Fragmento de nebulosa', category: ItemCategory.Material, description: 'Del Pilar de la Nebulosa. Cambia de color si lo miras fijo.', sellPrice: 24000 },
  { id: 'Stardust_Fragment', name: 'Fragmento de polvo estelar', category: ItemCategory.Material, description: 'Del Pilar del Polvo Estelar. Se escapa entre los dedos.', sellPrice: 24000 },
  { id: 'Luminite_Brick', name: 'Ladrillo de luminita', category: ItemCategory.Material, description: 'Luminita trabajada. Brilla en la oscuridad.', sellPrice: 8000 },
  { id: 'Beetle_Shell', name: 'Coraza de escarabajo', category: ItemCategory.Material, description: 'Caparazon de Golem endurecido.', sellPrice: 12000 },

  // ---------------------------------------------------------------- picos de luminita
  // Los cuatro valen exactamente lo mismo (potencia 225): eliges por el
  // fragmento que te sobre, no porque uno sea mejor. Es asi en Terraria.
  { id: 'Solar_Flare_Pickaxe', name: 'Pico de fulgor solar', category: ItemCategory.Tool, description: 'Potencia 225: el pico definitivo, en rojo.', sellPrice: 400000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 225, damage: 900, autoDps: 2600 } },
  { id: 'Vortex_Pickaxe', name: 'Pico de vortice', category: ItemCategory.Tool, description: 'Potencia 225: el pico definitivo, en verde.', sellPrice: 400000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 225, damage: 900, autoDps: 2600 } },
  { id: 'Nebula_Pickaxe', name: 'Pico de nebulosa', category: ItemCategory.Tool, description: 'Potencia 225: el pico definitivo, en morado.', sellPrice: 400000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 225, damage: 900, autoDps: 2600 } },
  { id: 'Stardust_Pickaxe', name: 'Pico de polvo estelar', category: ItemCategory.Tool, description: 'Potencia 225: el pico definitivo, en azul.', sellPrice: 400000, slot: EquipmentSlot.Pickaxe, tool: ToolKind.Pickaxe, stats: { pickPower: 225, damage: 900, autoDps: 2600 } },
  { id: 'Solar_Flare_Axe', name: 'Hacha de fulgor solar', category: ItemCategory.Tool, description: 'Potencia 200 de hacha. Ya no queda arbol que se resista.', sellPrice: 380000, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 200, damage: 820, autoDps: 2200 } },

  // ---------------------------------------------------------------- armas de luminita
  { id: 'Solar_Eruption', name: 'Erupcion solar', category: ItemCategory.Weapon, description: 'Un latigo de lava que atraviesa todo lo que hay delante.', sellPrice: 420000, slot: EquipmentSlot.Weapon, stats: { damage: 4200, autoDps: 1200 } },
  { id: 'Daybreak', name: 'Alba', category: ItemCategory.Weapon, description: 'Lanza solar: lo que clava, arde.', sellPrice: 420000, slot: EquipmentSlot.Weapon, stats: { damage: 3900, autoDps: 1600 } },
  { id: 'Vortex_Beater', name: 'Batidora de vortice', category: ItemCategory.Weapon, description: 'Ametralladora con lanzacohetes de propina.', sellPrice: 420000, slot: EquipmentSlot.Weapon, stats: { damage: 3600, autoDps: 2200 } },
  { id: 'Phantasm', name: 'Fantasma', category: ItemCategory.Weapon, description: 'Arco de vortice: cada flecha se desdobla en cuatro.', sellPrice: 420000, slot: EquipmentSlot.Weapon, stats: { damage: 3800, autoDps: 2000 } },
  { id: 'Nebula_Blaze', name: 'Llamarada de nebulosa', category: ItemCategory.Weapon, description: 'Bolas de fuego rosa que persiguen solas.', sellPrice: 420000, slot: EquipmentSlot.Weapon, stats: { damage: 4400, autoDps: 1100, manaCost: 12 } },
  { id: 'Last_Prism', name: 'Ultimo prisma', category: ItemCategory.Weapon, description: 'Seis rayos que convergen en uno. Se bebe el mana entero.', sellPrice: 480000, slot: EquipmentSlot.Weapon, stats: { damage: 6200, autoDps: 900, manaCost: 30 } },
  { id: 'Nebula_Arcanum', name: 'Arcano de nebulosa', category: ItemCategory.Weapon, description: 'Orbes que dan vueltas y no perdonan.', sellPrice: 440000, slot: EquipmentSlot.Weapon, stats: { damage: 4600, autoDps: 1400, manaCost: 16 } },
  { id: 'Stardust_Dragon_Staff', name: 'Baculo del dragon estelar', category: ItemCategory.Weapon, description: 'Invoca un dragon que crece contigo. DPS pasivo brutal.', sellPrice: 440000, slot: EquipmentSlot.Weapon, stats: { damage: 2400, autoDps: 4200, manaCost: 10 } },
  { id: 'Stardust_Cell_Staff', name: 'Baculo de celulas estelares', category: ItemCategory.Weapon, description: 'Celulas que se dividen sobre el objetivo.', sellPrice: 420000, slot: EquipmentSlot.Weapon, stats: { damage: 2200, autoDps: 3600, manaCost: 10 } },
  { id: 'Lunar_Portal_Staff', name: 'Baculo del portal lunar', category: ItemCategory.Weapon, description: 'Abre una torreta que dispara por ti.', sellPrice: 420000, slot: EquipmentSlot.Weapon, stats: { damage: 2000, autoDps: 3900, manaCost: 14 } },
  { id: 'Rainbow_Crystal_Staff', name: 'Baculo de cristal arcoiris', category: ItemCategory.Weapon, description: 'Un cristal que escupe arcoiris a lo que se acerque.', sellPrice: 430000, slot: EquipmentSlot.Weapon, stats: { damage: 2600, autoDps: 3400, manaCost: 14 } },
  { id: 'Terrarian', name: 'Terrariano', category: ItemCategory.Weapon, description: 'El yoyo del Senor de la Luna, hecho con su trofeo.', sellPrice: 520000, slot: EquipmentSlot.Weapon, stats: { damage: 5200, autoDps: 2600, luck: 0.15 } },
  { id: 'Zenith', name: 'Cenit', category: ItemCategory.Weapon, description: 'Diez espadas en una. No hay nada mas alla de esto.', sellPrice: 900000, slot: EquipmentSlot.Weapon, stats: { damage: 9000, autoDps: 5000, luck: 0.25 } },

  // ---------------------------------------------------------------- armaduras de luminita
  // Cada conjunto empuja una cosa distinta: solar aguanta, vortice y nebulosa
  // pegan, y polvo estelar es el del DPS pasivo.
  { id: 'Solar_Flare_Helmet', name: 'Casco de fulgor solar', category: ItemCategory.Armor, description: '+36 de defensa. El conjunto que mas aguanta.', sellPrice: 400000, slot: EquipmentSlot.Helmet, stats: { defense: 36, damage: 700 } },
  { id: 'Solar_Flare_Breastplate', name: 'Peto de fulgor solar', category: ItemCategory.Armor, description: '+40 de defensa.', sellPrice: 460000, slot: EquipmentSlot.Chest, stats: { defense: 40, damage: 800 } },
  { id: 'Solar_Flare_Leggings', name: 'Perneras de fulgor solar', category: ItemCategory.Armor, description: '+34 de defensa y regeneracion.', sellPrice: 420000, slot: EquipmentSlot.Legs, stats: { defense: 34, damage: 600, regen: 6 } },
  { id: 'Vortex_Helmet', name: 'Casco de vortice', category: ItemCategory.Armor, description: '+26 de defensa y mucho dano por click.', sellPrice: 400000, slot: EquipmentSlot.Helmet, stats: { defense: 26, damage: 1000 } },
  { id: 'Vortex_Breastplate', name: 'Peto de vortice', category: ItemCategory.Armor, description: '+30 de defensa.', sellPrice: 460000, slot: EquipmentSlot.Chest, stats: { defense: 30, damage: 1100 } },
  { id: 'Vortex_Leggings', name: 'Perneras de vortice', category: ItemCategory.Armor, description: '+24 de defensa.', sellPrice: 420000, slot: EquipmentSlot.Legs, stats: { defense: 24, damage: 900, autoDps: 800 } },
  { id: 'Nebula_Helmet', name: 'Casco de nebulosa', category: ItemCategory.Armor, description: '+24 de defensa y el mana casi infinito.', sellPrice: 400000, slot: EquipmentSlot.Helmet, stats: { defense: 24, damage: 1100, mana: 60, manaRegen: 8 } },
  { id: 'Nebula_Breastplate', name: 'Peto de nebulosa', category: ItemCategory.Armor, description: '+28 de defensa.', sellPrice: 460000, slot: EquipmentSlot.Chest, stats: { defense: 28, damage: 1200, mana: 40 } },
  { id: 'Nebula_Leggings', name: 'Perneras de nebulosa', category: ItemCategory.Armor, description: '+22 de defensa.', sellPrice: 420000, slot: EquipmentSlot.Legs, stats: { defense: 22, damage: 1000, manaRegen: 6 } },
  { id: 'Stardust_Helmet', name: 'Casco de polvo estelar', category: ItemCategory.Armor, description: '+25 de defensa y el mejor DPS pasivo del juego.', sellPrice: 400000, slot: EquipmentSlot.Helmet, stats: { defense: 25, damage: 500, autoDps: 2200 } },
  { id: 'Stardust_Plate', name: 'Placa de polvo estelar', category: ItemCategory.Armor, description: '+29 de defensa.', sellPrice: 460000, slot: EquipmentSlot.Chest, stats: { defense: 29, damage: 600, autoDps: 2600 } },
  { id: 'Stardust_Leggings', name: 'Perneras de polvo estelar', category: ItemCategory.Armor, description: '+23 de defensa.', sellPrice: 420000, slot: EquipmentSlot.Legs, stats: { defense: 23, damage: 400, autoDps: 2400 } },

  // ---------------------------------------------------------------- alas y accesorios tardios
  { id: 'Leaf_Wings', name: 'Alas de hoja', category: ItemCategory.Accessory, description: 'Las vende el doctor brujo despues de Plantera.', sellPrice: 120000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 400, regen: 3 } },
  { id: 'Beetle_Wings', name: 'Alas de escarabajo', category: ItemCategory.Accessory, description: 'Las mejores alas del Hardmode.', sellPrice: 260000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 900, defense: 6, regen: 4 } },
  { id: 'Jetpack', name: 'Mochila propulsora', category: ItemCategory.Accessory, description: 'De la ingeniera steampunk. Ruidosa pero eficaz.', sellPrice: 90000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 300, coinBonus: 0.1 } },

  // ================================================================ NPCs
  // ---------------------------------------------------------------- muebles de casa
  // Una casa se paga en madera, y estos tres son lo que la hace habitable:
  // ningun NPC se muda a un agujero con una antorcha.
  { id: 'Wooden_Door', name: 'Puerta de madera', category: ItemCategory.Station, description: 'Sin puerta no hay casa. Requisito para construir una.', sellPrice: 20 },
  { id: 'Wooden_Table', name: 'Mesa de madera', category: ItemCategory.Station, description: 'Mobiliario minimo de una casa habitable.', sellPrice: 25 },
  { id: 'Wooden_Chair', name: 'Silla de madera', category: ItemCategory.Station, description: 'Mobiliario minimo de una casa habitable.', sellPrice: 15 },
  { id: 'Bed', name: 'Cama', category: ItemCategory.Station, description: 'No hace falta para mudar a nadie, pero se agradece.', sellPrice: 200 },
  { id: 'Piggy_Bank', name: 'Hucha', category: ItemCategory.Accessory, description: 'Del mercader. +10% de monedas de todo lo que rompas.', sellPrice: 4000, slot: EquipmentSlot.Accessory1, stats: { coinBonus: 0.1 } },
  { id: 'Safe', name: 'Caja fuerte', category: ItemCategory.Accessory, description: 'Del inventor duende. +20% de monedas.', sellPrice: 40000, slot: EquipmentSlot.Accessory1, stats: { coinBonus: 0.2 } },
  { id: 'Sunflower', name: 'Girasol', category: ItemCategory.Accessory, description: 'De la driada. Da suerte a quien lo lleva encima.', sellPrice: 3000, slot: EquipmentSlot.Accessory1, stats: { luck: 0.06, regen: 2 } },
  { id: 'Solar_Monolith', name: 'Monolito solar', category: ItemCategory.Station, description: 'Del ciborg. Un recuerdo del evento lunar.', sellPrice: 60000 },

  // ---------------------------------------------------------------- genero de las tiendas
  { id: 'Bomb', name: 'Bomba', category: ItemCategory.Consumable, description: 'Revienta el bloque que tengas delante y suelta su botin.', sellPrice: 100, consumable: { kind: 'blastNode', amount: 1 } },
  { id: 'Dynamite', name: 'Dinamita', category: ItemCategory.Consumable, description: 'Revienta el bloque de delante y triplica su botin.', sellPrice: 800, consumable: { kind: 'blastNode', amount: 3 } },
  { id: 'Grenade', name: 'Granada', category: ItemCategory.Consumable, description: 'Del demoledor. Recupera 60 de vida... del susto.', sellPrice: 120, consumable: { kind: 'heal', amount: 60 } },
  { id: 'Sake', name: 'Sake', category: ItemCategory.Consumable, description: 'Del tabernero. Recupera 150 de vida y te deja tan ancho.', sellPrice: 500, consumable: { kind: 'heal', amount: 150 } },
  { id: 'Glowstick', name: 'Barra luminosa', category: ItemCategory.Material, description: 'Ilumina donde una antorcha no aguanta.', sellPrice: 10 },
  { id: 'Rope', name: 'Cuerda', category: ItemCategory.Material, description: 'Para bajar sin partirse las piernas.', sellPrice: 8 },
  { id: 'Wire', name: 'Cable', category: ItemCategory.Material, description: 'De la mecanica. Conecta cosas que no deberian conectarse.', sellPrice: 250 },
  { id: 'Musket_Ball', name: 'Bala de mosquete', category: ItemCategory.Material, description: 'Municion. Se compra por cajas.', sellPrice: 4 },
  { id: 'Silver_Bullet', name: 'Bala de plata', category: ItemCategory.Material, description: 'Municion buena: pega mas que la de plomo.', sellPrice: 12 },
  { id: 'Mining_Helmet', name: 'Casco de minero', category: ItemCategory.Armor, description: 'Del mercader. Ilumina, y algo de defensa.', sellPrice: 800, slot: EquipmentSlot.Helmet, stats: { defense: 2, luck: 0.03 } },
  { id: 'Nurse_Hat', name: 'Gorro de enfermera', category: ItemCategory.Armor, description: 'De la enfermera. Poca defensa, mucha regeneracion.', sellPrice: 3000, slot: EquipmentSlot.Helmet, stats: { defense: 3, regen: 4 } },
  { id: 'Wrench', name: 'Llave inglesa', category: ItemCategory.Tool, description: 'De la mecanica. Coloca cable.', sellPrice: 2000 },
  { id: 'Wire_Cutter', name: 'Cortacables', category: ItemCategory.Tool, description: 'De la mecanica. Lo quita.', sellPrice: 2000 },
  { id: 'Clentaminator', name: 'Clentaminador', category: ItemCategory.Tool, description: 'De la ingeniera steampunk. Cambia el bioma a manguerazos.', sellPrice: 60000 },
  { id: 'Golden_Fishing_Rod', name: 'Cana de pescar dorada', category: ItemCategory.Tool, description: 'Del pescador. Aqui no se pesca, pero se vende bien.', sellPrice: 50000 },

  // ---------------------------------------------------------------- armas de tienda
  { id: 'Flintlock_Pistol', name: 'Pistola de chispa', category: ItemCategory.Weapon, description: 'Del traficante de armas: tu primera arma de fuego.', sellPrice: 1000, slot: EquipmentSlot.Weapon, stats: { damage: 14, autoDps: 6 } },
  { id: 'Musket', name: 'Mosquete', category: ItemCategory.Weapon, description: 'Pega fuerte y despacio.', sellPrice: 2000, slot: EquipmentSlot.Weapon, stats: { damage: 24, autoDps: 8 } },
  { id: 'Revolver', name: 'Revolver', category: ItemCategory.Weapon, description: 'Del traficante de armas, version desierto.', sellPrice: 3000, slot: EquipmentSlot.Weapon, stats: { damage: 28, autoDps: 14 } },
  { id: 'Boomstick', name: 'Recortada', category: ItemCategory.Weapon, description: 'Escopeta de cinco perdigones.', sellPrice: 4000, slot: EquipmentSlot.Weapon, stats: { damage: 34, autoDps: 18 } },
  { id: 'Handgun', name: 'Pistola', category: ItemCategory.Weapon, description: 'Del inventor duende.', sellPrice: 6000, slot: EquipmentSlot.Weapon, stats: { damage: 42, autoDps: 30 } },
  { id: 'Minishark', name: 'Minitiburon', category: ItemCategory.Weapon, description: 'Del traficante de armas. Escupe balas sin parar.', sellPrice: 35000, slot: EquipmentSlot.Weapon, stats: { damage: 30, autoDps: 90 } },
  { id: 'Snowball_Cannon', name: 'Canon de bolas de nieve', category: ItemCategory.Weapon, description: 'Mas divertido que eficaz.', sellPrice: 5000, slot: EquipmentSlot.Weapon, stats: { damage: 26, autoDps: 34 } },
  { id: 'Blowgun', name: 'Cerbatana', category: ItemCategory.Weapon, description: 'Del doctor brujo. Silenciosa y venenosa.', sellPrice: 8000, slot: EquipmentSlot.Weapon, stats: { damage: 60, autoDps: 40 } },
  { id: 'Star_Cannon', name: 'Canon de estrellas', category: ItemCategory.Weapon, description: 'Dispara estrellas caidas de verdad.', sellPrice: 60000, slot: EquipmentSlot.Weapon, stats: { damage: 320, autoDps: 180 } },
  { id: 'Mushroom_Spear', name: 'Lanza de setas', category: ItemCategory.Weapon, description: 'Del trufa. Setas a distancia.', sellPrice: 90000, slot: EquipmentSlot.Weapon, stats: { damage: 620, autoDps: 320 } },
  { id: 'Hammush', name: 'Setillo', category: ItemCategory.Tool, description: 'Del trufa. Martillo-hacha de seta, potencia 130.', sellPrice: 90000, slot: EquipmentSlot.Axe, tool: ToolKind.Axe, stats: { axePower: 130, damage: 480, autoDps: 260 } },
  { id: 'Pygmy_Staff', name: 'Baculo de pigmeos', category: ItemCategory.Weapon, description: 'De Plantera. Cuatro pigmeos peleando por ti.', sellPrice: 150000, slot: EquipmentSlot.Weapon, stats: { damage: 900, autoDps: 1400, manaCost: 10 } },
  { id: 'Heat_Ray', name: 'Rayo de calor', category: ItemCategory.Weapon, description: 'Del Templo. Un rayo continuo que atraviesa.', sellPrice: 160000, slot: EquipmentSlot.Weapon, stats: { damage: 1500, autoDps: 500, manaCost: 12 } },
  { id: 'Stynger', name: 'Aguijoneador', category: ItemCategory.Weapon, description: 'De Golem. Lanzagranadas de metralla.', sellPrice: 170000, slot: EquipmentSlot.Weapon, stats: { damage: 1700, autoDps: 700 } },

  // ================================================================ EVENTOS
  // ---------------------------------------------------------------- disparadores
  // Un evento se lanza gratis la primera vez; para repetirlo hace falta su
  // objeto, igual que en Terraria (las invasiones pasan solas, y el objeto es
  // para forzarlas).
  { id: 'Goblin_Battle_Standard', name: 'Estandarte de batalla duende', category: ItemCategory.Summon, description: 'Vuelve a llamar al Ejercito de duendes.', sellPrice: 0 },
  { id: 'Solar_Tablet', name: 'Tableta solar', category: ItemCategory.Summon, description: 'Provoca un Eclipse solar cuando te apetezca.', sellPrice: 0 },
  { id: 'Snow_Globe', name: 'Bola de nieve', category: ItemCategory.Summon, description: 'Agitala y viene la Legion de escarcha.', sellPrice: 0 },
  { id: 'Naughty_Present', name: 'Regalo travieso', category: ItemCategory.Summon, description: 'Abre la Luna de escarcha. Ojo con lo que pides.', sellPrice: 0 },
  { id: 'Martian_Probe', name: 'Sonda marciana', category: ItemCategory.Summon, description: 'Si la dejas escapar, vuelven a por ti. Aqui la usas tu.', sellPrice: 0 },

  // ---------------------------------------------------------------- materiales de evento
  { id: 'Tattered_Cloth', name: 'Tela andrajosa', category: ItemCategory.Material, description: 'De los estandartes de los duendes. Huele a duende.', sellPrice: 500 },
  { id: 'Present', name: 'Regalo', category: ItemCategory.Consumable, description: 'Lo suelta todo lo que se mueve en la Luna de escarcha. Abrelo: dentro hay monedas.', sellPrice: 0, consumable: { kind: 'coins', amount: 40000 } },
  { id: 'Solar_Tablet_Fragment', name: 'Fragmento de tableta solar', category: ItemCategory.Material, description: 'Ocho arman una tableta solar entera.', sellPrice: 4000 },
  { id: 'Martian_Conduit_Plating', name: 'Placa de conducto marciano', category: ItemCategory.Material, description: 'Metal alienigena. Zumba al tocarlo.', sellPrice: 6000 },

  // ---------------------------------------------------------------- alas
  { id: 'Harpy_Wings', name: 'Alas de arpia', category: ItemCategory.Accessory, description: 'Las primeras alas de verdad. Se las quitas a un wyvern del Sagrado.', sellPrice: 60000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 200, regen: 2 } },
  { id: 'Mothron_Wings', name: 'Alas de Mothron', category: ItemCategory.Accessory, description: 'Del jefe del eclipse. Las mejores del Hardmode medio.', sellPrice: 220000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 700, damage: 200, defense: 4 } },
  { id: 'Broken_Bat_Wing', name: 'Ala de murcielago roto', category: ItemCategory.Material, description: 'De los vampiros del eclipse. No sirve para nada mas que para venderla, y vale mucho.', sellPrice: 25000 },

  // ---------------------------------------------------------------- botin del ejercito de duendes
  { id: 'Shadowflame_Knife', name: 'Cuchillo de llama sombria', category: ItemCategory.Weapon, description: 'Del hechicero duende. Arde en negro.', sellPrice: 20000, slot: EquipmentSlot.Weapon, stats: { damage: 120, autoDps: 80 } },
  { id: 'Shadowflame_Bow', name: 'Arco de llama sombria', category: ItemCategory.Weapon, description: 'Del invocador duende. Tres flechas por disparo.', sellPrice: 24000, slot: EquipmentSlot.Weapon, stats: { damage: 140, autoDps: 110 } },

  // ---------------------------------------------------------------- botin del eclipse
  { id: 'Christmas_Tree_Sword', name: 'Espada de arbol de Navidad', category: ItemCategory.Weapon, description: 'De la Luna de escarcha. Suena a villancico.', sellPrice: 300000, slot: EquipmentSlot.Weapon, stats: { damage: 2400, autoDps: 900 } },
  { id: 'Razorpine', name: 'Pino navaja', category: ItemCategory.Weapon, description: 'Del Grito eterno. Escupe agujas de pino.', sellPrice: 280000, slot: EquipmentSlot.Weapon, stats: { damage: 2100, autoDps: 1400, manaCost: 10 } },
  { id: 'North_Pole', name: 'Polo Norte', category: ItemCategory.Weapon, description: 'De la Reina de Hielo. Lanza copos que caen del cielo.', sellPrice: 320000, slot: EquipmentSlot.Weapon, stats: { damage: 2800, autoDps: 1100 } },
  { id: 'Chain_Gun', name: 'Ametralladora', category: ItemCategory.Weapon, description: 'De Santa-NK1. No para de disparar.', sellPrice: 310000, slot: EquipmentSlot.Weapon, stats: { damage: 1800, autoDps: 2000 } },
  { id: 'Elf_Melter', name: 'Fundeelfos', category: ItemCategory.Weapon, description: 'De Santa-NK1. Lanzallamas festivo.', sellPrice: 290000, slot: EquipmentSlot.Weapon, stats: { damage: 2000, autoDps: 1500 } },
  { id: 'Blizzard_Staff', name: 'Baculo de ventisca', category: ItemCategory.Weapon, description: 'De la Legion de escarcha. Una tormenta por golpe.', sellPrice: 120000, slot: EquipmentSlot.Weapon, stats: { damage: 1100, autoDps: 700, manaCost: 12 } },

  // ---------------------------------------------------------------- botin marciano
  { id: 'Xenopopper', name: 'Xenopistola', category: ItemCategory.Weapon, description: 'Escopeta marciana de burbujas.', sellPrice: 340000, slot: EquipmentSlot.Weapon, stats: { damage: 2600, autoDps: 1600 } },
  { id: 'Laser_Machinegun', name: 'Ametralladora laser', category: ItemCategory.Weapon, description: 'Del platillo marciano. Un rayo continuo.', sellPrice: 380000, slot: EquipmentSlot.Weapon, stats: { damage: 2400, autoDps: 2600, manaCost: 8 } },
  { id: 'Charged_Blaster_Cannon', name: 'Canon de plasma', category: ItemCategory.Weapon, description: 'Se carga y revienta.', sellPrice: 360000, slot: EquipmentSlot.Weapon, stats: { damage: 3200, autoDps: 1200, manaCost: 14 } },
  { id: 'Electrosphere_Launcher', name: 'Lanzador de electroesferas', category: ItemCategory.Weapon, description: 'Deja bolas de electricidad flotando.', sellPrice: 350000, slot: EquipmentSlot.Weapon, stats: { damage: 2200, autoDps: 2400 } },
  { id: 'Xeno_Staff', name: 'Baculo xeno', category: ItemCategory.Weapon, description: 'Invoca un OVNI que pelea por ti.', sellPrice: 330000, slot: EquipmentSlot.Weapon, stats: { damage: 1400, autoDps: 3000, manaCost: 10 } },
  { id: 'Cosmic_Car_Key', name: 'Llave del coche cosmico', category: ItemCategory.Accessory, description: 'Del platillo marciano. Monopatin espacial.', sellPrice: 300000, slot: EquipmentSlot.Accessory1, stats: { autoDps: 1000, damage: 300, coinBonus: 0.1 } },

  // ---------------------------------------------------------------- monedas (solo iconos)
  { iconOnly: true, id: 'Copper_Coin', name: 'Moneda de cobre', category: ItemCategory.Material, description: 'Moneda.', sellPrice: 0 },
  { iconOnly: true, id: 'Silver_Coin', name: 'Moneda de plata', category: ItemCategory.Material, description: 'Moneda.', sellPrice: 0 },
  { iconOnly: true, id: 'Gold_Coin', name: 'Moneda de oro', category: ItemCategory.Material, description: 'Moneda.', sellPrice: 0 },
  { iconOnly: true, id: 'Platinum_Coin', name: 'Moneda de platino', category: ItemCategory.Material, description: 'Moneda.', sellPrice: 0 },
];

export const ItemList: Record<ItemId, ItemDef> = Object.fromEntries(
  seed.map((item) => [item.id, { ...item, name: item.name ?? humanize(item.id) } as ItemDef]),
);

export const getItem = (id: ItemId): ItemDef => {
  const item = ItemList[id];
  if (item) return item;
  // Un id desconocido no debe tumbar el juego: devolvemos un placeholder visible.
  return {
    id,
    name: humanize(id),
    category: ItemCategory.Material,
    description: 'Objeto desconocido.',
    sellPrice: 0,
  };
};

export const allItems = (): ItemDef[] => Object.values(ItemList);

/**
 * Equipo inicial, el mismo con el que se empieza una partida de Terraria. Vive
 * aqui, con los datos de objetos, porque no solo lo reparte Game al empezar:
 * el catalogo lo necesita para poder decir "esto viene con el personaje" en vez
 * de "no se consigue de ninguna forma".
 */
export const STARTING_KIT: ItemId[] = ['Copper_Shortsword', 'Copper_Pickaxe', 'Copper_Axe'];

export const isEquippable = (id: ItemId): boolean => Boolean(getItem(id).slot);

/** Nombre con su rasgo delante: "Legendario Mandoble de oro". */
export function displayNameOf(id: ItemId, prefixName?: string): string {
  const name = getItem(id).name;
  return prefixName ? `${prefixName} ${name}` : name;
}
