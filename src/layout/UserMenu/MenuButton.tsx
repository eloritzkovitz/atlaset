interface MenuButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function MenuButton({ onClick, icon, children }: MenuButtonProps) {
  return (
    <button
      className="w-full rounded-lg text-left px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}
