import { useState, useEffect } from "react";

interface MarkdownPlugins {
  ReactMarkdown: typeof import("react-markdown").default;
  remarkGfm: typeof import("remark-gfm").default;
  rehypeRaw: typeof import("rehype-raw").default;
  rehypeSlug: typeof import("rehype-slug").default;
  rehypeSyntaxHighlight: typeof import("./rehypeSyntaxHighlight").rehypeSyntaxHighlight;
}

/**
 * Dynamically imports and returns the markdown renderer and its plugins.
 * @returns An object containing the ReactMarkdown component and its plugins, or null if not yet loaded.
 */
export function useMarkdown() {
  const [plugins, setPlugins] = useState<MarkdownPlugins | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      import("react-markdown"),
      import("remark-gfm"),
      import("rehype-raw"),
      import("rehype-slug"),
      import("./rehypeSyntaxHighlight"),
    ]).then(([rm, gfm, raw, slug, syntax]) => {
      if (isMounted) {
        setPlugins({
          ReactMarkdown: rm.default,
          remarkGfm: gfm.default,
          rehypeRaw: raw.default,
          rehypeSlug: slug.default,
          rehypeSyntaxHighlight: syntax.rehypeSyntaxHighlight,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return plugins;
}
