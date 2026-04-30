import { DashboardIcon, mapMenuItems, SidePanelMenu } from "@components";
import { DASHBOARD_MENU } from "../constants/dashboardMenu";

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
  const menuItems = mapMenuItems(DASHBOARD_MENU);

  return (
    <SidePanelMenu
      title={
        <>
          <DashboardIcon className="me-1" />
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
