import { Branding } from "@components";
import { useIsMobile } from "@hooks/useIsMobile";
import { UserMenu } from "../UserMenu/UserMenu";

export function Header() {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-alt shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        <Branding />
        {!isMobile && <UserMenu />}
      </div>
    </header>
  );
}
