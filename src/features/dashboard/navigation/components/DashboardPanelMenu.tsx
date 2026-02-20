import { DashboardIcon, SidePanelMenu } from "@components";
import { DASHBOARD_MENU } from "../config/menu";

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
  const menuItems = DASHBOARD_MENU.map((item) => {
    const Icon = item.icon;
    return {
      key: item.key,
      label: item.label,
      icon: <Icon />,
    };
  });

  return (
    <SidePanelMenu
      title={
        <>
          <DashboardIcon className="mr-1" />
          Dashboard
        </>
      }
      menuItems={menuItems}
      selectedPanel={selectedPanel}
      setSelectedPanel={setSelectedPanel}
      open={open}
      onClose={onClose}
      width={250}
    />
  );
}
