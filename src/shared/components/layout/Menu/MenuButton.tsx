import { Tooltip } from "../../ui/Tooltip/Tooltip";
import { Link } from "react-router-dom";

interface MenuButtonProps {
  url?: string;
  type?: "button" | "submit" | "reset";
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
  onClick?: () => void;
  onMouseDown?: () => void;
  onPointerDown?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MenuButton({
  url,
  type = "button",
  icon,
  children,
  active = false,
  className = "",
  disabled,
  ariaLabel,
  title,
  onClick,
  onMouseDown,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
}: MenuButtonProps) {
  const baseClass =
    `rounded-lg text-left px-2 py-2 text-text flex items-center gap-2 ` +
    (active
      ? "bg-primary dark:bg-primary/70 text-white font-semibold "
      : "hover:bg-sidebar-btn-hover ") +
    className;

  const sharedProps = {
    className: baseClass,
    "aria-label": ariaLabel,
    onMouseEnter,
    onMouseLeave,
    children: (
      <>
        {icon}
        {children}
      </>
    ),
  };

  const content = url ? (
    <Link
      to={url}
      tabIndex={disabled ? -1 : 0}
      style={disabled ? { pointerEvents: "none", opacity: 0.5 } : undefined}
      {...sharedProps}
    />
  ) : (
    <button
      type={type}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onPointerDown={onPointerDown}
      disabled={disabled}
      {...sharedProps}
    />
  );

  return title ? (
    <Tooltip content={title} position="top">
      {content}
    </Tooltip>
  ) : (
    content
  );
}
