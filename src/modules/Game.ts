import { Achievements } from './achievements/Achievements';
import { App } from './App';
import { Battle } from './battle/Battle';
import { Bosses } from './bosses/Bosses';
import { Crafting } from './crafting/Crafting';
import { Invasions } from './events/Invasions';
import { LunarEvent } from './events/LunarEvent';
import {
  AUTO_CLICKS_PER_SECOND,
  AUTO_POTION_THRESHOLD,
  AUTO_REFORGE_MAX_ATTEMPTS,
  AUTOSAVE_INTERVAL_MS,
  EquipmentSlot,
  HEALING_POTIONS,
  OUT_OF_COMBAT_REGEN,
  TICK_MS,
} from './GameConstants';
import { GameEvents } from './GameEvents';
import { randomInt } from './GameHelper';
import { Inventory } from './items/Inventory';
import { getItem, STARTING_KIT } from './items/ItemList';
import { canHavePrefix, getPrefix, rollPrefix } from './items/Prefixes';
import type { ItemId } from './items/ItemType';
import { Notifier } from './notifications/Notifier';
import { Npcs } from './npcs/Npcs';
import { Player } from './player/Player';
import { Save } from './save/Save';
import { Statistics } from './statistics/Statistics';
import { Wallet } from './wallet/Wallet';
import { Zones } from './zones/Zones';
import { FIRST_ZONE_ID } from './zones/ZoneList';

/**
 * Raiz del juego: crea los modulos, arranca el bucle y coordina el guardado.
 * Es el equivalente de modules/Game.ts en pokeclicker.
 */
export class Game {
  readonly inventory = new Inventory();
  readonly wallet = new Wallet();
  readonly statistics = new Statistics();
  readonly player = new Player(this.inventory);
  readonly zones = new Zones();
  readonly battle = new Battle();
  readonly bosses = new Bosses();
  readonly crafting = new Crafting();
  readonly npcs = new Npcs();
  readonly lunar = new LunarEvent();
  readonly invasions = new Invasions();
  readonly achievements = new Achievements();
  readonly notifier = new Notifier();
  readonly save = new Save();

  private loopHandle: number | null = null;
  private lastFrame = 0;
  private sinceAutosave = 0;
  private sinceStatsPulse = 0;
  /** Resto de click pendiente del autoclicker, para no perder fracciones. */
  private autoClickCarry = 0;
  private started = false;
  /** Evita que el guardado de beforeunload resucite una partida recien borrada. */
  private resetting = false;

  /** Carga la partida (o crea una nueva) y arranca el bucle. */
  start(): void {
    if (this.started) return;
    this.started = true;

    const loaded = this.save.load();
    if (!loaded) this.newGame();

    this.ensureStartingKit();
    this.ensureZoneStillOpen();
    this.battle.reset();
    this.achievements.check();

    this.lastFrame = performance.now();
    this.loop();

    window.addEventListener('beforeunload', this.handleUnload);
  }

