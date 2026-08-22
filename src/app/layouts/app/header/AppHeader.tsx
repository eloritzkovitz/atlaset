import { useUI } from "@app/contexts/UIContext";
import { SearchDropdown } from "@features/search/components/SearchDropdown";
import { useScreenSize } from "@hooks";
import { HeaderActions } from "./HeaderActions/HeaderActions";

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

  return (
    <header
      className={`absolute z-30 flex w-auto items-center end-6
        transition-transform duration-300
        ${
          !uiVisible || !show
            ? "top-0 -translate-y-[calc(100%+1rem)] opacity-0 pointer-events-none"
            : "top-4 translate-y-0 opacity-100"
        }
      `}
    >
      <div className="flex h-10 flex-1 justify-end gap-4">
        {!isMobile && <SearchDropdown />}
        <HeaderActions fixed={false} />
      </div>
    </header>
  );
}
