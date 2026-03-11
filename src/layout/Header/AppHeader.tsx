import { UserMenu } from "../UserMenu/UserMenu";
import { SearchDropdown } from "@features/search/components/SearchDropdown";

interface AppHeaderProps {
  show: boolean;
  showSearch?: boolean;
}

/** Renders the application header.
 * @param show - whether to show the header
 * @param showSearch - whether to show the search dropdown
 */
export function AppHeader({ show, showSearch = true }: AppHeaderProps) {
  return (
    <header
      className={`absolute transition-transform duration-300 z-30 w-auto w-full flex items-center right-6
        ${
          show
            ? "top-4 translate-y-0 opacity-100"
            : "top-0 -translate-y-[calc(100%+1rem)] opacity-0 pointer-events-none"
        }
      `}
    >
      <div className="flex flex-1 justify-end gap-4 h-10">
        {showSearch && <SearchDropdown />}
        <UserMenu fixed={false} />
      </div>
    </header>
  );
}
