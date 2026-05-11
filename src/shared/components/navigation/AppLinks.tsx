import { type JSX } from "react";
import { GitHubButton } from "./GitHubButton";

interface AppLinksProps {
  className?: string;
  linkClassName?: string;
  showDocs?: boolean;
  showGitHub?: boolean;
  direction?: "row" | "col";
}

/** Centralized application links. */
export function AppLinks({
  className = "",
  linkClassName = "ms-3 hover:!text-info",
  showDocs = true,
  showGitHub = true,
  direction = "row",
}: AppLinksProps) {
  const links = [
    { href: "/about", label: "About" },
    { href: "/changelog", label: "Changelog" },
    { href: "/privacy", label: "Privacy Policy" },
    showDocs ? { href: "/docs", label: "Docs" } : undefined,
    showGitHub ? (
      <GitHubButton key="github" className={linkClassName} />
    ) : undefined,
  ].filter(
    (item): item is { href: string; label: string } | JSX.Element =>
      item !== undefined,
  );

  return (
    <div
      className={
        direction === "col"
          ? `flex flex-col gap-2 ${className}`
          : `flex items-center justify-center gap-2 ${className}`
      }
    >
      {links.map((link) => {
        if (typeof link === "object" && "type" in link) {
          return link;
        }
        return (
          <a key={link.label} href={link.href} className={linkClassName}>
            {link.label}
          </a>
        );
      })}
    </div>
  );
}
