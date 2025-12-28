interface MenuButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  onMouseDown?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  ariaLabel?: string;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export function MenuButton({
  type = "button",
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  icon,
  children,
  active = false,
  ariaLabel,
  title,
  className = "",
  disabled
}: MenuButtonProps) {
  return (
    <button
      type={type}
      className={
        `rounded-lg text-left px-2 py-2 flex items-center gap-2 ` +
        (active ? "bg-primary dark:bg-primary/70 text-gray-200 font-semibold " : "hover:bg-sidebar-btn-hover ") +
        className
      }
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
    >
      {icon}
      {children}

    </button>
  );
}
