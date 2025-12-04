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
        (active
          ? "bg-gray-200 dark:bg-blue-800/70 font-semibold "
          : "hover:bg-gray-100 dark:hover:bg-gray-600 ") +
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
