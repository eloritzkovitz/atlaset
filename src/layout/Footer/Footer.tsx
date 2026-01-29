import { GitHubButton } from "./GitHubButton";
import { BrandCopyright } from "../Branding/BrandCopyright";

export function Footer({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="bg-surface-alt py-4 text-center text-sm">
      {children}
      <div className="mt-2 mb-1 font-semibold flex items-center justify-center gap-2">
        <BrandCopyright showLogo={true} />
        <a
          href="/about"
          className="ml-3 !text-muted hover:text-muted/70 underline"
        >
          About
        </a>
        <a
          href="/changelog"
          className="ml-3 !text-muted hover:text-muted/70 underline"
        >
          Changelog
        </a>
        <GitHubButton className="ml-3" />
      </div>
    </footer>
  );
}
