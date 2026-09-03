import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type TabId =
  | 'zone'
  | 'bosses'
  | 'crafting'
  | 'npcs'
  | 'events'
  | 'inventory'
  | 'catalogue'
  | 'achievements'
  | 'statistics'
  | 'settings';

interface UiState {
  tab: TabId;
  /**
   * Texto del buscador del panel de fabricacion. Vive aqui y no dentro del
   * panel para que el catalogo pueda escribirlo al mandarte a la receta, sin
   * que el panel tenga que sincronizarlo con un efecto.
   */
  craftSearch: string;
  goTo: (tab: TabId) => void;
  setCraftSearch: (query: string) => void;
  /** Salta a Fabricacion con el buscador ya puesto en ese objeto. */
  openCrafting: (query: string) => void;
}

const UiContext = createContext<UiState | null>(null);

/**
 * Navegacion entre pestanas, en un contexto en vez de en props: cualquier panel
 * puede mandar al jugador a otro (del catalogo a la mesa de trabajo con el
 * buscador ya escrito, del panel de jefes a la zona del jefe) sin que App tenga
 * que ir pasando callbacks a todos.
 */
export function UiProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<TabId>('zone');
  const [craftSearch, setCraftSearch] = useState('');

  const goTo = useCallback((next: TabId) => setTab(next), []);
  const openCrafting = useCallback((query: string) => {
    setCraftSearch(query);
    setTab('crafting');
  }, []);

  const value = useMemo<UiState>(
    () => ({ tab, craftSearch, goTo, setCraftSearch, openCrafting }),
    [tab, craftSearch, goTo, openCrafting],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiState {
  const value = useContext(UiContext);
  if (!value) throw new Error('useUi() fuera de UiProvider');
  return value;
}
