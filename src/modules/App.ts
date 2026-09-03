import type { Game } from './Game';

/**
 * Singleton global, igual que App.game en pokeclicker. Los modulos se hablan
 * entre si a traves de el, lo que evita las dependencias circulares que darian
 * los imports directos entre controladores.
 *
 * Se rellena en bootstrap() antes de que React monte nada.
 */
export const App: { game: Game } = {
  // Hasta bootstrap() no hay juego; acceder antes es un error de programacion,
  // asi que fallamos con un mensaje claro en vez de con "cannot read of undefined".
  get game(): Game {
    throw new Error('App.game usado antes de bootstrap()');
  },
  set game(value: Game) {
    Object.defineProperty(App, 'game', { value, writable: true, configurable: true });
  },
};
