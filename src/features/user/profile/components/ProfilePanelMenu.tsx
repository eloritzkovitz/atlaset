import { Branding, MenuButton, Panel } from "@components";
import { PROFILE_MENU } from "../constants/profileMenu";

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
  const menuItems = canEdit
    ? PROFILE_MENU
    : PROFILE_MENU.filter((item) => item.key !== "edit");

  return (
    <Panel
      title={
        <div className="flex items-center gap-2 px-2">
          <Branding size={36} />
          <span className="font-bold text-2xl">Atlaset</span>
        </div>
      }
      width={220}
      className="!left-0"
    >
      <ul>
        {menuItems.map((item) => (
          <li key={item.key}>
            <MenuButton
              icon={item.icon}
              active={selectedPanel === item.key}
              onClick={() => setSelectedPanel(item.key)}
              className="w-full mb-2"
            >
              {item.label}
            </MenuButton>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
