import { useState } from "react";
import { FaChartSimple, FaGlobe, FaSuitcaseRolling } from "react-icons/fa6";
import { DrawerPanel, Panel, SubmenuSection } from "@components";
import {
  COUNTRIES_SUBMENU,
  TRIPS_SUBMENU,
} from "@features/dashboard/navigation/config/menu";
import { useIsMobile } from "@hooks/useIsMobile";

interface DashboardPanelMenuProps {
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
  open?: boolean;
  onClose?: () => void;
}

export function DashboardPanelMenu({
  selectedPanel,
  setSelectedPanel,
  open,
  onClose,
}: DashboardPanelMenuProps) {
  const isMobile = useIsMobile();
  const [countriesExpanded, setCountriesExpanded] = useState(true);
  const [tripsExpanded, setTripsExpanded] = useState(true);

  // Panel content
  const panelContent = (
    <Panel
      title={
        <>
          <FaChartSimple />
          Dashboard
        </>
      }
      width={220}
      className={isMobile ? "!left-0" : undefined}
      onHide={onClose}
    >
      <ul>
        <SubmenuSection
          icon={<FaGlobe />}
          label="Countries"
          expanded={countriesExpanded}
          onToggle={() => setCountriesExpanded((e) => !e)}
          submenu={COUNTRIES_SUBMENU}
          selectedPanel={selectedPanel}
          setSelectedPanel={(key) => {
            setSelectedPanel(key);
            if (isMobile && onClose) onClose();
          }}
        />
        <SubmenuSection
          icon={<FaSuitcaseRolling />}
          label="Trips"
          expanded={tripsExpanded}
          onToggle={() => setTripsExpanded((e) => !e)}
          submenu={TRIPS_SUBMENU}
          selectedPanel={selectedPanel}
          setSelectedPanel={(key) => {
            setSelectedPanel(key);
            if (isMobile && onClose) onClose();
          }}
        />
      </ul>
    </Panel>
  );

  // Mobile: drawer
  if (isMobile) {
    return (
      <DrawerPanel open={!!open} onClose={onClose!} width={256}>
        {panelContent}
      </DrawerPanel>
    );
  }

  // Desktop: always show panel
  return panelContent;
}
