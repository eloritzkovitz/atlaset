import { FaGear } from "react-icons/fa6";
import { SidePanelMenu } from "@components";
import { SETTINGS_MENU } from "../constants/settingsMenu";

interface SettingsPanelMenuProps {
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
  canEdit: boolean;
  open?: boolean;
  onClose?: () => void;
}

export function SettingsPanelMenu({
  selectedPanel,
  setSelectedPanel,
  canEdit,
  open,
  onClose,
}: SettingsPanelMenuProps) {
  const menuItems = (
    canEdit
      ? SETTINGS_MENU
      : SETTINGS_MENU.filter((item) => item.key !== "edit")
  ).map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
  }));

  return (
    <SidePanelMenu
      title={
        <>
          <FaGear className="mr-1" />
          Settings
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
