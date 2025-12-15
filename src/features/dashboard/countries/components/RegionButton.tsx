interface RegionButtonProps {
  icon?: React.ReactNode;
  label: string;
  stats?: string;
  onClick?: () => void;
  title?: string;
  className?: string;
  labelClassName?: string;
  statsClassName?: string;
}

export function RegionButton({
  icon,
  label,
  stats,
  onClick,
  title,
  className = "",
  labelClassName = "",
  statsClassName = "",
}: RegionButtonProps) {
  return (
    <button
      className={`flex items-center w-full rounded-lg transition cursor-pointer focus:outline-none text-blue-500 hover:bg-surface-hover ${className}`}
      onClick={onClick}
      title={title}
      aria-label={title}
    >
      {icon}
      <span className={`font-semibold ${labelClassName}`}>{label}</span>
      {stats && (
        <span className={`ml-auto font-bold ${statsClassName}`}>{stats}</span>
      )}
    </button>
  );
}
