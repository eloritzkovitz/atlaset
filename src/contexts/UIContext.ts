import { createContext, useContext } from "react";
import type { Trip } from "@features/trips/types";
import type {
  MapToolbarPanelSelection,
  UserPanelSelection,
} from "./UIProvider";

export interface UIContextType {
  uiVisible: boolean;
  setUiVisible: (v: boolean | ((prev: boolean) => boolean)) => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (v: boolean) => void;
  openMapToolbarPanel: MapToolbarPanelSelection;
  showCountries: boolean;
  toggleCountries: () => void;
  showFilters: boolean;
  toggleFilters: () => void;
  showLayers: boolean;
  toggleLayers: () => void;
  showMarkers: boolean;
  toggleMarkers: () => void;
  showSavedMaps: boolean;
  toggleSavedMaps: () => void;
  showExport: boolean;
  toggleExport: () => void;
  showSettings: boolean;
  toggleSettings: () => void;
  openUserPanel: UserPanelSelection;
  showFriends: boolean;
  toggleFriends: () => void;
  showHelp: boolean;
  toggleHelp: () => void;
  closePanel: () => void;
  modalOpen: boolean;
  setModalOpen: (v: boolean) => void;
  showLegend: boolean;
  toggleLegend: () => void;
  showShortcuts: boolean;
  toggleShortcuts: () => void;
  closeLegend: () => void;
  closeShortcuts: () => void;
  showCalendar: boolean;
  calendarDate?: Date;
  handleViewInCalendar: (trip: Trip) => void;
  toggleCalendar: () => void;
  closeCalendar: () => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
