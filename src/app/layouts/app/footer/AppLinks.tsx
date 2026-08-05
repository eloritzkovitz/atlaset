import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
  linkClassName = "ms-3 hover:!text-info rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-focus",
  showDocs = true,
  showGitHub = true,
  direction = "row",
}: AppLinksProps) {
  const { t } = useTranslation("common");

  const links = [
    { href: "/about", label: t("navigation.links.about", "About") },
    { href: "/changelog", label: t("navigation.links.changelog", "Changelog") },
    {
      href: "/privacy",
      label: t("navigation.links.privacy", "Privacy Policy"),
    },
    showDocs
      ? { href: "/docs", label: t("navigation.links.docs", "Docs") }
      : undefined,
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
          <Link key={link.label} to={link.href} className={linkClassName}>
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
