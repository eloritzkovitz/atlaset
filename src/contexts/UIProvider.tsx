import { useEffect, useRef, useState, type ReactNode } from "react";
import { useKeyHandler, useScreenSize } from "@hooks";
import { UIContext } from "./UIContext";

// Map toolbar panel selection
export type MapToolbarPanelSelection =
  | "countries"
  | "layers"
  | "markers"
  | "savedmaps"
  | "export"
  | "settings"
  | null;

// User panel selection
export type UserPanelSelection = "friends" | "help" | null;

export function UIProvider({ children }: { children: ReactNode }) {
  const [uiVisible, setUiVisible] = useState(true);
  const { isMobile } = useScreenSize();

  // State for which panel is open; null means no panel is open
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [openMapToolbarPanel, setOpenMapToolbarPanel] =
    useState<MapToolbarPanelSelection>(isMobile ? null : "countries");
  const prevOpenMapToolbarPanel =
    useRef<MapToolbarPanelSelection>(openMapToolbarPanel);
  const [showFilters, setShowFilters] = useState(false);
  const [openUserPanel, setOpenUserPanel] = useState<UserPanelSelection>(null);

  // Filters toggle: only works if countries panel is open
  const toggleFilters = () => {
    if (openMapToolbarPanel === "countries") setShowFilters((prev) => !prev);
  };

  // Ensure showFilters is false whenever countries panel is closed
  useEffect(() => {
    if (openMapToolbarPanel !== "countries" && showFilters) {
      setShowFilters(false);
    }
  }, [openMapToolbarPanel, showFilters]);

  // Derived states for map toolbar panels
  const showCountries = openMapToolbarPanel === "countries";
  const showMarkers = openMapToolbarPanel === "markers";
  const showLayers = openMapToolbarPanel === "layers";
  const showSavedMaps = openMapToolbarPanel === "savedmaps";
  const showExport = openMapToolbarPanel === "export";
  const showSettings = openMapToolbarPanel === "settings";

  // Map panels
  const toggleUiVisible = () => setUiVisible((prev) => !prev);
  const toggleCountries = () =>
    setOpenMapToolbarPanel((prev) =>
      prev === "countries" ? null : "countries",
    );
  const toggleLayers = () =>
    setOpenMapToolbarPanel((prev) => (prev === "layers" ? null : "layers"));
  const toggleMarkers = () =>
    setOpenMapToolbarPanel((prev) => (prev === "markers" ? null : "markers"));
  const toggleSavedMaps = () =>
    setOpenMapToolbarPanel((prev) =>
      prev === "savedmaps" ? null : "savedmaps",
    );
  const toggleExport = () =>
    setOpenMapToolbarPanel((prev) => (prev === "export" ? null : "export"));
  const toggleSettings = () =>
    setOpenMapToolbarPanel((prev) => (prev === "settings" ? null : "settings"));

  // User panels
  const toggleFriends = () => {
    setOpenUserPanel((prev) => (prev === "friends" ? null : "friends"));
  };
  const toggleHelp = () => {
    setOpenUserPanel((prev) => (prev === "help" ? null : "help"));
  };

  // Derived states for user panels
  const showFriends = openUserPanel === "friends";
  const showHelp = openUserPanel === "help";

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const closePanel = () => setOpenMapToolbarPanel(null);

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
      prevOpenMapToolbarPanel.current !== null &&
      prevOpenMapToolbarPanel.current !== "countries" &&
      openMapToolbarPanel === null
    ) {
      setOpenMapToolbarPanel("countries");
    }
    prevOpenMapToolbarPanel.current = openMapToolbarPanel;
  }, [openMapToolbarPanel, isMobile]);

  return (
    <UIContext.Provider
      value={{
        uiVisible,
        setUiVisible,
        sidebarExpanded,
        setSidebarExpanded,
        openMapToolbarPanel,
        showCountries,
        toggleCountries,
        showFilters,
        toggleFilters,
        showLayers,
        toggleLayers,
        showMarkers,
        toggleMarkers,
        showSavedMaps,
        toggleSavedMaps,
        showExport,
        toggleExport,
        showSettings,
        toggleSettings,
        openUserPanel,
        showFriends,
        toggleFriends,
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
