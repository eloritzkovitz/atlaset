import type { Components } from "react-markdown";
import { ErrorMessage } from "@components";
import { useMarkdown } from "@lib/markdown";

interface MarkdownFileRendererProps {
  content: string;
  error?: string | null;
  components?: Components;
  title?: string;
}

/** Renders a markdown file with the given content and optional error handling. */
export function MarkdownFileRenderer({
  content,
  error,
  components,
  title,
}: MarkdownFileRendererProps) {
  const plugins = useMarkdown();

  if (error) return <ErrorMessage error={error} />;

  if (!content) return null;

  if (!plugins) {
    return (
      <div className="mx-auto mb-30 w-full max-w-full animate-pulse px-2 sm:px-4 md:px-0">
        <div className="h-8 w-1/3 rounded bg-surface-alt mb-4" />
        <div className="h-4 w-full rounded bg-surface-alt mb-2" />
        <div className="h-4 w-5/6 rounded bg-surface-alt" />
      </div>
    );
  }

  const { ReactMarkdown, remarkGfm, rehypeTypeScript } = plugins;

  return (
    <div className="prose prose-slate dark:prose-invert mx-auto mb-30 w-full max-w-full px-2 sm:px-4 md:px-0 text-sm sm:text-base">
      {title && <h1>{title}</h1>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeTypeScript]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
