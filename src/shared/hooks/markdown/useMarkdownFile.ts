import { useState, useEffect } from "react";

/**
 * Loads a markdown file from the given path
 * @param path - Path to the markdown file (string or undefined)
 * @returns Object containing file content and error (if any)
 */
export function useMarkdownFile(path?: string) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load markdown file when path changes
  useEffect(() => {
    if (!path) {
      setContent("");
      setError(null);
      return;
    }
    let isMounted = true;
    setError(null);
    // Only call fetch if path is a non-empty string
    if (typeof path === "string" && path.length > 0) {
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
    }
    return () => {
      isMounted = false;
    };
  }, [path]);

  return { content, error };
}
