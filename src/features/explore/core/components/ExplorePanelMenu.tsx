import { useTranslation } from "react-i18next";
import { mapMenuItems, SidePanelMenu } from "@components";
import { ICONS } from "@constants/icons";
import { useAccessibility } from "@features/settings/accessibility";
import { EXPLORE_MENU } from "../constants/exploreMenu";

interface ExplorePanelMenuProps {
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
  open?: boolean;
  onClose?: () => void;
}

export function ExplorePanelMenu({
  selectedPanel,
  setSelectedPanel,
  open,
  onClose,
}: ExplorePanelMenuProps) {
  const { animationsEnabled } = useAccessibility();
  const { t } = useTranslation("explore");

  const menuItems = mapMenuItems(
    EXPLORE_MENU.map((it) => ({
      ...it,
      label: t(`menu.${it.key}`, { defaultValue: it.label }),
    })),
  );

  return (
    <SidePanelMenu
      title={
        <>
          <ICONS.explore className="me-1" />
          {t("menu.title", "Explore")}
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
