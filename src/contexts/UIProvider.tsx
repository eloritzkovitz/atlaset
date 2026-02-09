import { useEffect, useRef, useState, type ReactNode } from "react";
import { useIsMobile, useKeyHandler } from "@hooks";
import { UIContext } from "./UIContext";

// Type for panel selection
type PanelSelection =
  | "countries"
  | "layers"
  | "markers"
  | "savedmaps"
  | "export"
  | "settings"
  | null;

// Type for user panels
type UserPanelSelection = "friends" | "help" | null;

export function UIProvider({ children }: { children: ReactNode }) {
  const [uiVisible, setUiVisible] = useState(true);
  const isMobile = useIsMobile();

  // State for which panel is open; null means no panel is open
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [openPanel, setOpenPanel] = useState<PanelSelection>(
    isMobile ? null : "countries",
  );
  const prevOpenPanel = useRef<PanelSelection>(openPanel);
  const [showFilters, setShowFilters] = useState(false);
  const [rightPanel, setRightPanel] = useState<UserPanelSelection>(null);

  // Filters toggle: only works if countries panel is open
  const toggleFilters = () => {
    if (openPanel === "countries") setShowFilters((prev) => !prev);
  };

  // Ensure showFilters is false whenever countries panel is closed
  useEffect(() => {
    if (openPanel !== "countries" && showFilters) {
      setShowFilters(false);
    }
  }, [openPanel, showFilters]);

  // Derived states for individual panels
  const showCountries = openPanel === "countries";
  const showMarkers = openPanel === "markers";
  const showLayers = openPanel === "layers";
  const showSaved = openPanel === "savedmaps";
  const showExport = openPanel === "export";
  const showSettings = openPanel === "settings";

  // Map panels
  const toggleUiVisible = () => setUiVisible((prev) => !prev);
  const toggleCountries = () =>
    setOpenPanel((prev) => (prev === "countries" ? null : "countries"));
  const toggleLayers = () =>
    setOpenPanel((prev) => (prev === "layers" ? null : "layers"));
  const toggleMarkers = () =>
    setOpenPanel((prev) => (prev === "markers" ? null : "markers"));
  const toggleSaved = () =>
    setOpenPanel((prev) => (prev === "savedmaps" ? null : "savedmaps"));
  const toggleExport = () =>
    setOpenPanel((prev) => (prev === "export" ? null : "export"));
  const toggleSettings = () =>
    setOpenPanel((prev) => (prev === "settings" ? null : "settings"));

  // User panels
  const toggleFriends = () => {
    setRightPanel((prev) => (prev === "friends" ? null : "friends"));
  };
  const toggleHelp = () => {
    setRightPanel((prev) => (prev === "help" ? null : "help"));
  };

  // Derived states for user panels
  const showFriends = rightPanel === "friends";
  const showHelp = rightPanel === "help";

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const closePanel = () => setOpenPanel(null);

  // Derived states for individual modals
  const [showLegend, setShowLegend] = useState(false);
  const toggleLegend = () => setShowLegend((prev) => !prev);
  const closeLegend = () => setShowLegend(false);

  const [showShortcuts, setShowShortcuts] = useState(false);
  const toggleShortcuts = () => setShowShortcuts((prev) => !prev);
  const closeShortcuts = () => setShowShortcuts(false);

  // Toggle UI visibility with "U"
  useKeyHandler(toggleUiVisible, ["u", "U"], true);

  // Toggle Friends panel with "N"
  useKeyHandler(toggleFriends, ["n", "N"], true);

  // Toggle Help panel with "H"
  useKeyHandler(toggleHelp, ["h", "H"], true);

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
        showLayers,
        toggleLayers,
        showMarkers,
        toggleMarkers,
        showExport,
        toggleExport,
        showSettings,
        toggleSettings,
        showFriends,
        toggleFriends,
        showSaved,
        toggleSaved,
        showHelp,
        toggleHelp,
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
