import { UserMenu } from "../UserMenu/UserMenu";
import { UserSearchDropdown } from "@features/user/search/components/UserSearchDropdown";

interface AppHeaderProps {
  show: boolean;
  showSearch?: boolean;
  isScrollable: boolean;
}

/** Renders the application header.
 * @param show - whether to show the header
 * @param showSearch - whether to show the search dropdown
 * @param isScrollable - whether the main content is scrollable
 */
export function AppHeader({
  show,
  showSearch = true,
  isScrollable,
}: AppHeaderProps) {
  return (
    <header
      className={`absolute transition-transform duration-300 z-30 w-auto w-full flex items-center
        ${isScrollable ? "right-6" : "right-4"}
        ${
          show
            ? "top-4 translate-y-0 opacity-100"
            : "top-0 -translate-y-[calc(100%+1rem)] opacity-0 pointer-events-none"
        }
      `}
    >
      <div className="flex flex-1 justify-end gap-4">
        {showSearch && <UserSearchDropdown />}
        <UserMenu fixed={false} />
      </div>
    </header>
  );
}
