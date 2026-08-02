import { useState, useCallback } from "react";
import { copyToClipboard } from "@utils/clipboard";
import { getSharedMapUrl } from "../utils/mapShare";

/**
 * Generates and copies a shareable map URL.
 * @param code Base64 encoded map data
 * @returns Object with shareUrl, copyShareUrl function, and copied state
 */
export function useMapShare(code: string) {
  const [copied, setCopied] = useState(false);

  // Generate share URL
  const shareUrl = getSharedMapUrl(code);

  // Copy handler
  const copyShareUrl = useCallback(async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } else {
      setCopied(false);
    }
  }, [shareUrl]);

  return { shareUrl, copyShareUrl, copied };
}
