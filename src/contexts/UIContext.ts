import { createContext, useContext } from "react";

export interface UIContextType {
  uiVisible: boolean;
  setUiVisible: (v: boolean | ((prev: boolean) => boolean)) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (v: boolean) => void;
  showCountries: boolean;
  toggleCountries: () => void;
  showFilters: boolean;
  toggleFilters: () => void;
  showMarkers: boolean;
  toggleMarkers: () => void;
  showOverlays: boolean;
  toggleOverlays: () => void;
  showExport: boolean;
  toggleExport: () => void;
  showSettings: boolean;
  toggleSettings: () => void;
  showFriends: boolean;
  toggleFriends: () => void;
  closePanel: () => void;
  modalOpen: boolean;
  setModalOpen: (v: boolean) => void;
  showLegend: boolean;
  toggleLegend: () => void;
  showShortcuts: boolean;
  toggleShortcuts: () => void;
  closeLegend: () => void;
  closeShortcuts: () => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
