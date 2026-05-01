import { NavLink } from "react-router-dom";
import { MenuButton, Tooltip } from "@components";
import { useTranslation } from "react-i18next";

interface SidebarMenuLinkProps {
  to: string;
  icon: React.ReactNode;
  label?: string;
  labelKey?: string;
  expanded: boolean;
  end?: boolean;
}

export function SidebarMenuLink({
  to,
  icon,
  label,
  labelKey,
  expanded,
  end,
}: SidebarMenuLinkProps) {
  const { t } = useTranslation("common");
  const resolvedLabel = labelKey ? t(labelKey) : label || "";

  return (
    <NavLink to={to} end={end} tabIndex={-1}>
      {({ isActive }) => {
        const button = (
          <MenuButton
            icon={icon}
            active={isActive}
            ariaLabel={resolvedLabel}
            className={`text-2xl gap-3 ${
              !expanded ? "ms-1 me-1 pe-2" : "w-full"
            }`}
          >
            {expanded && resolvedLabel}
          </MenuButton>
        );
        return !expanded ? (
          <Tooltip content={resolvedLabel} position="right">
            {button}
          </Tooltip>
        ) : (
          button
        );
      }}
    </NavLink>
  );
}
