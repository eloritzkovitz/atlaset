import { useState } from "react";
import { FaChartSimple, FaGlobe, FaSuitcaseRolling } from "react-icons/fa6";
import { CollapsibleHeader, MenuButton, Panel } from "@components";
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
        <li className="mb-2">
          <CollapsibleHeader
            icon={<FaGlobe />}
            label="Exploration"
            expanded={explorationExpanded}
            onToggle={() => setExplorationExpanded((e) => !e)}
          >
            <ul className="ml-4 mt-2">
              {EXPLORATION_SUBMENU.map((sub) => (
                <li key={sub.key} className="mb-1">
                  <MenuButton
                    active={selectedPanel === sub.key}
                    onClick={() => setSelectedPanel(sub.key)}
                    ariaLabel={sub.label}
                    title={sub.label}
                    icon={null}
                    className="w-full"
                  >
                    {sub.label}
                  </MenuButton>
                </li>
              ))}
            </ul>
          </CollapsibleHeader>
        </li>
        <li className="mb-2">
          <CollapsibleHeader
            icon={<FaSuitcaseRolling />}
            label="Trips"
            expanded={tripsExpanded}
            onToggle={() => setTripsExpanded((e) => !e)}
          >
            <ul className="ml-4 mt-2">
              {TRIPS_SUBMENU.map((sub) => (
                <li key={sub.key} className="mb-1">
                  <MenuButton
                    active={selectedPanel === sub.key}
                    onClick={() => setSelectedPanel(sub.key)}
                    ariaLabel={sub.label}
                    title={sub.label}
                    icon={null}
                    className="w-full"
                  >
                    {sub.label}
                  </MenuButton>
                </li>
              ))}
            </ul>
          </CollapsibleHeader>
        </li>
      </ul>
    </Panel>
  );
}
