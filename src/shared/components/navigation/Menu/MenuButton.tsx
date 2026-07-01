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
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  title?: string;
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
  onContextMenu,
  ...props
}: MenuButtonProps) {
  const baseClass =
    `rounded-lg text-left !text-text font-semibold px-2 py-2 flex items-center gap-2 ` +
    (active
      ? "bg-primary dark:bg-primary/70 !text-white font-semibold "
      : variant === "sidebar"
        ? "hover:bg-sidebar-btn-hover "
        : "hover:bg-surface-hover ") +
    className;

  const content = (
    <InteractiveBase
      url={url}
      type={type}
      disabled={disabled}
      className={baseClass}
      ariaLabel={ariaLabel}
      onContextMenu={onContextMenu}
      {...props}
    >
      {icon}
      {children}
    </InteractiveBase>
  );

  return title ? (
    <Tooltip content={title} position="top">
      {content}
    </Tooltip>
  ) : (
    content
  );
}
