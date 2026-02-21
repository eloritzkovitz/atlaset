import React, { useState } from "react";
import { useScreenSize } from "@hooks";
import { DrawerPanel } from "./DrawerPanel";
import { Panel } from "./Panel";
import { MenuButton } from "../Menu/MenuButton";
import { HamburgerButton } from "../../action/HamburgerButton";

export interface SidePanelMenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SidePanelMenuProps {
  title: React.ReactNode;
  menuItems: SidePanelMenuItem[];
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
  open?: boolean;
  onClose?: () => void;
  width?: number;
  showHamburger?: boolean;
  menuButtonClassName?: string;
}

/**
 * Generic side panel menu.
 * Handles panel, drawer, and hamburger logic for mobile/desktop.
 */
export function SidePanelMenu({
  title,
  menuItems,
  selectedPanel,
  setSelectedPanel,
  open: openProp,
  onClose: onCloseProp,
  width = 250,
  showHamburger = true,
  menuButtonClassName = "w-full px-2 !text-lg font-semibold",
}: SidePanelMenuProps) {
  const { isLaptop, isMobile } = useScreenSize();
  const [localOpen, setLocalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : localOpen;
  const onClose =
    onCloseProp !== undefined ? onCloseProp : () => setLocalOpen(false);

  // Panel content
  const panelContent = (
    <Panel
      title={title}
      width={width}
      className={isMobile ? "!left-0" : undefined}
      onHide={onClose}
    >
      <ul className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <li key={item.key}>
            <MenuButton
              icon={item.icon}
              active={selectedPanel === item.key}
              onClick={() => {
                setSelectedPanel(item.key);
                if (isMobile && onClose) onClose();
              }}
              className={menuButtonClassName}
            >
              {item.label}
            </MenuButton>
          </li>
        ))}
      </ul>
    </Panel>
  );

  // Mobile/laptop: show hamburger and drawer
  if (isMobile || isLaptop) {
    return (
      <>
        {showHamburger && openProp === undefined && (
          <HamburgerButton
            onClick={() => setLocalOpen(true)}
            className="left-18 !top-2.5"
          />
        )}
        <DrawerPanel open={!!open} onClose={onClose} width={width + 30}>
          {panelContent}
        </DrawerPanel>
      </>
    );
  }

  // Desktop: always show panel
  return panelContent;
}
