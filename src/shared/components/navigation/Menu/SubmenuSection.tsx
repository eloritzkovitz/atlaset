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
  const iconClassName =
    "flex items-center justify-center w-10 h-10 rounded-full bg-muted/25";

  return (
    <li className="mb-2">
      <CollapsibleHeader
        icon={icon}
        iconClassName={iconClassName}
        label={label}
        expanded={expanded}
        onToggle={onToggle}
        className="px-2 py-2 rounded-lg hover:bg-sidebar-btn-hover transition-colors"
      >
        <ul className="mt-2">
          {submenu.map((sub) => (
            <li key={sub.key} className="mb-1">
              <MenuButton
                active={selectedPanel === sub.key}
                onClick={() => setSelectedPanel(sub.key)}
                ariaLabel={sub.label}
                icon={sub.icon}
                iconClassName={iconClassName}
                className="w-full mx-2 gap-4"
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
