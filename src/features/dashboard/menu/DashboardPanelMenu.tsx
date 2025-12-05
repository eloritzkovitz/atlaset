import { useState } from "react";
import { FaChartSimple, FaGlobe, FaSuitcaseRolling } from "react-icons/fa6";
import { Panel, SubmenuSection } from "@components";
import { EXPLORATION_SUBMENU, TRIPS_SUBMENU } from "./menu";

interface DashboardPanelMenuProps {
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
}

export function DashboardPanelMenu({
  selectedPanel,
  setSelectedPanel,
}: DashboardPanelMenuProps) {
  const [explorationExpanded, setExplorationExpanded] = useState(true);
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
          expanded={explorationExpanded}
          onToggle={() => setExplorationExpanded((e) => !e)}
          submenu={EXPLORATION_SUBMENU}
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
