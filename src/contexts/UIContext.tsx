import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useKeyHandler } from "@hooks/useKeyHandler";

interface UIContextType {
  uiVisible: boolean;
  setUiVisible: (v: boolean | ((prev: boolean) => boolean)) => void;
  showMenu: boolean;
  setShowMenu: (v: boolean) => void;
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
  openModal: ModalSelection;
  setOpenModal: (v: ModalSelection) => void;
  showLegend: boolean;
  toggleLegend: () => void;
  showShortcuts: boolean;
  toggleShortcuts: () => void;
  closeModal: () => void;
}

// Type for panel selection
type PanelSelection =
  | "countries"
  | "markers"
  | "overlays"
  | "export"
  | "settings"
  | null;

// Type for modal selection
type ModalSelection = "shortcuts" | "legend" | "countryDetails" | null;

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [uiVisible, setUiVisible] = useState(true);

  // State for which panel is open; null means no panel is open
  const [showMenu, setShowMenu] = useState(false);
  const [openPanel, setOpenPanel] = useState<PanelSelection>("countries");
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
  const [openModal, setOpenModal] = useState<ModalSelection>(null);

  // Derived states for individual modals
  const showShortcuts = openModal === "shortcuts";
  const showLegend = openModal === "legend";

  const toggleLegend = () =>
    setOpenModal((prev) => (prev === "legend" ? null : "legend"));
  const toggleShortcuts = () =>
    setOpenModal((prev) => (prev === "shortcuts" ? null : "shortcuts"));
  const closeModal = () => setOpenModal(null);

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
    // Only reopen countries if a different panel (not countries) was just closed
    if (
      prevOpenPanel.current !== null &&
      prevOpenPanel.current !== "countries" &&
      openPanel === null
    ) {
      setOpenPanel("countries");
    }
    prevOpenPanel.current = openPanel;
  }, [openPanel]);

  return (
    <UIContext.Provider
      value={{
        uiVisible,
        setUiVisible,
        showMenu,
        setShowMenu,
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
        openModal,
        setOpenModal,
        showLegend,
        toggleLegend,
        showShortcuts,
        toggleShortcuts,
        closeModal,
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
