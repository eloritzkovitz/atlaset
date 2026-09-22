import React, { type AnchorHTMLAttributes, type ReactNode } from "react";
import { MarkdownCodeBlock } from "./MarkdownCodeBlock";
import { MarkdownHeading } from "./MarkdownHeading";
import { KeyCombo } from "../KeyCombo";
import { Separator } from "../../layout/Separator";
import { ICONS } from "@constants/icons";

export interface MarkdownComponentOverrides {
  h1?: (props: React.HTMLAttributes<HTMLHeadingElement>) => React.ReactNode;
  h2?: (
    props: React.HTMLAttributes<HTMLHeadingElement> & {
      node?: { position?: { start?: { line?: number } } };
    },
  ) => React.ReactNode;
  a?: (
    props: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode },
  ) => React.ReactNode;
  ul?: (props: React.HTMLProps<HTMLUListElement>) => React.ReactNode;
  ol?: (props: React.HTMLProps<HTMLOListElement>) => React.ReactNode;
  li?: (props: React.LiHTMLAttributes<HTMLLIElement>) => React.ReactNode;
}

/**
 * Gets the base markdown components with optional overrides.
 * @param overrides - Custom component overrides
 * @returns Markdown components with applied overrides
 */
export function getBaseMarkdownComponents(
  overrides: MarkdownComponentOverrides = {},
) {
  return {
    hr: () => <Separator className="my-6" />,

    blockquote: (props: React.HTMLProps<HTMLElement>) => {
      return (
        <blockquote className="relative my-6 p-4 ps-6 border-l-4 border-surface bg-surface-alt/40 dark:bg-surface/30 text-base rounded-md shadow-sm">
          <span className="block">{props.children}</span>
        </blockquote>
      );
    },

    pre: MarkdownCodeBlock,

    h1:
      overrides.h1 ||
      ((props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <>
          <h1
            className="mt-0 mb-6 text-xl text-action-text-hover font-bold"
            {...props}
          />
          <Separator className="mb-4" />
        </>
      )),

    h2:
      overrides.h2 ||
      ((
        props: React.HTMLAttributes<HTMLHeadingElement> & {
          node?: { position?: { start?: { line?: number } } };
        },
      ) => {
        const isFirst = props.node?.position?.start?.line === 3;
        const { className, ...rest } = props;

        return (
          <>
            {!isFirst && <Separator className="my-6" />}

            <MarkdownHeading
              level={2}
              className={`mt-10 mb-8 text-3xl font-semibold text-action-text-hover hover:underline ${className ?? ""}`}
              {...rest}
            />
          </>
        );
      }),

    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
      const { className, ...rest } = props;

      return (
        <MarkdownHeading
          level={3}
          className={`mt-6 mb-4 text-2xl font-semibold text-action-text-hover hover:underline ${className ?? ""}`}
          {...rest}
        />
      );
    },

    h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className="mt-6 mb-2 text-lg font-semibold text-action-text-hover"
        {...props}
      />
    ),

    a:
      overrides.a ||
      (({
        href,
        children,
        ...props
      }: AnchorHTMLAttributes<HTMLAnchorElement> & {
        children?: ReactNode;
      }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="!text-info underline hover:!text-info-hover transition-colors"
          {...props}
        >
          {children}
        </a>
      )),

    ul:
      overrides.ul ||
      ((props: React.HTMLProps<HTMLUListElement>) => (
        <ul className="list-disc ps-6 mb-4" {...props} />
      )),

    ol:
      overrides.ol ||
      ((props: React.OlHTMLAttributes<HTMLOListElement>) => (
        <ol className="list-decimal ps-6 mb-4" {...props} />
      )),

    li:
      overrides.li ||
      ((props: React.LiHTMLAttributes<HTMLLIElement>) => (
        <li className="py-2" style={{ minHeight: "2.25rem" }} {...props}>
          <span className="leading-relaxed">{props.children}</span>
        </li>
      )),

    code({ children, className, ...props }: React.ComponentProps<"code">) {
      if (!className?.startsWith("language-")) {
        return (
          <code
            className="bg-code-bg text-code-text rounded px-1 py-0.5 text-sm align-baseline font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },

    kbd: (props: React.HTMLAttributes<HTMLElement>) => {
      const { children } = props;
      let keys: string[] = [];

      if (typeof children === "string") {
        keys = children.split("+").map((k) => k.trim());
      } else if (Array.isArray(children)) {
        keys = children.map((c) => (typeof c === "string" ? c.trim() : ""));
      } else if (children) {
        keys = [String(children)];
      }

      return <KeyCombo keys={keys} />;
    },

    icon: ({ name, className }: { name?: string; className?: string }) => {
      if (!name) return null;

      type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

      const icon = name.split(".").reduce<unknown>((value, key) => {
        if (typeof value !== "object" || value === null) return undefined;

        return key in value
          ? (value as Record<string, unknown>)[key]
          : undefined;
      }, ICONS);

      if (typeof icon !== "function") return null;

      const Icon = icon as IconComponent;

      return (
        <Icon
          className={`inline-block h-4 w-4 align-middle ${className ?? ""}`}
          aria-hidden="true"
        />
      );
    },

    table: (props: React.HTMLProps<HTMLTableElement>) => (
      <table
        className={
          (props.className ? props.className + " " : "") +
          "min-w-full border-collapse my-6 rounded-xl overflow-hidden"
        }
      >
        {props.children}
      </table>
    ),

    th: (props: React.HTMLProps<HTMLTableCellElement>) => (
      <th className="px-4 py-2 text-left font-semibold bg-surface-alt border-b border-surface-alt">
        {props.children}
      </th>
    ),

    tr: (props: React.HTMLProps<HTMLTableRowElement>) => (
      <tr className="bg-surface-alt/40 hover:bg-primary-hover/10 transition-colors">
        {props.children}
      </tr>
    ),

    td: (props: React.HTMLProps<HTMLTableCellElement>) => (
      <td className="px-4 py-2 border-b border-surface/80">{props.children}</td>
    ),
  };
}
