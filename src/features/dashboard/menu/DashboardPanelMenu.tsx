import { useState } from "react";
import { FaChartSimple, FaGlobe, FaSuitcaseRolling } from "react-icons/fa6";
import { Panel, SubmenuSection } from "@components";
import { COUNTRIES_SUBMENU, TRIPS_SUBMENU } from "./menu";

interface DashboardPanelMenuProps {
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
}

export function DashboardPanelMenu({
  selectedPanel,
  setSelectedPanel,
}: DashboardPanelMenuProps) {
  const [countriesExpanded, setCountriesExpanded] = useState(true);
  const [tripsExpanded, setTripsExpanded] = useState(true);

  return (
    <Panel
      title={
        <>
          <FaChartSimple />
          Dashboard
        </>
      }
      width={220}
    >
      <ul>
        <SubmenuSection
          icon={<FaGlobe />}
          label="Countries"
          expanded={countriesExpanded}
          onToggle={() => setCountriesExpanded((e) => !e)}
          submenu={COUNTRIES_SUBMENU}
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
        />
        <SubmenuSection
          icon={<FaSuitcaseRolling />}
          label="Trips"
          expanded={tripsExpanded}
          onToggle={() => setTripsExpanded((e) => !e)}
          submenu={TRIPS_SUBMENU}
          selectedPanel={selectedPanel}
          setSelectedPanel={setSelectedPanel}
        />
      </ul>
    </Panel>
  );
}
