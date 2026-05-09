import { AppLinks, BrandCopyright } from "@components";

export function PublicFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="bg-surface-alt py-4 text-center text-sm">
      {children}
      <div className="mt-2 mb-1 font-semibold flex items-center justify-center gap-2">
        <BrandCopyright showLogo={true} />
        <AppLinks
          className="!text-muted"
          linkClassName="ms-3 !text-muted hover:text-muted/70"
        />
      </div>
    </footer>
  );
}
