import React, { useEffect, useState, type ComponentProps } from "react";
import { ErrorMessage, Separator } from "@components";
import { useMarkdownRenderer } from "@hooks";

export default function ChangelogPage() {
  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { ReactMarkdown, remarkGfm, rehypeRaw } = useMarkdownRenderer();

  // Fetch changelog and load markdown renderer on mount
  useEffect(() => {
    fetch("/CHANGELOG.md")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load changelog");
        return res.text();
      })
      .then((text) => setMarkdown(text))
      .catch((err) => setError(err.message));
  }, []);

  // Custom components for markdown rendering
  type H2Props = { node?: { position?: { start?: { line?: number } } }; [key: string]: unknown };
  type LiProps = { children: React.ReactNode[]; [key: string]: unknown };

  const components = {
    h2: ({ node, ...props }: H2Props) => {
      const isFirst = node?.position?.start?.line === 2;
      return (
        <>
          {!isFirst && <Separator className="my-6" />}
          <h2 className="mt-8 mb-2 text-xl text-muted" {...props} />
        </>
      );
    },
    ul: (props: React.HTMLProps<HTMLUListElement>) => <ul className="ml-0 mb-4" {...props} />,
    li: ({ children, ...props }: LiProps) => {
      let tag: React.ReactNode = null;
      let text: React.ReactNode[] = children;
      if (Array.isArray(children)) {
        const tagIdx = children.findIndex(
          (c) => {
            if (React.isValidElement(c) && c.type === "span") {
              const el = c as React.ReactElement<{ className?: string }>;
              return el.props.className?.includes("changelog-tag");
            }
            return false;
          }
        );
        if (tagIdx !== -1) {
          tag = children[tagIdx];
          text = [...children.slice(0, tagIdx), ...children.slice(tagIdx + 1)];
        }
      }
      return (
        <li
          className="flex items-start list-none pl-0 py-2"
          style={{ minHeight: "2.25rem" }}
          {...props}
        >
          {tag && (
            <span className="flex-shrink-0 self-center inline-flex justify-center text-center min-w-[5.5em] mr-2">
              {tag}
            </span>
          )}
          <span className="leading-relaxed">{text}</span>
        </li>
      );
    },
    code({ inline, children }: ComponentProps<"code"> & { inline?: boolean }) {
      if (inline) {
        return <code className="rounded px-1 py-0.5 text-sm">{children}</code>;
      }
      return (
        <pre className="bg-input rounded p-3 overflow-x-auto my-4">
          <code className="text-sm">{children}</code>
        </pre>
      );
    },
  };

  // Only render when everything is loaded
  if (!markdown || !ReactMarkdown || !remarkGfm || !rehypeRaw) return null;

  // Show error if any
  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <div className="prose prose-slate dark:prose-invert mx-auto p-4 max-w-3xl">
      <title>Changelog | Atlaset</title>
      <h1 className="mb-20 text-3xl font-bold text-center">Changelog</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {markdown.split("\n").slice(1).join("\n")}
      </ReactMarkdown>
    </div>
  );
}
