import { AuthButtons } from "./AuthButtons";
import { BrandingWithLabel } from "../Branding/BrandingWithLabel";

interface PublicHeaderProps {
  showButtons?: boolean;
}

export function PublicHeader({ showButtons }: PublicHeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-6 py-2">
      <BrandingWithLabel />
      {showButtons && <AuthButtons />}
    </header>
  );
}
