import { FaChartSimple, FaGlobe, FaSuitcaseRolling } from "react-icons/fa6";
import { Panel } from "@components/layout/Panel/Panel";
import { MenuButton } from "@components/layout/Menu/MenuButton";

const PANEL_ITEMS = [
  {
    key: "exploration",
    label: "Exploration",
    icon: <FaGlobe />,
  },
  {
    key: "trips",
    label: "Trips",
    icon: <FaSuitcaseRolling />,
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
  return (
    <Panel
      title={
        <>
          <FaChartSimple />
          Dashboard
        </>
      }
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
      </ul>
    </Panel>
  );
}
