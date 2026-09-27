import { useEffect, useState } from "react";

/**
 * Fetches the content of a markdown file from the given path and returns it along with any error encountered during the fetch.
 * If no path is provided, it returns an empty content and null error.
 * @param path - The path to the markdown file to be fetched. If undefined, no fetch will be performed.
 * @returns An object containing the fetched content and any error encountered during the fetch.
 */
export function useMarkdownFile(path?: string) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setContent("");
      setError(null);
      return;
    }

    let isMounted = true;

    setContent("");
    setError(null);

    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load file");
        }

        return response.text();
      })
      .then((text) => {
        if (isMounted) {
          setContent(text);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load file");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [path]);

  return { content, error };
}
