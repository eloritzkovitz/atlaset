import { useState } from "react";
import { FaGlobe, FaMedal, FaSuitcaseRolling } from "react-icons/fa6";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { DrawerPanel, Panel, SubmenuSection } from "@components";
import {
  COUNTRIES_SUBMENU,
  TRIPS_SUBMENU,
  ACHIEVEMENTS_MENU,
} from "@features/dashboard/navigation/config/menu";
import { useScreenSize } from "@hooks";

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
  const { isLaptop, isMobile } = useScreenSize();
  const [countriesExpanded, setCountriesExpanded] = useState(true);
  const [tripsExpanded, setTripsExpanded] = useState(true);

  // Panel content
  const panelContent = (
    <Panel
      title={
        <>
          <TbLayoutDashboardFilled />
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
            if ((isMobile || isLaptop) && onClose) onClose();
          }}
        />
        <SubmenuSection
          icon={<FaMedal />}
          label="Achievements"
          expanded={true}
          onToggle={() => {}}
          submenu={ACHIEVEMENTS_MENU}
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

  // Mobile and laptop: drawer
  if (isMobile || isLaptop) {
    return (
      <DrawerPanel open={!!open} onClose={onClose!} width={256}>
        {panelContent}
      </DrawerPanel>
    );
  }

  // Desktop (lg and up): always show panel
  return panelContent;
}
