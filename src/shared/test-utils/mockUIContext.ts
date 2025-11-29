import type { UIContextType } from "@contexts/UIContext";
import { vi } from "vitest";

export const mockUIContext: UIContextType = {
  uiVisible: true,
  setUiVisible: vi.fn(),
  showMenu: false,
  setShowMenu: vi.fn(),
  showCountries: false,
  toggleCountries: vi.fn(),
  showFilters: false,
  toggleFilters: vi.fn(),
  showMarkers: false,
  toggleMarkers: vi.fn(),
  showOverlays: false,
  toggleOverlays: vi.fn(),
  showExport: false,
  toggleExport: vi.fn(),
  showSettings: false,
  toggleSettings: vi.fn(),
  closePanel: vi.fn(),
  openModal: null,
  setOpenModal: vi.fn(),
  showLegend: false,
  toggleLegend: vi.fn(),
  showShortcuts: false,
  toggleShortcuts: vi.fn(),
  closeModal: vi.fn(),
};