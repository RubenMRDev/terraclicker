import { GameEvents } from '../GameEvents';
import { breakdownCoins, type CoinBreakdown } from '../GameHelper';

export interface WalletSave {
  copper: number;
  /** Total historico. Se guarda porque hay requisitos que miran lo ganado. */
  earned?: number;
}

/** Monedero. Todo se contabiliza en cobre y se descompone solo al pintarlo. */
export class Wallet {
  private copper = 0;
  /** Total historico ganado, para logros y estadisticas. */
  private earned = 0;

  get total(): number {
    return this.copper;
  }

  get totalEarned(): number {
    return this.earned;
  }

  get breakdown(): CoinBreakdown {
    return breakdownCoins(this.copper);
  }

  gain(amount: number): void {
    const gained = Math.floor(amount);
    if (gained <= 0) return;
    this.copper += gained;
    this.earned += gained;
    GameEvents.notify('wallet');
  }

  canAfford(amount: number): boolean {
    return this.copper >= amount;
  }

  spend(amount: number): boolean {
    if (!this.canAfford(amount)) return false;
    this.copper -= amount;
    GameEvents.notify('wallet');
    return true;
  }

  toJSON(): WalletSave {
    return { copper: this.copper, earned: this.earned };
  }

  fromJSON(save: WalletSave | undefined): void {
    this.copper = Math.max(0, Math.floor(save?.copper ?? 0));
    // Los saves antiguos no guardaban el historico: se parte de lo que hay en
    // la cartera, que es lo mas cerca que se puede estar sin inventarselo.
    this.earned = Math.max(this.copper, Math.floor(save?.earned ?? 0));
  }
}
