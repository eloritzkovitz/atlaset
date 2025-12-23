import { DrawerPanel, MenuButton, Panel } from "@components";
import { useIsMobile } from "@hooks/useIsMobile";
import { Branding } from "@layout";
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
  const isMobile = useIsMobile();

  const menuItems = canEdit
    ? SETTINGS_MENU
    : SETTINGS_MENU.filter((item) => item.key !== "edit");

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
      onHide={onClose}
    >
      <ul>
        {menuItems.map((item) => (
          <li key={item.key}>
            <MenuButton
              icon={item.icon}
              active={selectedPanel === item.key}
              onClick={() => {
                setSelectedPanel(item.key);
                if (isMobile && onClose) onClose();
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

  // Mobile: drawer
  if (isMobile) {
    return (
      <DrawerPanel open={!!open} onClose={onClose!} width={256}>
        {panelContent}
      </DrawerPanel>
    );
  }

  // Desktop: always show panel
  return panelContent;
}
