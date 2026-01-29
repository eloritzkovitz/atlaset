import { useEffect, useState } from "react";

/**
 * Loads markdown renderer and plugins dynamically
 */
export function useMarkdownRenderer() {
  const [ReactMarkdown, setReactMarkdown] = useState<React.ComponentType<{
    [key: string]: unknown;
  }> | null>(null);
  const [remarkGfm, setRemarkGfm] = useState<
    ((...args: unknown[]) => unknown) | object | null
  >(null);
  const [rehypeRaw, setRehypeRaw] = useState<
    ((...args: unknown[]) => unknown) | object | null
  >(null);

  // Dynamically import markdown renderer and plugins on mount
  useEffect(() => {
    import("react-markdown").then((mod) => setReactMarkdown(() => mod.default));
    import("remark-gfm").then((mod) => setRemarkGfm(() => mod.default));
    import("rehype-raw").then((mod) => setRehypeRaw(() => mod.default));
  }, []);

  return { ReactMarkdown, remarkGfm, rehypeRaw };
}
