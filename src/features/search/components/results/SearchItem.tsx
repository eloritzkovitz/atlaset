import { type ReactNode } from "react";
import { MenuButton } from "@components";
import { useLanguage } from "@features/settings/account";

interface SearchItemProps<T> {
  item: T;
  displayName: string;
  url?: string;
  label?: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  children?: ReactNode;
}

/** Renders a search item in the dropdown. */
export function SearchItem<T>({
  item,
  displayName,
  url,
  label,
  icon,
  onClick,
  children,
}: SearchItemProps<T>) {
  const { isRtl } = useLanguage();
  const contentAlignClass = isRtl
    ? "items-end text-right"
    : "items-start text-left";

  return (
    <li>
      <MenuButton
        type="button"
        url={url}
        icon={
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            {icon}
          </div>
        }
        onClick={() => onClick(item)}
        className="flex w-full items-center gap-3 px-2 py-2"
      >
        <div
          className={`min-w-0 flex-1 ${contentAlignClass}`}
          dir={isRtl ? "rtl" : undefined}
        >
          <span className="block truncate font-medium">{displayName}</span>
          <span className="block truncate text-sm text-muted">
            {label || <>&nbsp;</>}
          </span>
        </div>

        {children}
      </MenuButton>
    </li>
  );
}
