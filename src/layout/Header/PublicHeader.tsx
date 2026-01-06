import { AuthButtons } from "./AuthButtons";
import { BrandingWithLabel } from "../Branding/BrandingWithLabel";

interface PublicHeaderProps {
  showAuthButtons?: boolean;
}

export function PublicHeader({ showAuthButtons }: PublicHeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-2">
      <BrandingWithLabel />
      {showAuthButtons && <AuthButtons />}
    </header>
  );
}
