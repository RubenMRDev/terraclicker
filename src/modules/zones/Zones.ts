import { GameEvents } from '../GameEvents';
import { allMet, progressOf, type RequirementProgress } from '../requirements/Requirement';
import { FIRST_ZONE_ID, getZone, ZoneList, type ZoneDef } from './ZoneList';

export interface ZonesSave {
  current: string;
  visited: string[];
}

/** Controlador de zonas: cual esta activa y cuales estan desbloqueadas. */
export class Zones {
  current: ZoneDef = getZone(FIRST_ZONE_ID);
  readonly visited = new Set<string>([FIRST_ZONE_ID]);

  get all(): ZoneDef[] {
    return ZoneList;
  }

  /**
   * Las que se pintan en el selector. Las zonas de evento (los pilares
   * celestiales) solo existen mientras el evento esta abierto: fuera de el no
   * tienen que aparecer ni siquiera con el candado.
   */
  get visible(): ZoneDef[] {
    return ZoneList.filter((zone) => !zone.event || this.isUnlocked(zone));
  }

  nameOf(zoneId: string): string {
    return ZoneList.find((zone) => zone.id === zoneId)?.name ?? zoneId;
  }

  isUnlocked(zone: ZoneDef): boolean {
    return zone.unlock.length === 0 || allMet(zone.unlock);
  }

  requirements(zone: ZoneDef): RequirementProgress[] {
    return progressOf(zone.unlock);
  }

  /** Viaja a la zona si esta desbloqueada. Devuelve si el viaje se ha hecho. */
  travel(zoneId: string): boolean {
    const zone = getZone(zoneId);
    if (!this.isUnlocked(zone)) return false;
    if (this.current.id === zone.id) return false;
    this.current = zone;
    this.visited.add(zone.id);
    GameEvents.notifySync('zone', 'battle');
    return true;
  }

  /**
   * Traslado forzoso, sin mirar requisitos. Lo usa el evento lunar cuando cierra
   * un pilar con el jugador dentro: la zona deja de existir y hay que sacarlo.
   */
  forceTravel(zoneId: string): void {
    const zone = ZoneList.find((candidate) => candidate.id === zoneId);
    if (!zone || this.current.id === zone.id) return;
    this.current = zone;
    this.visited.add(zone.id);
    GameEvents.notifySync('zone', 'battle');
  }

  toJSON(): ZonesSave {
    return { current: this.current.id, visited: [...this.visited] };
  }

  fromJSON(save: ZonesSave | undefined): void {
    this.visited.clear();
    this.visited.add(FIRST_ZONE_ID);
    for (const id of save?.visited ?? []) {
      if (ZoneList.some((zone) => zone.id === id)) this.visited.add(id);
    }
    const saved = ZoneList.find((zone) => zone.id === save?.current);
    // Una partida guardada dentro de un pilar se reanuda en la Mazmorra: al
    // cargar el evento aun no ha reconstruido nada y esa zona no existe.
    this.current = saved && !saved.event ? saved : getZone(FIRST_ZONE_ID);
  }
}
