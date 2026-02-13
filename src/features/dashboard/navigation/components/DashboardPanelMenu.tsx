import { useState } from "react";
import { HamburgerButton } from "@components";
import { FaGlobe, FaList, FaMedal, FaSuitcaseRolling } from "react-icons/fa6";
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
  open: openProp,
  onClose: onCloseProp,
}: DashboardPanelMenuProps) {
  const { isLaptop, isMobile } = useScreenSize();
  const [countriesExpanded, setCountriesExpanded] = useState(true);
  const [tripsExpanded, setTripsExpanded] = useState(true);

  // Support both controlled (via props) and uncontrolled (internal state) open state for the panel
  const [localOpen, setLocalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : localOpen;
  const onClose =
    onCloseProp !== undefined ? onCloseProp : () => setLocalOpen(false);

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
            if (isMobile && onClose) onClose();
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

  // Mobile and laptop: show hamburger button and drawer if open
  if (isMobile || isLaptop) {
    return (
      <>
        {/* Hamburger button only if not controlled by parent */}
        {openProp === undefined && (
          <HamburgerButton
            onClick={() => setLocalOpen(true)}
            className="left-18 !top-2.5"
            icon={<FaList className="text-2xl" />}
          />
        )}
        <DrawerPanel open={!!open} onClose={onClose} width={280}>
          {panelContent}
        </DrawerPanel>
      </>
    );
  }

  // Desktop: always show panel
  return panelContent;
}
