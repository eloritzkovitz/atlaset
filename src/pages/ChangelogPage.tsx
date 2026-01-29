import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Separator } from "@components";
import changelog from "../../CHANGELOG.md?raw";

export default function ChangelogPage() {
  return (
    <div className="prose prose-slate dark:prose-invert mx-auto p-4 max-w-3xl">
      <h1 className="mb-20 text-3xl font-bold text-center">Changelog</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h2: ({ node, ...props }) => {
            const isFirst = node?.position?.start.line === 2;
            return (
              <>
                {!isFirst && <Separator className="my-6" />}
                <h2 className="mt-8 mb-2 text-xl text-muted" {...props} />
              </>
            );
          },
          ul: ({ ...props }) => <ul className="ml-0 mb-4" {...props} />,
          li: ({ children, ...props }) => {
            let tag = null;
            let text = children;
            if (Array.isArray(children)) {
              const tagIdx = children.findIndex(
                (c) =>
                  c &&
                  typeof c === "object" &&
                  c.type === "span" &&
                  c.props?.className?.includes("changelog-tag"),
              );
              if (tagIdx !== -1) {
                tag = children[tagIdx];
                text = [
                  ...children.slice(0, tagIdx),
                  ...children.slice(tagIdx + 1),
                ];
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
          code({
            inline,
            children,
          }: ComponentProps<"code"> & { inline?: boolean }) {
            if (inline) {
              return (
                <code className="rounded px-1 py-0.5 text-sm">{children}</code>
              );
            }
            return (
              <pre className="bg-input rounded p-3 overflow-x-auto my-4">
                <code className="text-sm">{children}</code>
              </pre>
            );
          },
        }}
      >
        {changelog.split("\n").slice(1).join("\n")}
      </ReactMarkdown>
    </div>
  );
}
