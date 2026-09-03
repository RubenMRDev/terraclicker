import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from './Root';
import { bootstrap } from './modules/Game';
import './styles/game.css';

// El juego se crea antes de montar React: los componentes leen App.game en su
// primer render y necesitan que los modulos ya existan.
const gameInstance = bootstrap();

// En desarrollo el juego queda accesible desde la consola para trastear y
// depurar: window.game.inventory.gain('Iron_Bar', 50), etc.
if (import.meta.env.DEV) {
  (window as unknown as { game: typeof gameInstance }).game = gameInstance;

  // El juego es un singleton con un bucle propio: un hot-reload parcial dejaria
  // dos instancias vivas y estados a medias. Se fuerza recarga completa.
  import.meta.hot?.accept(() => {
    import.meta.hot?.invalidate();
  });
}

const container = document.getElementById('root');
if (!container) throw new Error('Falta el elemento #root en index.html');

createRoot(container).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
