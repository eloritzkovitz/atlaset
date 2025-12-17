import { Branding, MenuButton, Panel } from "@components";
import { PROFILE_MENU } from "../constants/profileMenu";
import { useIsMobile } from "@hooks/useIsMobile";
import { useState } from "react";
import { FaBars } from "react-icons/fa6";

interface ProfilePanelMenuProps {
  selectedPanel: string;
  setSelectedPanel: (key: string) => void;
  canEdit: boolean;
}

export function ProfilePanelMenu({
  selectedPanel,
  setSelectedPanel,
  canEdit,
}: ProfilePanelMenuProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const menuItems = canEdit
    ? PROFILE_MENU
    : PROFILE_MENU.filter((item) => item.key !== "edit");

  // Panel content
  const panelContent = (
    <Panel
      title={
        <div className="flex items-center gap-2 px-2">
          <Branding size={36} />
          <span className="font-bold text-2xl">Atlaset</span>
        </div>
      }
      width={220}
      className="!left-0"
      onHide={() => setOpen(false)}
    >
      <ul>
        {menuItems.map((item) => (
          <li key={item.key}>
            <MenuButton
              icon={item.icon}
              active={selectedPanel === item.key}
              onClick={() => {
                setSelectedPanel(item.key);
                if (isMobile) setOpen(false);
              }}
              className="w-full mb-2"
            >
              {item.label}
            </MenuButton>
          </li>
        ))}
      </ul>
    </Panel>
  );

  // Mobile: hamburger + drawer
  if (isMobile) {
    return (
      <>
        <button
          className="p-2 m-2"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <FaBars className="text-2xl" />
        </button>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed top-0 left-0 h-full !w-64 z-50 shadow-lg transition-transform duration-300 bg-surface">
              {panelContent}
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop: always show panel
  return panelContent;
}
