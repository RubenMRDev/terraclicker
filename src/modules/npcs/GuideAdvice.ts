import { App } from '../App';
import { ARMOR_SLOTS, EquipmentSlot, MAX_LIFE_CRYSTALS, ToolKind } from '../GameConstants';
import { getNode } from '../gathering/GatherNode';
import { getItem } from '../items/ItemList';
import { ItemCategory } from '../items/ItemType';
import { LunarStage } from '../events/LunarStage';
import { evaluate } from '../requirements/Requirement';

export interface Advice {
  text: string;
  /** Sprite que acompana el consejo. */
  icon: string;
  tone: 'info' | 'goal' | 'urgent';
}

/** Cuantos consejos se ensenan de una vez. Mas es ruido. */
const MAX_ADVICE = 4;

/**
 * Lo que diria el Guia si le preguntases ahora mismo. Es una lista de reglas en
 * orden de prioridad: se evaluan de arriba abajo y se muestran las primeras que
 * apliquen, de modo que lo urgente tapa lo que solo es una mejora.
 */
export function guideAdvice(): Advice[] {
  const game = App.game;
  const { player, inventory, zones, bosses, crafting, npcs, lunar, statistics } = game;
  const out: Advice[] = [];
  const push = (text: string, icon: string, tone: Advice['tone'] = 'info') => {
    if (out.length < MAX_ADVICE) out.push({ text, icon, tone });
  };

  // ------------------------------------------------------------ evento lunar
  switch (lunar.stage) {
    case LunarStage.CultistImminent:
      push(
        'Los cultistas han abierto un portal en la Mazmorra. El Cultista Lunatico te espera: no se va a ir solo.',
        'Lunatic_Cultist',
        'urgent',
      );
      break;
    case LunarStage.Pillars:
      for (const pillar of lunar.pillarViews()) {
        if (pillar.defeated) continue;
        push(
          pillar.kills >= pillar.required
            ? `El escudo del ${pillar.name} ha caido. Ve y rompelo.`
            : `${pillar.name}: ${pillar.kills}/${pillar.required} bichos para bajarle el escudo.`,
          pillar.sprite,
          'urgent',
        );
      }
      break;
    case LunarStage.MoonLordCountdown:
      push(
        'Los cuatro pilares han caido. El Senor de la Luna llega en cuestion de segundos: bebe, equipate y respira.',
        'Moon_Lord',
        'urgent',
      );
      break;
    case LunarStage.MoonLordImminent:
      push('El Senor de la Luna esta aqui. No hay donde esconderse.', 'Moon_Lord', 'urgent');
      break;
    default:
      break;
  }

  // ------------------------------------------------------------ jefes
  const summonableHere = bosses
    .bossesOfZone(zones.current.id)
    .filter((boss) => boss.summonItem && inventory.has(boss.summonItem));
  for (const boss of summonableHere) {
    push(`Tienes con que invocar a ${boss.name} aqui mismo.`, boss.sprite, 'goal');
  }

  // Objeto de invocacion que ya se puede fabricar.
  for (const group of crafting.grouped()) {
    for (const view of group.recipes) {
      if (view.craftable < 1) continue;
      const item = getItem(view.recipe.output.itemId);
      if (item.category !== ItemCategory.Summon) continue;
      if (inventory.has(item.id)) continue;
      push(`Ya puedes fabricar ${item.name}.`, item.id, 'goal');
    }
  }

  // ------------------------------------------------------------ herramientas
  // Nodos de la zona actual que la herramienta no alcanza. Es la causa numero
  // uno de "aqui no aparece nada".
  const blocked = zones.current.nodes
    .map(getNode)
    .filter((node) =>
      node.tool === ToolKind.Axe
        ? player.stats.axePower < node.toolPower
        : player.stats.pickPower < node.toolPower,
    )
    .sort((a, b) => a.toolPower - b.toolPower);
  if (blocked.length > 0) {
    const node = blocked[0];
    const tool = node.tool === ToolKind.Axe ? 'hacha' : 'pico';
    push(
      `En ${zones.current.name} no sale ${getItem(node.itemId).name}: hace falta ${tool} de potencia ${node.toolPower}.`,
      node.itemId,
      'goal',
    );
  }

  // Mejor pico/hacha que ya se puede fabricar.
  for (const group of crafting.grouped()) {
    for (const view of group.recipes) {
      if (view.craftable < 1) continue;
      const item = getItem(view.recipe.output.itemId);
      const power = item.stats?.pickPower ?? item.stats?.axePower ?? 0;
      if (power <= 0) continue;
      const current =
        item.tool === ToolKind.Axe ? player.stats.axePower : player.stats.pickPower;
      if (power <= current) continue;
      push(`Puedes fabricar ${item.name} y subir a potencia ${power}.`, item.id, 'goal');
    }
  }

  // ------------------------------------------------------------ estaciones base
  const stations: Array<[string, string]> = [
    ['Work_Bench', 'La mesa de trabajo abre casi todas las recetas. Son 10 de madera.'],
    ['Furnace', 'Sin horno el mineral no se convierte en nada. Piedra, madera y antorchas.'],
    ['Iron_Anvil', 'El yunque es lo que convierte los lingotes en armas y armaduras.'],
  ];
  for (const [id, text] of stations) {
    if (!inventory.discovered.has(id)) push(text, id, 'goal');
  }

  // ------------------------------------------------------------ personaje
  const emptyArmor = ARMOR_SLOTS.filter((slot) => !player.equippedIn(slot));
  if (emptyArmor.length > 0 && inventory.discovered.size > 12) {
    push(
      `Llevas ${emptyArmor.length} hueco${emptyArmor.length > 1 ? 's' : ''} de armadura sin nada. La defensa es la mitad de una bossfight.`,
      'Iron_Chainmail',
      'info',
    );
  }
  if (!player.equippedIn(EquipmentSlot.Accessory1)) {
    push('No llevas ningun accesorio. Los tres huecos suman mucho.', 'Cloud_in_a_Bottle', 'info');
  }
  if (player.lifeCrystals < MAX_LIFE_CRYSTALS) {
    push(
      `Cristales de vida: ${player.lifeCrystals}/${MAX_LIFE_CRYSTALS}. Salen en las seis zonas subterraneas, no solo en Cavernas.`,
      'Life_Crystal',
      'info',
    );
  }

  // ------------------------------------------------------------ pueblo
  if (npcs.waiting.length > 0) {
    const names = npcs.waiting.slice(0, 3).map((npc) => npc.name).join(', ');
    push(`${names} quiere${npcs.waiting.length > 1 ? 'n' : ''} mudarse y no hay casa libre.`, 'Wooden_Door', 'goal');
  }

  // ------------------------------------------------------------ zonas
  const nextLocked = zones.all
    .filter((zone) => !zone.event && !zones.isUnlocked(zone))
    .map((zone) => ({ zone, missing: zones.requirements(zone).filter((req) => !req.met) }))
    .sort((a, b) => a.missing.length - b.missing.length)[0];
  if (nextLocked) {
    push(
      `Para abrir ${nextLocked.zone.name}: ${nextLocked.missing.map((req) => req.label).join(' y ')}.`,
      nextLocked.zone.icon,
      'goal',
    );
  }

  // ------------------------------------------------------------ final
  if (out.length === 0) {
    const cleared = statistics.defeatsOf('moon_lord') > 0;
    push(
      cleared
        ? 'Has matado al Senor de la Luna. Ya solo queda el Cenit, y para eso hacen falta diez espadas.'
        : 'Vas bien. Pica, funde, sube de pico y vuelve a preguntarme.',
      cleared ? 'Zenith' : 'Guide',
      'info',
    );
  }

  return out;
}

/** El requisito que le falta a un NPC para mudarse, en una linea. */
export function arrivalHint(npcId: string): string | null {
  const npc = App.game.npcs.all.find((candidate) => candidate.id === npcId);
  if (!npc) return null;
  const missing = npc.arrival.map(evaluate).filter((progress) => !progress.met);
  if (missing.length === 0) return null;
  return missing.map((progress) => progress.label).join(' · ');
}
