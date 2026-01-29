import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Separator } from "@components";
import changelog from "../../CHANGELOG.md?raw";

export default function ChangelogPage() {
  return (
    <div className="prose prose-slate dark:prose-invert mx-auto p-4 max-w-3xl">
      <h1 className="mb-20 text-3xl font-bold text-center">Changelog</h1>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
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
          ul: ({ ...props }) => (
            <ul className="list-disc ml-6 mb-4" {...props} />
          ),
          li: ({ ...props }) => <li className="mb-1" {...props} />,
          code({
            inline,
            className,
            children,
          }: ComponentProps<"code"> & { inline?: boolean }) {
            if (inline) {
              return (
                <code className="rounded px-1 py-0.5 text-sm">{children}</code>
              );
            }
            return (
              <SyntaxHighlighter
                style={oneLight}
                language=""
                PreTag="div"
                className={className}
              >
                {String(children ?? "").replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {changelog.split("\n").slice(1).join("\n")}
      </ReactMarkdown>
    </div>
  );
}
