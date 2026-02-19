import { useState } from "react";
import { FaList } from "react-icons/fa6";
import {
  DashboardIcon,
  DrawerPanel,
  HamburgerButton,
  MenuButton,
  Panel,
} from "@components";
import { DASHBOARD_MENU } from "@features/dashboard/navigation/config/menu";
import { useScreenSize } from "@hooks";

interface DashboardPanelMenuProps {
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
  open?: boolean;
  onClose?: () => void;
}

export function DashboardPanelMenu({
  selectedPanel,
  setSelectedPanel,
  open: openProp,
  onClose: onCloseProp,
}: DashboardPanelMenuProps) {
  const { isLaptop, isMobile } = useScreenSize();

  // If open prop is provided, use it. Otherwise, manage local open state for mobile/laptop.
  const [localOpen, setLocalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : localOpen;
  const onClose =
    onCloseProp !== undefined ? onCloseProp : () => setLocalOpen(false);

  // Panel content
  const panelContent = (
    <Panel
      title={
        <>
          <DashboardIcon size={20} className="mr-1" />
          Dashboard
        </>
      }
      width={250}
      className={isMobile ? "!left-0" : undefined}
      onHide={onClose}
    >
      <ul className="flex flex-col gap-2">
        {DASHBOARD_MENU.map((item) => {
          const Icon = item.icon;
          return (
            <MenuButton
              key={item.key}
              icon={<Icon />}
              active={selectedPanel === item.key}
              onClick={() => {
                setSelectedPanel(item.key);
                if (isMobile && onClose) onClose();
              }}
              className="w-full px-2 !text-lg font-semibold"
            >
              {item.label}
            </MenuButton>
          );
        })}
      </ul>
    </Panel>
  );

  // Mobile and laptop: show hamburger button and drawer if open
  if (isMobile || isLaptop) {
    return (
      <>
        {/* Hamburger button only if not controlled by parent */}
        {openProp === undefined && (
          <HamburgerButton
            onClick={() => setLocalOpen(true)}
            className="left-18 !top-2.5"
            icon={<FaList className="text-2xl" />}
          />
        )}
        <DrawerPanel open={!!open} onClose={onClose} width={280}>
          {panelContent}
        </DrawerPanel>
      </>
    );
  }

  // Desktop: always show panel
  return panelContent;
}
