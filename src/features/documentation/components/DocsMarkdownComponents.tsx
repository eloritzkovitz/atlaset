import type { AnchorHTMLAttributes, ReactNode } from "react";
import { getBaseMarkdownComponents } from "@components";

export function getDocsMarkdownComponents(
  setSelectedPanel?: (panel: string) => void,
) {
  return getBaseMarkdownComponents({
    a: ({
      href,
      children,
      ...props
    }: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }) => {
      if (
        href &&
        href.startsWith("/docs/") &&
        !href.startsWith("/docs/examples/") &&
        typeof setSelectedPanel === "function"
      ) {
        const panel = href.replace("/docs/", "");
        return (
          <a
            href={href}
            className="!text-info underline hover:!text-info-hover transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setSelectedPanel(panel);
            }}
            {...props}
          >
            {children}
          </a>
        );
      }
      // Default link behavior
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="!text-info underline hover:!text-info-hover transition-colors"
          {...props}
        >
          {children}
        </a>
      );
    },
  });
}
