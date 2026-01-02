import { UserSearchDropdown } from "@features/user";
import { useIsMobile } from "@hooks";
import { Branding } from "../Branding/Branding";
import { UserMenu } from "../UserMenu/UserMenu";

export function Header() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-alt shadow-sm">
      <div className="flex items-center h-full px-6">
        <Branding />
        <UserSearchDropdown />
        <div className="flex-1" />
        {!isMobile && <UserMenu />}
      </div>
    </header>
  );
}
