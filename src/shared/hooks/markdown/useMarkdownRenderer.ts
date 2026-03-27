import { useEffect, useState } from "react";

type MarkdownModule = { default: unknown };
type Importer = (mod: string) => Promise<MarkdownModule>;

/**
 * Loads markdown renderer and plugins dynamically
 */
export function useMarkdownRenderer() {
  const [ReactMarkdown, setReactMarkdown] = useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null);
  const [remarkGfm, setRemarkGfm] = useState<
    ((...args: unknown[]) => unknown) | object | null
  >(null);
  const [rehypeRaw, setRehypeRaw] = useState<
    ((...args: unknown[]) => unknown) | object | null
  >(null);
  const [rehypePrism, setRehypePrism] = useState<
    ((...args: unknown[]) => unknown) | object | null
  >(null);

  // Dynamically import markdown renderer and plugins on mount
  useEffect(() => {
    // Use global import if available (e.g. in environments with native support) or fallback to dynamic import
    const globalImporter = globalThis as unknown as {
      __import?: Importer;
    };
    const importer: Importer =
      globalImporter.__import ??
      ((mod: string) =>
        import(/* @vite-ignore */ mod) as Promise<MarkdownModule>);

    // Catch import rejections to avoid unhandled promise rejections in tests/environments
    importer("react-markdown")
      .then((mod) => {
        const def = mod.default as unknown;
        setReactMarkdown(
          () => def as React.ComponentType<Record<string, unknown>>,
        );
      })
      .catch(() => {});

    importer("remark-gfm")
      .then((mod) =>
        setRemarkGfm(
          () =>
            mod.default as unknown as
              | ((...args: unknown[]) => unknown)
              | object,
        ),
      )
      .catch(() => {});

    importer("rehype-raw")
      .then((mod) =>
        setRehypeRaw(
          () =>
            mod.default as unknown as
              | ((...args: unknown[]) => unknown)
              | object,
        ),
      )
      .catch(() => {});

    importer("rehype-prism-plus")
      .then((mod) =>
        setRehypePrism(
          () =>
            mod.default as unknown as
              | ((...args: unknown[]) => unknown)
              | object,
        ),
      )
      .catch(() => {});
  }, []);

  return { ReactMarkdown, remarkGfm, rehypeRaw, rehypePrism };
}
