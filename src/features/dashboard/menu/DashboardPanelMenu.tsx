import { useState } from "react";
import { FaChartSimple, FaGlobe, FaSuitcaseRolling } from "react-icons/fa6";
import { CollapsibleHeader, MenuButton, Panel } from "@components";

const PANEL_ITEMS = [
  {
    key: "exploration",
    label: "Exploration",
    icon: <FaGlobe />,
  },
];

const TRIPS_SUBMENU = [
  {
    key: "trips-overview",
    label: "Overview",
  },
  {
    key: "trips-month",
    label: "By Month",
  },
];

interface DashboardPanelMenuProps {
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
}

export function DashboardPanelMenu({
  selectedPanel,
  setSelectedPanel,
}: DashboardPanelMenuProps) {
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
        {PANEL_ITEMS.map((item) => (
          <li key={item.key} className="mb-2">
            <MenuButton
              icon={item.icon}
              active={selectedPanel === item.key}
              onClick={() => setSelectedPanel(item.key)}
              ariaLabel={item.label}
              title={item.label}
              className="w-full"
            >
              {item.label}
            </MenuButton>
          </li>
        ))}
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
