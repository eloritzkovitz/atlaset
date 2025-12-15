import { NavLink } from "react-router-dom";
import { MenuButton } from "@components";

interface SidebarMenuLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  expanded: boolean;
  end?: boolean;
}

export function SidebarMenuLink({
  to,
  icon,
  label,
  expanded,
  end,
}: SidebarMenuLinkProps) {
  return (
    <NavLink to={to} end={end} tabIndex={-1}>
      {({ isActive }) => (
        <MenuButton
          icon={icon}
          active={isActive}
          ariaLabel={label}
          title={label}
          className={`text-2xl gap-3 ${
            !expanded ? "ml-1 mr-1 pr-2" : "w-full"
          }`}
        >
          {expanded && label}
        </MenuButton>
      )}
    </NavLink>
  );
}
