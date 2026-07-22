import { useState, useEffect } from "react";

interface MarkdownPlugins {
  ReactMarkdown: typeof import("react-markdown").default;
  remarkGfm: typeof import("remark-gfm").default;
  rehypeRaw: typeof import("rehype-raw").default;
  rehypePrism: typeof import("rehype-prism-plus").default;
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
      import("rehype-prism-plus"),
    ]).then(([rm, gfm, raw, prism]) => {
      if (isMounted) {
        setPlugins({
          ReactMarkdown: rm.default,
          remarkGfm: gfm.default,
          rehypeRaw: raw.default,
          rehypePrism: prism.default,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return plugins;
}
