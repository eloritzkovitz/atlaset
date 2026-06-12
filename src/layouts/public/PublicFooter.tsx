import { AppLinks, BrandCopyright } from "@components";
import { LanguageSelect } from "../language/LangtuageSelect";

export function PublicFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="bg-surface-alt py-4 text-center">
      {children}
      <div className="flex items-center justify-center font-semibold mt-2 mb-1 gap-8">
        <BrandCopyright showLogo={true} />
        <AppLinks
          className="!text-muted gap-8"
          linkClassName="ms-3 !text-muted hover:text-muted/70"
        />
        <LanguageSelect />
      </div>
    </footer>
  );
}
