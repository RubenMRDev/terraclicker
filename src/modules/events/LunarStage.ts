/**
 * Etapas del evento lunar. Va en su propio fichero porque lo miran a la vez el
 * controlador del evento, las zonas de los pilares y los requisitos, y tenerlo
 * aparte evita el ciclo de imports.
 */
export enum LunarStage {
  /** Nada. El Cultista todavia no ha aparecido. */
  Idle = 'idle',
  /** El Cultista Lunatico ha aparecido en la Mazmorra y hay que matarlo. */
  CultistImminent = 'cultist',
  /** Los cuatro pilares estan abiertos como zonas temporales. */
  Pillars = 'pillars',
  /** Los pilares han caido: cuenta atras antes de que baje el Senor de la Luna. */
  MoonLordCountdown = 'countdown',
  /** El Senor de la Luna esta aqui y no se puede huir. */
  MoonLordImminent = 'moonlord',
  /** Evento completado. */
  Done = 'done',
}

/** Probabilidad de que un bicho de la Mazmorra traiga al Cultista Lunatico. */
export const CULTIST_SPAWN_CHANCE = 0.01;

/** Bichos que hay que matar en cada pilar para bajarle el escudo. */
export const PILLAR_KILLS_REQUIRED = 1000;

/** Cuenta atras entre el ultimo pilar y la llegada del Senor de la Luna. */
export const MOON_LORD_COUNTDOWN_MS = 60_000;

/** Segunda oportunidad: si te mata, vuelve con esta cuenta atras mas corta. */
export const MOON_LORD_RETRY_MS = 30_000;

export interface PillarDef {
  id: string;
  name: string;
  sprite: string;
  /** Zona temporal que se abre durante el evento. */
  zoneId: string;
  /** Jefe (el pilar en si) que se pelea al bajar el escudo. */
  bossId: string;
  /** Fragmento que suelta. */
  fragment: string;
}

export const PillarList: PillarDef[] = [
  {
    id: 'solar',
    name: 'Pilar Solar',
    sprite: 'Solar_Pillar',
    zoneId: 'pillar_solar',
    bossId: 'solar_pillar',
    fragment: 'Solar_Fragment',
  },
  {
    id: 'vortex',
    name: 'Pilar del Vortice',
    sprite: 'Vortex_Pillar',
    zoneId: 'pillar_vortex',
    bossId: 'vortex_pillar',
    fragment: 'Vortex_Fragment',
  },
  {
    id: 'nebula',
    name: 'Pilar de la Nebulosa',
    sprite: 'Nebula_Pillar',
    zoneId: 'pillar_nebula',
    bossId: 'nebula_pillar',
    fragment: 'Nebula_Fragment',
  },
  {
    id: 'stardust',
    name: 'Pilar del Polvo Estelar',
    sprite: 'Stardust_Pillar',
    zoneId: 'pillar_stardust',
    bossId: 'stardust_pillar',
    fragment: 'Stardust_Fragment',
  },
];

export const pillarOfZone = (zoneId: string): PillarDef | undefined =>
  PillarList.find((pillar) => pillar.zoneId === zoneId);

export const pillarOfBoss = (bossId: string): PillarDef | undefined =>
  PillarList.find((pillar) => pillar.bossId === bossId);
