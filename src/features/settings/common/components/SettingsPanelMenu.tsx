import { FaGear } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { mapMenuItems, SidePanelMenu } from "@components";
import { useAccessibility } from "@features/settings";
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
  const { animationsEnabled } = useAccessibility();
  const { t } = useTranslation("settings");

  const menuConfig = (
    canEdit
      ? SETTINGS_MENU
      : SETTINGS_MENU.filter((item) => item.key !== "edit")
  ).map((item) => ({ ...item, label: t(`menu.${item.key}`) }));

  const menuItems = mapMenuItems(menuConfig);

  return (
    <SidePanelMenu
      title={
        <>
          <FaGear className="me-1" />
          {t("title")}
        </>
      }
      menuItems={menuItems}
      selectedPanel={selectedPanel}
      setSelectedPanel={setSelectedPanel}
      open={open}
      onClose={onClose}
      width={250}
      animationsEnabled={animationsEnabled}
    />
  );
}
