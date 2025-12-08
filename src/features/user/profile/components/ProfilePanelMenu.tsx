import { Panel } from "@components";
import { PROFILE_MENU } from "@features/user/profile/constants/profileMenu";

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
        <span className="flex items-center gap-2">
          {PROFILE_MENU[0].icon}
          Profile
        </span>
      }
      width={220}
    >
      <ul>
        {menuItems.map((item) => (
          <li key={item.key}>
            <button
              className={`flex items-center gap-2 w-full text-left px-4 py-2 rounded mb-2 font-medium transition
                ${
                  selectedPanel === item.key
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                }`}
              onClick={() => setSelectedPanel(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
