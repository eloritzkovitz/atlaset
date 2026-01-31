import { useState, useEffect } from "react";

/**
 * Loads a markdown file from the given path
 * @param path - Path to the markdown file
 * @returns Object containing file content and error (if any)
 */
export function useMarkdownFile(path: string) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load markdown file when path changes
  useEffect(() => {
    let isMounted = true;
    setError(null);
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load file");
        return res.text();
      })
      .then((text) => {
        if (isMounted) setContent(text);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      });
    return () => {
      isMounted = false;
    };
  }, [path]);

  return { content, error };
}
