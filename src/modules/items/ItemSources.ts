import { BossList } from '../bosses/BossList';
import { EnemyList } from '../combat/EnemyList';
import { RecipeList, type RecipeDef } from '../crafting/RecipeList';
import { InvasionList } from '../events/InvasionList';
import { NodeList } from '../gathering/GatherNode';
import { NpcList } from '../npcs/NpcList';
import { ZoneList } from '../zones/ZoneList';
import { getItem } from './ItemList';
import type { ItemId } from './ItemType';

/** De donde puede salir un objeto. */
export type SourceKind = 'node' | 'enemy' | 'boss' | 'recipe' | 'shop' | 'invasion';

export interface ItemSource {
  kind: SourceKind;
  /** Que lo suelta o lo hace: el nombre del nodo, del bicho, de la receta... */
  name: string;
  /** Sprite de eso. */
  icon: string;
  /** Zonas donde encontrarlo, si aplica. */
  zones: string[];
  /** Probabilidad de la tirada, si es botin. */
  chance?: number;
  /** Cantidad por tirada, si es botin o receta. */
  amount?: string;
  /** Precio en cobre, si es de tienda. */
  price?: number;
  /** La receta, para poder mandar al panel de fabricacion. */
  recipe?: RecipeDef;
}

const zonesWithNode = (nodeId: string): string[] =>
  ZoneList.filter((zone) => zone.nodes.includes(nodeId)).map((zone) => zone.name);

const zonesWithEnemy = (enemyId: string): string[] =>
  ZoneList.filter((zone) => zone.enemies.includes(enemyId)).map((zone) => zone.name);

const range = (min: number, max: number): string => (min === max ? `x${min}` : `x${min}-${max}`);

/**
 * Todas las formas de conseguir un objeto: los bloques que lo sueltan, los
 * bichos, los jefes, las invasiones, las recetas que lo producen y los vecinos
 * que lo venden.
 *
 * Es informacion que ya estaba en los datos pero repartida en cinco ficheros;
 * el catalogo la necesita junta para poder responder "y esto de donde sale".
 */
export function sourcesOf(itemId: ItemId): ItemSource[] {
  const out: ItemSource[] = [];

  for (const node of Object.values(NodeList)) {
    const drop = node.drops.find((candidate) => candidate.itemId === itemId);
    if (!drop) continue;
    out.push({
      kind: 'node',
      name: getItem(node.itemId).name,
      icon: node.itemId,
      zones: zonesWithNode(node.id),
      chance: drop.chance,
      amount: range(drop.min, drop.max),
    });
  }

  for (const enemy of Object.values(EnemyList)) {
    const drop = enemy.drops.find((candidate) => candidate.itemId === itemId);
    if (!drop) continue;
    out.push({
      kind: 'enemy',
      name: enemy.name,
      icon: enemy.sprite,
      zones: zonesWithEnemy(enemy.id),
      chance: drop.chance,
      amount: range(drop.min, drop.max),
    });
  }

  for (const boss of Object.values(BossList)) {
    const drop =
      boss.drops.find((candidate) => candidate.itemId === itemId) ??
      boss.firstClearDrops.find((candidate) => candidate.itemId === itemId);
    if (!drop) continue;
    const firstOnly = !boss.drops.some((candidate) => candidate.itemId === itemId);
    out.push({
      kind: 'boss',
      name: firstOnly ? `${boss.name} (primera vez)` : boss.name,
      icon: boss.sprite,
      zones: [ZoneList.find((zone) => zone.id === boss.zoneId)?.name ?? boss.zoneId],
      chance: drop.chance,
      amount: range(drop.min, drop.max),
    });
  }

  for (const recipe of RecipeList) {
    if (recipe.output.itemId !== itemId) continue;
    out.push({
      kind: 'recipe',
      name: recipe.inputs.map((input) => `${getItem(input.itemId).name} x${input.amount}`).join(' + '),
      icon: recipe.inputs[0]?.itemId ?? itemId,
      zones: [],
      amount: `x${recipe.output.amount}`,
      recipe,
    });
  }

  for (const invasion of InvasionList) {
    const drop = invasion.rewards.find((candidate) => candidate.itemId === itemId);
    if (!drop) continue;
    out.push({
      kind: 'invasion',
      name: invasion.name,
      icon: invasion.sprite,
      zones: [],
      chance: drop.chance,
      amount: range(drop.min, drop.max),
    });
  }

  for (const npc of NpcList) {
    const entry = npc.shop?.find((candidate) => candidate.itemId === itemId);
    if (!entry) continue;
    out.push({
      kind: 'shop',
      name: npc.name,
      icon: npc.sprite,
      zones: [],
      price: entry.price,
    });
  }

  return out;
}

/** Si el objeto no se puede conseguir de ninguna forma. Util para detectar huecos. */
export const isUnobtainable = (itemId: ItemId): boolean => sourcesOf(itemId).length === 0;
