import { useState, useEffect } from "react";

interface MarkdownPlugins {
  ReactMarkdown: typeof import("react-markdown").default;
  remarkGfm: typeof import("remark-gfm").default;
  rehypeTypeScript: typeof import("./rehypeTypeScript").rehypeTypeScript;
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
      import("./rehypeTypeScript"),
    ]).then(([rm, gfm, typescript]) => {
      if (isMounted) {
        setPlugins({
          ReactMarkdown: rm.default,
          remarkGfm: gfm.default,
          rehypeTypeScript: typescript.rehypeTypeScript,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return plugins;
}
