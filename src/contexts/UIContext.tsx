import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useIsMobile } from "@hooks/useIsMobile";
import { useKeyHandler } from "@hooks/useKeyHandler";

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

// Type for panel selection
type PanelSelection =
  | "countries"
  | "markers"
  | "overlays"
  | "export"
  | "settings"
  | null;

export const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [uiVisible, setUiVisible] = useState(true);
  const isMobile = useIsMobile();

  // State for which panel is open; null means no panel is open
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [openPanel, setOpenPanel] = useState<PanelSelection>(
    isMobile ? null : "countries"
  );
  const prevOpenPanel = useRef<PanelSelection>(openPanel);
  const [showFilters, setShowFilters] = useState(false);

  // Filters toggle: only works if countries panel is open
  const toggleFilters = () => {
    if (openPanel === "countries") setShowFilters((prev) => !prev);
  };

  // Derived states for individual panels
  const showCountries = openPanel === "countries";
  const showMarkers = openPanel === "markers";
  const showOverlays = openPanel === "overlays";
  const showExport = openPanel === "export";
  const showSettings = openPanel === "settings";

  const toggleUiVisible = () => setUiVisible((prev) => !prev);
  const toggleCountries = () =>
    setOpenPanel((prev) => (prev === "countries" ? null : "countries"));
  const toggleMarkers = () =>
    setOpenPanel((prev) => (prev === "markers" ? null : "markers"));
  const toggleOverlays = () =>
    setOpenPanel((prev) => (prev === "overlays" ? null : "overlays"));
  const toggleExport = () =>
    setOpenPanel((prev) => (prev === "export" ? null : "export"));
  const toggleSettings = () =>
    setOpenPanel((prev) => (prev === "settings" ? null : "settings"));
  const closePanel = () => setOpenPanel(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);

  // Derived states for individual modals
  const [showLegend, setShowLegend] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const toggleLegend = () => setShowLegend((prev) => !prev);
  const toggleShortcuts = () => setShowShortcuts((prev) => !prev);
  const closeLegend = () => setShowLegend(false);
  const closeShortcuts = () => setShowShortcuts(false);

  // Toggle UI visibility with "U"
  useKeyHandler(toggleUiVisible, ["u", "U"], true);

  // Toggle Countries panel with "C"
  useKeyHandler(toggleCountries, ["c", "C"], true);

  // Toggle Filters panel with "F"
  useKeyHandler(toggleFilters, ["f", "F"], true);

  // Toggle Markers panel with "M"
  useKeyHandler(toggleMarkers, ["m", "M"], true);

  // Toggle Overlays panel with "O"
  useKeyHandler(toggleOverlays, ["o", "O"], true);

  // Toggle Legend with "L"
  useKeyHandler(toggleLegend, ["l", "L"], true);

  // Toggle Export panel with "E"
  useKeyHandler(toggleExport, ["e", "E"], true);

  // Toggle Settings panel with "S"
  useKeyHandler(toggleSettings, ["s", "S"], true);

  // Open shortcut modal with "?"
  useKeyHandler(toggleShortcuts, ["?"], true);

  // Effect to open countries panel when menu closes
  useEffect(() => {
    if (
      !isMobile &&
      prevOpenPanel.current !== null &&
      prevOpenPanel.current !== "countries" &&
      openPanel === null
    ) {
      setOpenPanel("countries");
    }
    prevOpenPanel.current = openPanel;
  }, [openPanel, isMobile]);

  return (
    <UIContext.Provider
      value={{
        uiVisible,
        setUiVisible,
        sidebarExpanded,
        setSidebarExpanded,
        showCountries,
        toggleCountries,
        showFilters,
        toggleFilters,
        showMarkers,
        toggleMarkers,
        showOverlays,
        toggleOverlays,
        showExport,
        toggleExport,
        showSettings,
        toggleSettings,
        closePanel,
        modalOpen,
        setModalOpen,
        showLegend,
        toggleLegend,
        closeLegend,
        showShortcuts,
        toggleShortcuts,
        closeShortcuts,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

// Custom hook for easy context access
export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
