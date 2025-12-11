interface MenuButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  ariaLabel?: string;
  title?: string;
  className?: string;
}

export function MenuButton({
  type = "button",
  onClick,
  icon,
  children,
  active = false,
  ariaLabel,
  title,
  className = "",
}: MenuButtonProps) {
  return (
    <button
      type={type}
      className={
        `rounded-lg text-left px-2 py-2 flex items-center gap-2 ` +
        (active ? "bg-primary/70 font-semibold " : "hover:bg-sidebar-hover ") +
        className
      }
      onClick={onClick}
      aria-label={ariaLabel}
      title={title}
    >
      {icon}
      {children}
    </button>
  );
}
