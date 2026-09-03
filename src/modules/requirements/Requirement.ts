import { App } from '../App';
import { getItem } from '../items/ItemList';
import type { ItemId } from '../items/ItemType';

/**
 * Requisitos de desbloqueo (zonas, recetas, logros, NPCs). Union discriminada
 * en vez de la jerarquia de clases de pokeclicker: mismo papel, mas facil de
 * serializar y de pintar la barra de progreso en la UI.
 */
export type Requirement =
  | { kind: 'itemGathered'; itemId: ItemId; amount: number }
  | { kind: 'itemOwned'; itemId: ItemId; amount: number }
  | { kind: 'itemDiscovered'; itemId: ItemId }
  | { kind: 'bossDefeated'; bossId: string }
  | { kind: 'enemiesDefeated'; amount: number }
  | { kind: 'enemyKills'; enemyId: string; amount: number }
  | { kind: 'coinsEarned'; amount: number }
  | { kind: 'nodesBroken'; amount: number }
  | { kind: 'clicks'; amount: number }
  | { kind: 'pickPower'; amount: number }
  | { kind: 'zoneVisited'; zoneId: string }
  | { kind: 'npcsHoused'; amount: number }
  | { kind: 'npcHoused'; npcId: string }
  /** Etapa del evento lunar. Es lo que abre y cierra las zonas de los pilares. */
  | { kind: 'lunarStage'; stage: string }
  /** Invasion completada al menos una vez. */
  | { kind: 'invasionCleared'; invasionId: string }
  /** Numero de invasiones distintas completadas. */
  | { kind: 'invasionsCleared'; amount: number };

export interface RequirementProgress {
  requirement: Requirement;
  current: number;
  target: number;
  met: boolean;
  label: string;
}

export function evaluate(requirement: Requirement): RequirementProgress {
  const { statistics, inventory, wallet, player, bosses, zones, npcs, lunar, invasions } =
    App.game;

  const build = (current: number, target: number, label: string): RequirementProgress => ({
    requirement,
    current: Math.min(current, target),
    target,
    met: current >= target,
    label,
  });

  switch (requirement.kind) {
    case 'itemGathered':
      return build(
        statistics.gathered(requirement.itemId),
        requirement.amount,
        `Recoge ${requirement.amount} de ${getItem(requirement.itemId).name}`,
      );
    case 'itemOwned':
      return build(
        inventory.count(requirement.itemId),
        requirement.amount,
        `Ten ${requirement.amount} de ${getItem(requirement.itemId).name}`,
      );
    case 'itemDiscovered':
      return build(
        inventory.discovered.has(requirement.itemId) ? 1 : 0,
        1,
        `Consigue ${getItem(requirement.itemId).name}`,
      );
    case 'bossDefeated':
      return build(
        statistics.defeatsOf(requirement.bossId) > 0 ? 1 : 0,
        1,
        `Derrota a ${bosses.name(requirement.bossId)}`,
      );
    case 'enemiesDefeated':
      return build(
        statistics.enemiesDefeated,
        requirement.amount,
        `Derrota a ${requirement.amount} enemigos`,
      );
    case 'enemyKills':
      return build(
        statistics.killsOf(requirement.enemyId),
        requirement.amount,
        `Derrota a ${requirement.amount} ${requirement.enemyId}`,
      );
    case 'coinsEarned':
      return build(wallet.totalEarned, requirement.amount, `Gana ${requirement.amount} de cobre`);
    case 'nodesBroken':
      return build(statistics.nodesBroken, requirement.amount, `Rompe ${requirement.amount} bloques`);
    case 'clicks':
      return build(statistics.clicks, requirement.amount, `Haz ${requirement.amount} clicks`);
    case 'pickPower':
      return build(
        player.stats.pickPower,
        requirement.amount,
        `Consigue un pico de potencia ${requirement.amount}`,
      );
    case 'zoneVisited':
      return build(
        zones.visited.has(requirement.zoneId) ? 1 : 0,
        1,
        `Visita ${zones.nameOf(requirement.zoneId)}`,
      );
    case 'npcsHoused':
      return build(npcs.housedCount, requirement.amount, `Ten ${requirement.amount} vecinos`);
    case 'npcHoused':
      return build(
        npcs.isHoused(requirement.npcId) ? 1 : 0,
        1,
        `Ten a ${npcs.nameOf(requirement.npcId)} en el pueblo`,
      );
    case 'lunarStage':
      return build(
        lunar.stage === requirement.stage ? 1 : 0,
        1,
        'Solo durante el evento lunar',
      );
    case 'invasionCleared': {
      const invasion = invasions.all.find(
        (candidate) => candidate.id === requirement.invasionId,
      );
      return build(
        invasions.cleared.has(requirement.invasionId) ? 1 : 0,
        1,
        `Repele ${invasion?.name ?? requirement.invasionId}`,
      );
    }
    case 'invasionsCleared':
      return build(
        invasions.cleared.size,
        requirement.amount,
        `Repele ${requirement.amount} invasiones distintas`,
      );
  }
}

export const allMet = (requirements: readonly Requirement[]): boolean =>
  requirements.every((requirement) => evaluate(requirement).met);

export const progressOf = (requirements: readonly Requirement[]): RequirementProgress[] =>
  requirements.map(evaluate);
