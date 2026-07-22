import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarRightExpand,
} from "react-icons/tb";
import { DEFAULT_SIDEBAR_WIDTH } from "@constants/ui";
import { useScreenSize } from "@hooks";
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

  const [localOpen, setLocalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : localOpen;
  const onClose =
    onCloseProp !== undefined ? onCloseProp : () => setLocalOpen(false);

  const isRTL = document.documentElement.dir === "rtl";

  // Render the appropriate sidebar icon based on RTL and open state
  const SidebarIcon = isRTL
    ? TbLayoutSidebarRightExpand
    : TbLayoutSidebarLeftExpand;

  // Panel content
  const panelContent = (
    <Panel
      title={title}
      width={width}
      className={isMobile ? "!start-0" : undefined}
      onHide={isMobile || isLaptop ? onClose : undefined}
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
                if (isMobile && onClose) onClose();
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
            onClick={() => setLocalOpen(true)}
            className={`fixed top-3.5 ${showSidebar ? "start-18" : "start-2"} z-20`}
            aria-label={t("sidePanel.open")}
            title={t("sidePanel.open")}
          />
        )}
        <DrawerPanel
          open={!!open}
          onClose={onClose}
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
