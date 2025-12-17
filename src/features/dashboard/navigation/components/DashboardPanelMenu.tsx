import { useState } from "react";
import {
  FaBars,
  FaChartSimple,
  FaGlobe,
  FaSuitcaseRolling,
} from "react-icons/fa6";
import { Panel, SubmenuSection } from "@components";
import {
  COUNTRIES_SUBMENU,
  TRIPS_SUBMENU,
} from "@features/dashboard/navigation/config/menu";
import { useIsMobile } from "@hooks/useIsMobile";

interface DashboardPanelMenuProps {
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
}

export function DashboardPanelMenu({
  selectedPanel,
  setSelectedPanel,
}: DashboardPanelMenuProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [countriesExpanded, setCountriesExpanded] = useState(true);
  const [tripsExpanded, setTripsExpanded] = useState(true);

  const panelContent = (
    <Panel
      title={
        <>
          <FaChartSimple />
          Dashboard
        </>
      }
      width={220}
      className="!left-0"
      onHide={() => setOpen(false)}
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
            if (isMobile) setOpen(false);
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
            if (isMobile) setOpen(false);
          }}
        />
      </ul>
    </Panel>
  );

  if (isMobile) {
    return (
      <>
        <button
          className="p-2 m-2"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <FaBars className="text-2xl" />
        </button>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed top-0 left-0 h-full !w-64 z-50 shadow-lg transition-transform duration-300 bg-surface">
              {panelContent}
            </div>
          </>
        )}
      </>
    );
  }

  return panelContent;
}
