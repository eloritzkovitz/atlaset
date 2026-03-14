import { type ReactNode } from "react";
import { MenuButton } from "@components";

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
      <MenuButton
        type="button"
        icon={
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        }
        onClick={() => onClick(item)}
        ariaLabel={`Go to ${displayName}`}
        className="w-full flex items-center gap-3 px-2 py-2"
      >
        <div className="flex flex-col items-start text-left">
          <span className="font-medium">{displayName}</span>
          <span className="text-sm text-muted">
            {label ? label : <>&nbsp;</>}
          </span>
          {children}
        </div>
      </MenuButton>
    </li>
  );
}
