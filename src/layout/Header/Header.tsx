import { SearchInput } from "@components";
import { useIsMobile } from "@hooks/useIsMobile";
import { Branding } from "../Branding/Branding";
import { UserMenu } from "../UserMenu/UserMenu";

export function Header() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-alt shadow-sm">
      <div className="flex items-center justify-between h-full px-6 gap-4">
        <Branding />
        <SearchInput value="Search" onChange={() => {}} className="max-w-xs" />
        {!isMobile && <UserMenu />}
      </div>
    </header>
  );
}
