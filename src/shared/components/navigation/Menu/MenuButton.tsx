import { useState } from "react";
import {
  InteractiveBase,
  type InteractiveBaseProps,
} from "../../inputs/InteractiveBase/InteractiveBase";
import { Tooltip } from "../../overlay/Tooltip/Tooltip";

interface MenuButtonProps extends Omit<
  InteractiveBaseProps,
  "children" | "onClick"
> {
  variant?: "default" | "sidebar";
  icon?: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  title?: string;
  titlePosition?: "top" | "bottom" | "left" | "right";
  onClick?: () => void;
  onContextMenu?: React.MouseEventHandler<HTMLElement>;
}

export function MenuButton({
  url,
  type = "button",
  variant = "default",
  icon,
  children,
  active = false,
  className = "",
  disabled,
  ariaLabel,
  title,
  titlePosition = "top",
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  ...props
}: MenuButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const baseClass =
    `rounded-lg text-left !text-text font-semibold px-2 py-2 flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring-focus ` +
    (active
      ? "bg-primary dark:bg-primary/70 !text-white font-semibold "
      : variant === "sidebar"
        ? "hover:bg-sidebar-btn-hover "
        : "hover:bg-surface-hover ") +
    className;

  return (
    <>
      <InteractiveBase
        url={url}
        type={type}
        disabled={disabled}
        className={baseClass}
        ariaLabel={ariaLabel}
        onContextMenu={onContextMenu}
        onMouseEnter={(e) => {
          if (title && !disabled) setAnchorEl(e.currentTarget);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setAnchorEl(null);
          onMouseLeave?.(e);
        }}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </InteractiveBase>

      {title && anchorEl && (
        <Tooltip content={title} position={titlePosition} target={anchorEl} />
      )}
    </>
  );
}
