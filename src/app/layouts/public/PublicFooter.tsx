import { AppLinks, BrandCopyright } from "@components";
import { LanguageSelect } from "@features/settings/account/components/LanguageSelect";

export function PublicFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="bg-surface py-4 text-center">
      {children}
      <div className="flex items-center justify-center font-semibold mt-2 mb-1 gap-8">
        <BrandCopyright />
        <AppLinks
          className="!text-muted gap-8"
          linkClassName="!text-muted hover:text-muted/70"
        />
        <LanguageSelect />
      </div>
    </footer>
  );
}
