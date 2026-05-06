import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("dashboard");

  const menuItems = mapMenuItems(
    DASHBOARD_MENU.map((it) => ({
      ...it,
      label: t(`menu.${it.key}`, { defaultValue: it.label }),
    })),
  );

  return (
    <SidePanelMenu
      title={
        <>
          <DashboardIcon className="me-1" />
          {t("menu.title", { defaultValue: "Dashboard" })}
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
