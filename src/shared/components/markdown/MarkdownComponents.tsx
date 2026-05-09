import React, { type AnchorHTMLAttributes, type ReactNode } from "react";
import { KeyCombo } from "../ui/KeyCombo";
import { Separator } from "../../components";

export interface MarkdownComponentOverrides {
  a?: (
    props: AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode },
  ) => React.ReactNode;
  ul?: (props: React.HTMLProps<HTMLUListElement>) => React.ReactNode;
  li?: (props: React.LiHTMLAttributes<HTMLLIElement>) => React.ReactNode;
  h1?: (props: React.HTMLAttributes<HTMLHeadingElement>) => React.ReactNode;
  h2?: (
    props: React.HTMLAttributes<HTMLHeadingElement> & {
      node?: { position?: { start?: { line?: number } } };
    },
  ) => React.ReactNode;
}

/**
 * Gets the base markdown components with optional overrides.
 * @param overrides - Custom component overrides
 * @returns - Markdown components with applied overrides
 */
export function getBaseMarkdownComponents(
  overrides: MarkdownComponentOverrides = {},
) {
  return {
    hr: () => <Separator className="my-6 opacity-60" />,
    blockquote: (props: React.HTMLProps<HTMLElement>) => {
      return (
        <blockquote className="relative my-6 p-4 ps-6 border-l-4 border-surface bg-surface-alt/40 dark:bg-surface/30 text-base rounded-md shadow-sm">
          <span className="block">{props.children}</span>
        </blockquote>
      );
    },
    h1:
      overrides.h1 ||
      ((props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <>
          <h1
            className="mt-0 mb-6 text-xl text-action-text-hover font-bold"
            {...props}
          />
          <Separator className="mb-4 opacity-50" />
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
        const { ...rest } = props;
        return (
          <>
            {!isFirst && <Separator className="my-6 opacity-60" />}
            <h2
              className="mt-8 mb-2 text-3xl text-action-text-hover"
              {...rest}
            />
          </>
        );
      }),
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className="mt-6 mb-2 text-xl font-semibold text-action-text-hover"
        {...props}
      />
    ),
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
    li:
      overrides.li ||
      ((props: React.LiHTMLAttributes<HTMLLIElement>) => (
        <li className="py-2" style={{ minHeight: "2.25rem" }} {...props}>
          <span className="leading-relaxed">{props.children}</span>
        </li>
      )),
    code({ children, className, ...props }: React.ComponentProps<"code">) {
      const isBlock = className && className.startsWith("language-");
      // Inline code styling
      if (!isBlock) {
        return (
          <code
            className="bg-surface text-code rounded px-1 py-0.5 text-sm align-baseline font-mono"
            {...props}
          >
            {children}
          </code>
        );
      }
      // Block code styling
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
