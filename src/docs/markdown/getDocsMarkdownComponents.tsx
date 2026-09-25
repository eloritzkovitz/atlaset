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
      const linkClassName =
        "!text-info !underline hover:!text-info-hover transition-colors break-words";

      const linkStyle = { wordBreak: "break-word" as const };

      // Same-document anchor link
      if (href?.startsWith("#")) {
        return (
          <a
            href={href}
            className={linkClassName}
            style={linkStyle}
            onClick={(e) => {
              e.preventDefault();

              const target = document.getElementById(href.slice(1));

              target?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            {...props}
          >
            {children}
          </a>
        );
      }

      // Documentation page link
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
            className={`${linkClassName} cursor-pointer`}
            style={linkStyle}
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
          className={linkClassName}
          style={linkStyle}
          {...props}
        >
          {children}
        </a>
      );
    },
  });
}
