import { MenuButton } from "./MenuButton";
import { CollapsibleHeader } from "../../display/Collapsible/CollapsibleHeader";

interface SubmenuSectionProps {
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  onToggle: () => void;
  submenu: {
    key: string;
    label: string;
    icon?: React.ReactNode;
    url?: string;
  }[];
  selectedPanel?: string;
  setSelectedPanel: (key: string) => void;
}

export function SubmenuSection({
  icon,
  label,
  expanded,
  onToggle,
  submenu,
  selectedPanel,
  setSelectedPanel,
}: SubmenuSectionProps) {
  return (
    <li className="mb-2">
      <CollapsibleHeader
        icon={icon}
        label={label}
        expanded={expanded}
        onToggle={onToggle}
        className="px-2 py-1 rounded-lg hover:bg-sidebar-btn-hover transition-colors"
      >
        <ul className="mt-2">
          {submenu.map((sub) => (
            <li key={sub.key} className="mb-1">
              <MenuButton
                active={selectedPanel === sub.key}
                onClick={() => setSelectedPanel(sub.key)}
                ariaLabel={sub.label}
                icon={sub.icon}
                className="w-full mx-2 font-semibold gap-5"
                url={sub.url}
              >
                {sub.label}
              </MenuButton>
            </li>
          ))}
        </ul>
      </CollapsibleHeader>
    </li>
  );
}