  stop(): void {
    if (this.loopHandle !== null) cancelAnimationFrame(this.loopHandle);
    this.loopHandle = null;
    this.started = false;
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  private handleUnload = (): void => {
    if (this.resetting) return;
    this.save.save();
  };

  private newGame(): void {
    for (const id of STARTING_KIT) this.inventory.gain(id, 1, true);
    this.player.fullHeal();
    this.notifier.push('Bienvenido a Terraria. Pica algo.', 'info', 'Copper_Pickaxe');
  }

  /**
   * Garantiza que el jugador siempre tenga con que empezar: si una partida
   * guardada se quedo sin pico equipado, se le repone el de cobre.
   */
  private ensureStartingKit(): void {
    for (const id of STARTING_KIT) {
      const slot = getItem(id).slot;
      if (!slot) continue;
      const equipped = this.player.equippedIn(slot);
      if (equipped && this.inventory.has(equipped)) continue;
      if (!this.inventory.has(id)) this.inventory.gain(id, 1, true);
      this.player.equip(id, slot);
    }
    // Los accesorios guardados que ya no esten en la mochila se retiran.
    for (const [slot, itemId] of Object.entries(this.player.equipment)) {
      if (itemId && !this.inventory.has(itemId)) this.player.unequip(slot as EquipmentSlot);
    }
  }

  /**
   * Red de seguridad para las partidas viejas: si un cambio de contenido
   * endurece el requisito de una zona (la Luna pasó de abrirse con Golem a
   * abrirse con el Senor de la Luna), el jugador podia quedarse guardado dentro
   * de una zona que ya no le corresponde. Se le devuelve al Bosque.
   */
  private ensureZoneStillOpen(): void {
    if (this.zones.isUnlocked(this.zones.current)) return;
    const name = this.zones.current.name;
    this.zones.forceTravel(FIRST_ZONE_ID);
    this.notifier.push(`${name} se ha cerrado: vuelve a abrirla.`, 'warning');
  }

  private loop = (): void => {
    this.loopHandle = requestAnimationFrame(this.loop);

    const now = performance.now();
    // Con la pestana en segundo plano el rAF se para: acotamos el salto para no
    // regalar progreso al volver (el juego no tiene progreso offline).
    const delta = Math.min(now - this.lastFrame, TICK_MS * 4);
    this.lastFrame = now;
    if (delta <= 0) return;

    this.tick(delta);
  };

  private tick(deltaMs: number): void {
    this.statistics.timePlayedMs += deltaMs;

    if (this.bosses.isFighting) {
      this.bosses.tick(deltaMs);
    } else {
      this.battle.tick(deltaMs);
      const regen = OUT_OF_COMBAT_REGEN + this.player.stats.regen;
      if (this.player.health < this.player.maxHealth) {
        this.player.heal((regen * deltaMs) / 1000);
      }
    }

    this.player.tickPotionCooldown(deltaMs);
    this.player.tickMana(deltaMs);
    this.npcs.tick(deltaMs);
    this.lunar.tick(deltaMs);
    this.tickAutoClick(deltaMs);
    this.notifier.tick();

    // El contador de tiempo jugado sube cada tick, pero repintarlo 20 veces por
    // segundo no aporta nada: basta con refrescarlo dos veces por segundo.
    this.sinceStatsPulse += deltaMs;
    if (this.sinceStatsPulse >= 500) {
      this.sinceStatsPulse = 0;
      GameEvents.notify('statistics');
    }

    this.sinceAutosave += deltaMs;
    if (this.sinceAutosave >= AUTOSAVE_INTERVAL_MS) {
      this.sinceAutosave = 0;
      this.save.save();
    }
  }

  /**
   * Autoclicker y autocombate. El primero pulsa el objetivo de la zona a
   * AUTO_CLICKS_PER_SECOND, y el segundo hace lo mismo dentro de una bossfight y
   * ademas bebe una pocion cuando la vida baja del umbral. Los dos son opcion,
   * apagados por defecto: son comodidad, no una mecanica.
   */
  private tickAutoClick(deltaMs: number): void {
    const fighting = this.bosses.isFighting;
    const enabled = fighting ? this.save.settings.autoBattle : this.save.settings.autoClick;
    if (!enabled) {
      this.autoClickCarry = 0;
      return;
    }

    if (fighting) this.autoDrinkPotion();

    this.autoClickCarry += (AUTO_CLICKS_PER_SECOND * deltaMs) / 1000;
    const clicks = Math.floor(this.autoClickCarry);
    if (clicks <= 0) return;
    this.autoClickCarry -= clicks;
    for (let i = 0; i < clicks; i += 1) {
      if (fighting) this.bosses.click(randomInt(30, 70), randomInt(30, 70));
      else this.battle.click(randomInt(20, 80), randomInt(20, 80));
    }
  }

  /** Bebe la mejor pocion disponible si la vida esta por debajo del umbral. */
  private autoDrinkPotion(): void {
    if (this.player.potionCooldown > 0) return;
    if (this.player.healthPercent > AUTO_POTION_THRESHOLD * 100) return;
    // De la mas fuerte a la mas floja: no se gasta una suprema para curar 20.
    for (const id of HEALING_POTIONS) {
      if (!this.inventory.has(id)) continue;
      this.use(id);
      return;
    }
  }

  /** Equipa un objeto y refresca lo que dependa de las stats. */
  equip(itemId: ItemId, slot?: EquipmentSlot): void {
    if (!this.player.equip(itemId, slot)) return;
    this.player.invalidate();
    this.battle.onEquipmentChanged();
    this.achievements.check();
    GameEvents.notifySync('player', 'inventory');
  }

  unequip(slot: EquipmentSlot): void {
    this.player.unequip(slot);
    this.battle.onEquipmentChanged();
    GameEvents.notifySync('player', 'inventory');
  }

  /** Usa un consumible de la mochila. */
  use(itemId: ItemId): boolean {
    const item = getItem(itemId);
    const effect = item.consumable;
    if (!effect || !this.inventory.has(itemId)) return false;

    if (effect.kind === 'maxHealthFruit') {
      if (!this.player.addLifeFruit()) {
        this.notifier.push('Ya tienes la vida maxima.', 'warning', itemId);
        return false;
      }
      this.inventory.remove(itemId);
      this.notifier.push(`+${effect.amount} de vida maxima`, 'success', itemId);
    } else if (effect.kind === 'mana') {
      if (this.player.mana >= this.player.maxMana) {
        this.notifier.push('Ya tienes el mana lleno.', 'warning', itemId);
        return false;
      }
      this.inventory.remove(itemId);
      this.player.restoreMana(effect.amount);
      this.notifier.push(`+${effect.amount} de mana`, 'success', itemId);
    } else if (effect.kind === 'maxMana') {
      if (!this.player.addManaCrystal()) {
        this.notifier.push('Ya tienes el mana maximo.', 'warning', itemId);
        return false;
      }
      this.inventory.remove(itemId);
      this.notifier.push(`+${effect.amount} de mana maximo`, 'success', itemId);
    } else if (effect.kind === 'maxHealth') {
      // El cristal de vida se pierde si ya se alcanzo el maximo, asi que no lo gastamos.
      if (!this.player.addLifeCrystal()) {
        this.notifier.push('Ya tienes la vida maxima.', 'warning', itemId);
        return false;
      }
      this.inventory.remove(itemId);
      this.notifier.push(`+${effect.amount} de vida maxima`, 'success', itemId);
    } else if (effect.kind === 'blastNode') {
      if (this.bosses.isFighting) {
        this.notifier.push('No aqui. Esto es para minar.', 'warning', itemId);
        return false;
      }
      if (!this.battle.blastNode(effect.amount)) {
        this.notifier.push('Los explosivos solo funcionan sobre bloques.', 'warning', itemId);
        return false;
      }
      this.inventory.remove(itemId);
      this.notifier.push('Bloque reventado', 'success', itemId);
    } else if (effect.kind === 'heal') {
      if (this.player.health >= this.player.maxHealth) {
        this.notifier.push('Ya estas al maximo de vida.', 'warning', itemId);
        return false;
      }
      if (this.player.potionCooldown > 0) {
        const seconds = Math.ceil(this.player.potionCooldown / 1000);
        this.notifier.push(`Todavia no: ${seconds}s de espera.`, 'warning', itemId);
        return false;
      }
      this.inventory.remove(itemId);
      this.player.heal(effect.amount);
      this.player.startPotionCooldown();
      this.notifier.push(`+${effect.amount} PV`, 'success', itemId);
    } else {
      this.inventory.remove(itemId);
      this.wallet.gain(effect.amount);
    }

    this.achievements.check();
    GameEvents.notifySync('player', 'inventory');
    return true;
  }

  /** Vende objetos de la mochila al precio de venta del item. */
  sell(itemId: ItemId, amount = 1): boolean {
    const item = getItem(itemId);
    if (item.sellPrice <= 0) return false;
    if (this.player.isEquipped(itemId) && this.inventory.count(itemId) <= amount) {
      this.notifier.push('No puedes vender lo que llevas puesto.', 'warning', itemId);
      return false;
    }
    if (!this.inventory.remove(itemId, amount)) return false;
    this.wallet.gain(item.sellPrice * amount);
    this.achievements.check();
    GameEvents.notifySync('inventory', 'wallet');
    return true;
  }

  /** Viaja a otra zona y genera un objetivo nuevo. */
  travel(zoneId: string): void {
    if (this.bosses.isFighting) {
      this.notifier.push('No puedes viajar en mitad de una pelea.', 'warning');
      return;
    }
    if (!this.zones.travel(zoneId)) return;
    this.battle.reset();
    this.save.save();
  }

  /**
   * Coste de reforjar una pieza. Se paga en el Taller del Inventor y sale a un
   * tercio del valor de venta, con un minimo para que las piezas baratas no
   * salgan gratis.
   */
  reforgeCost(itemId: ItemId): number {
    return Math.max(500, Math.floor(getItem(itemId).sellPrice / 3));
  }

  canReforge(itemId: ItemId): boolean {
    return this.reforgeBlockedReason(itemId) === null;
  }

  /**
   * Por que no se puede reforjar, o null si se puede. Reforjar es cosa del
   * Inventor duende, como en Terraria: no basta con tener el taller, hay que
   * tenerlo a el viviendo en el pueblo.
   */
  reforgeBlockedReason(itemId: ItemId): string | null {
    const item = getItem(itemId);
    if (!canHavePrefix(item)) return 'Las armaduras no llevan rasgo';
    if (!this.inventory.has(itemId)) return 'No lo tienes';
    if (!this.npcs.isHoused('goblin_tinkerer')) {
      return 'Solo el Inventor duende reforja: dale una casa';
    }
    if (!this.wallet.canAfford(this.reforgeCost(itemId))) return 'No te llega el dinero';
    return null;
  }

  /**
   * Reforja en bucle hasta que sale el rasgo buscado, se acaba el dinero o se
   * agotan los intentos. `target` puede ser el id de un rasgo concreto o
   * 'good' para cualquiera que no sea de los malos.
   *
   * El tope de intentos existe para que un objetivo caro no congele la pestana:
   * el bucle es sincrono, y con un 3% de probabilidad la espera media son 33
   * tiradas pero la cola es larga.
   */
  autoReforge(itemId: ItemId, target: string, maxAttempts = AUTO_REFORGE_MAX_ATTEMPTS): {
    attempts: number;
    spent: number;
    hit: boolean;
  } {
    let attempts = 0;
    let spent = 0;

    const matches = (): boolean => {
      const current = this.inventory.prefixOf(itemId);
      if (!current) return false;
      if (target === 'good') return getPrefix(current)?.bad !== true;
      return current === target;
    };

    if (matches()) return { attempts: 0, spent: 0, hit: true };

    while (attempts < maxAttempts) {
      const cost = this.reforgeCost(itemId);
      if (!this.canReforge(itemId)) break;
      attempts += 1;
      spent += cost;
      // reforgeSilent en vez de reforge: un aviso por tirada llenaria la
      // pantalla de toasts en un bucle de cientos.
      this.reforgeSilent(itemId);
      if (matches()) break;
    }

    const hit = matches();
    const item = getItem(itemId);
    if (hit) {
      const prefix = getPrefix(this.inventory.prefixOf(itemId));
      this.notifier.push(
        `${prefix?.name} ${item.name} en ${attempts} tirada${attempts === 1 ? '' : 's'}`,
        'achievement',
        itemId,
      );
    } else {
      this.notifier.push(
        `${attempts} tiradas sin suerte. Sigue pulsando.`,
        'warning',
        itemId,
      );
    }
    this.battle.onEquipmentChanged();
    GameEvents.notifySync('inventory', 'player', 'wallet');
    return { attempts, spent, hit };
  }

  /** Una tirada de reforjado sin aviso ni repintado. La usa autoReforge(). */
  private reforgeSilent(itemId: ItemId): boolean {
    if (!this.wallet.spend(this.reforgeCost(itemId))) return false;
    this.inventory.setPrefix(itemId, rollPrefix(getItem(itemId)));
    return true;
  }

  /** Cambia el rasgo de una pieza por otro al azar, pagando. */
  reforge(itemId: ItemId): boolean {
    if (!this.canReforge(itemId)) return false;
    if (!this.wallet.spend(this.reforgeCost(itemId))) return false;

    const prefixId = rollPrefix(getItem(itemId));
    this.inventory.setPrefix(itemId, prefixId);
    const prefix = getPrefix(prefixId ?? undefined);
    this.notifier.push(
      prefix ? `${prefix.name} ${getItem(itemId).name}` : 'Sin rasgo esta vez',
      prefix?.bad ? 'warning' : 'success',
      itemId,
    );
    this.battle.onEquipmentChanged();
    GameEvents.notifySync('inventory', 'player', 'wallet');
    return true;
  }

  /** Borra la partida y empieza de cero. */
  hardReset(): void {
    // El orden importa: primero se corta el autoguardado y el guardado de salida,
    // porque si no beforeunload volveria a escribir la partida que acabamos de borrar.
    this.resetting = true;
    this.stop();
    this.save.clear();
    window.location.reload();
  }
}

/** Crea el juego y lo cuelga del singleton App. Se llama una vez en main.tsx. */
export function bootstrap(): Game {
  const game = new Game();
  App.game = game;
  game.start();
  return game;
}
