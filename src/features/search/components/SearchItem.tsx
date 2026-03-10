import { type ReactNode } from "react";

interface SearchItemProps<T> {
  item: T;
  displayName: string;
  label?: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  children?: ReactNode;
}

/** Renders a search item in the dropdown. */
export function SearchItem<T>({
  item,
  displayName,
  label,
  icon,
  onClick,
  children,
}: SearchItemProps<T>) {
  return (
    <li>
      <button
        type="button"
        className="w-full flex items-center gap-3 px-2 py-2"
        onClick={() => onClick(item)}
        aria-label={`Go to ${displayName}`}
      >
        {icon}
        <div className="flex flex-col items-start">
          <span className="font-medium">{displayName}</span>
          <span className="text-sm text-muted">
            {label ? label : <>&nbsp;</>}
          </span>
          {children}
        </div>
      </button>
    </li>
  );
}
