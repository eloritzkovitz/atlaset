import type { Components } from "react-markdown";
import { ErrorMessage } from "@components";
import { useMarkdown } from "@lib/markdown";

interface MarkdownFileRendererProps {
  content: string;
  error?: string | null;
  components?: Components;
  title?: string;
}

export function MarkdownFileRenderer({
  content,
  error,
  components,
  title,
}: MarkdownFileRendererProps) {
  const plugins = useMarkdown();

  // If there's an error, display the error message
  if (error) return <ErrorMessage error={error} />;

  // If content or plugins are not available, return null to avoid rendering
  if (!content || !plugins) return null;

  if (!plugins) {
    return (
      <div className="mx-auto mb-30 w-full max-w-full animate-pulse px-2 sm:px-4 md:px-0">
        <div className="h-8 w-1/3 rounded bg-surface-alt mb-4" />
        <div className="h-4 w-full rounded bg-surface-alt mb-2" />
        <div className="h-4 w-5/6 rounded bg-surface-alt" />
      </div>
    );
  }

  const { ReactMarkdown, remarkGfm, rehypeRaw, rehypePrism } = plugins;

  return (
    <div className="prose prose-slate dark:prose-invert mx-auto mb-30 w-full max-w-full px-2 sm:px-4 md:px-0 text-sm sm:text-base">
      {title && <h1>{title}</h1>}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypePrism]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
