import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Trip } from "@features/trips/types";
import { useDisclosure, useScreenSize } from "@hooks";
import { UIContext } from "./UIContext";

export type MapToolbarPanelSelection =
  | "countries"
  | "layers"
  | "markers"
  | "savedmaps"
  | "export"
  | "settings"
  | null;

export type UserPanelSelection = "friends" | "search" | "help" | null;

export function UIProvider({ children }: { children: ReactNode }) {
  const { isMobile } = useScreenSize();

  // Global UI State
  const [uiVisible, setUiVisible] = useState(true);
  const sidebar = useDisclosure();
  const modal = useDisclosure();

  // Panels
  const [openMapToolbarPanel, setOpenMapToolbarPanel] =
    useState<MapToolbarPanelSelection>(isMobile ? null : "countries");
  const [openUserPanel, setOpenUserPanel] = useState<UserPanelSelection>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Modals
  const legend = useDisclosure();
  const shortcuts = useDisclosure();
  const calendar = useDisclosure();
  const [calendarDate, setCalendarDate] = useState<Date | undefined>();

  const prevOpenMapToolbarPanel =
    useRef<MapToolbarPanelSelection>(openMapToolbarPanel);

  // Panel Toggle Helpers
  const toggleMapPanel = useCallback((panel: MapToolbarPanelSelection) => {
    setOpenMapToolbarPanel((prev) => (prev === panel ? null : panel));
  }, []);

  const toggleUserPanel = useCallback((panel: UserPanelSelection) => {
    setOpenUserPanel((prev) => (prev === panel ? null : panel));
  }, []);

  // Sync Filters & Map Panels
  const toggleFilters = useCallback(() => {
    if (openMapToolbarPanel === "countries") setShowFilters((prev) => !prev);
  }, [openMapToolbarPanel]);

  useEffect(() => {
    if (openMapToolbarPanel !== "countries" && showFilters) {
      setShowFilters(false);
    }
  }, [openMapToolbarPanel, showFilters]);

  // Handle default panel reset on desktop when menus close
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

  // Calendar Trigger Helper
  const handleViewInCalendar = useCallback(
    (trip: Trip) => {
      if (trip.startDate) setCalendarDate(new Date(trip.startDate));
      calendar.setIsOpen(true);
    },
    [calendar],
  );

  const contextValue = useMemo(
    () => ({
      uiVisible,
      setUiVisible,
      toggleUiVisible: () => setUiVisible((prev) => !prev),
      sidebarExpanded: sidebar.isOpen,
      setSidebarExpanded: sidebar.setIsOpen,
      openMapToolbarPanel,
      setOpenMapToolbarPanel,
      showCountries: openMapToolbarPanel === "countries",
      toggleCountries: () => toggleMapPanel("countries"),
      showFilters,
      toggleFilters,
      showLayers: openMapToolbarPanel === "layers",
      toggleLayers: () => toggleMapPanel("layers"),
      showMarkers: openMapToolbarPanel === "markers",
      toggleMarkers: () => toggleMapPanel("markers"),
      showSavedMaps: openMapToolbarPanel === "savedmaps",
      toggleSavedMaps: () => toggleMapPanel("savedmaps"),
      showExport: openMapToolbarPanel === "export",
      toggleExport: () => toggleMapPanel("export"),
      showSettings: openMapToolbarPanel === "settings",
      toggleSettings: () => toggleMapPanel("settings"),
      closePanel: () => setOpenMapToolbarPanel(null),
      openUserPanel,
      setOpenUserPanel,
      showFriends: openUserPanel === "friends",
      toggleFriends: () => toggleUserPanel("friends"),
      showSearch: openUserPanel === "search" && isMobile,
      toggleSearch: () => toggleUserPanel("search"),
      showHelp: openUserPanel === "help",
      toggleHelp: () => toggleUserPanel("help"),
      modalOpen: modal.isOpen,
      setModalOpen: modal.setIsOpen,
      showLegend: legend.isOpen,
      toggleLegend: legend.toggle,
      closeLegend: legend.close,
      showShortcuts: shortcuts.isOpen,
      toggleShortcuts: shortcuts.toggle,
      closeShortcuts: shortcuts.close,
      showCalendar: calendar.isOpen,
      calendarDate,
      handleViewInCalendar,
      toggleCalendar: calendar.toggle,
      closeCalendar: calendar.close,
    }),
    [
      uiVisible,
      sidebar.isOpen,
      sidebar.setIsOpen,
      openMapToolbarPanel,
      showFilters,
      openUserPanel,
      isMobile,
      modal.isOpen,
      modal.setIsOpen,
      legend,
      shortcuts,
      calendar,
      calendarDate,
      toggleMapPanel,
      toggleUserPanel,
      toggleFilters,
      handleViewInCalendar,
    ],
  );

  return (
    <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>
  );
}
