import { useState, useEffect } from "react";
import type ReactMarkdown from "react-markdown";
import type remarkGfm from "remark-gfm";
import type rehypeRaw from "rehype-raw";
import type rehypePrism from "rehype-prism-plus";

interface MarkdownPlugins {
  ReactMarkdown: typeof ReactMarkdown;
  remarkGfm: typeof remarkGfm;
  rehypeRaw: typeof rehypeRaw;
  rehypePrism: typeof rehypePrism;
}

/**
 * Dynamically imports and returns the markdown renderer and its plugins.
 * @returns An object containing the ReactMarkdown component and its plugins, or null if not yet loaded.
 */
export function useMarkdown() {
  const [plugins, setPlugins] = useState<MarkdownPlugins | null>(null);

  useEffect(() => {
    Promise.all([
      import("react-markdown"),
      import("remark-gfm"),
      import("rehype-raw"),
      import("rehype-prism-plus"),
    ]).then(([rm, gfm, raw, prism]) => {
      setPlugins({
        ReactMarkdown: rm.default as typeof ReactMarkdown,
        remarkGfm: gfm.default as typeof remarkGfm,
        rehypeRaw: raw.default as typeof rehypeRaw,
        rehypePrism: prism.default as typeof rehypePrism,
      });
    });
  }, []);

  return plugins;
}
