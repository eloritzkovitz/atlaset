import React from "react";
import { useTranslation } from "react-i18next";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";
import { DEFAULT_SIDEBAR_WIDTH } from "@constants/ui";
import { useDisclosure, useScreenSize } from "@hooks";
import { MenuButton } from "./MenuButton";
import { ActionButton } from "../../inputs/Button/ActionButton";
import { Panel } from "../../overlay/Panel/Panel";
import { DrawerPanel } from "../../overlay/Drawer/DrawerPanel";

export interface SidePanelMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  url?: string;
}

export interface SidePanelMenuProps {
  title: React.ReactNode;
  menuItems: SidePanelMenuItem[];
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
  open?: boolean;
  onClose?: () => void;
  width?: number;
  collapsed?: boolean;
  animationsEnabled?: boolean;
  menuButtonClassName?: string;
  showSidebar?: boolean;
  children?: React.ReactNode;
}

/** Generic side panel menu. Handles panel, drawer, and dynamic panel toggle logic for mobile/desktop. */
export function SidePanelMenu({
  title,
  menuItems,
  selectedPanel,
  setSelectedPanel,
  open: openProp,
  onClose: onCloseProp,
  width = 250,
  collapsed = true,
  animationsEnabled = true,
  menuButtonClassName = "w-full px-2 !text-lg font-semibold",
  showSidebar = true,
  children,
}: SidePanelMenuProps) {
  const { isLaptop, isMobile } = useScreenSize();
  const { t } = useTranslation("common");

  const modal = useDisclosure();

  // Support controlled mode (props passed) or uncontrolled mode (internal modal state)
  const isOpen = openProp !== undefined ? openProp : modal.isOpen;
  const handleClose = onCloseProp ?? modal.close;

  const isRtl = document.documentElement.dir === "rtl";

  // Render the appropriate sidebar icon based on RTL and open state
  const SidebarIcon = isRtl
    ? TbLayoutSidebarRightExpand
    : TbLayoutSidebarLeftExpand;

  // Panel content
  const panelContent = (
    <Panel
      title={title}
      width={width}
      className={isMobile ? "!start-0" : undefined}
      onHide={isMobile || isLaptop ? handleClose : undefined}
      animationsEnabled={animationsEnabled}
      showSidebar={showSidebar}
    >
      <ul className="flex flex-col gap-2 p-1">
        {menuItems.map((item) => (
          <li key={item.key}>
            <MenuButton
              url={item.url}
              icon={item.icon}
              active={selectedPanel === item.key}
              className={menuButtonClassName}
              onClick={() => {
                setSelectedPanel(item.key);
                if (isMobile) handleClose();
              }}
            >
              {item.label}
            </MenuButton>
          </li>
        ))}
      </ul>
      {children}
    </Panel>
  );

  // Mobile/laptop: show toggle button and drawer
  if (isMobile || isLaptop) {
    return (
      <>
        {collapsed && (
          <ActionButton
            type="button"
            icon={<SidebarIcon className="text-3xl text-muted" />}
            onClick={() => modal.open()}
            className={`fixed top-3.5 ${showSidebar ? "start-18" : "start-2"} z-20`}
            aria-label={t("actions.openMenu", "Open menu")}
            title={t("actions.openMenu", "Open menu")}
          />
        )}
        <DrawerPanel
          open={isOpen}
          onClose={handleClose}
          width={width + (showSidebar ? DEFAULT_SIDEBAR_WIDTH : 0)}
        >
          {panelContent}
        </DrawerPanel>
      </>
    );
  }

  // Desktop: always show panel
  return panelContent;
}
