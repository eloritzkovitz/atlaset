import type { Components } from "react-markdown";
import { ErrorMessage } from "@components";
import { useMarkdownRenderer } from "@hooks";

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
  const { ReactMarkdown, remarkGfm, rehypeRaw, rehypePrism } = useMarkdownRenderer();
  if (error) return <ErrorMessage error={error} />;
  if (!content || !ReactMarkdown || !remarkGfm || !rehypeRaw) return null;
  return (
    <div className="prose prose-slate dark:prose-invert mx-auto mb-30">
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
