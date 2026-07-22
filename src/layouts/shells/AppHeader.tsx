import { useUI } from "@contexts/UIContext";
import { SearchDropdown } from "@features/search/components/SearchDropdown";
import { useScreenSize } from "@hooks";
import { UserMenu } from "./UserMenu/UserMenu";

interface AppHeaderProps {
  show: boolean;
  showSearch?: boolean;
}

/** Renders the application header.
 * @param show - whether to show the header
 */
export function AppHeader({ show }: AppHeaderProps) {
  const { isMobile } = useScreenSize();
  const { uiVisible } = useUI();

  // Don't render if UI is not visible
  if (!uiVisible) return null;

  return (
    <header
      className={`absolute transition-transform duration-300 z-30 w-auto flex items-center end-6
        ${
          show
            ? "top-4 translate-y-0 opacity-100"
            : "top-0 -translate-y-[calc(100%+1rem)] opacity-0 pointer-events-none"
        }
      `}
    >
      <div className="flex flex-1 justify-end gap-4 h-10">
        {!isMobile && <SearchDropdown />}
        <UserMenu fixed={false} />
      </div>
    </header>
  );
}
