import { useUIHintContext } from "@contexts/UIHintContext";
import { useEffect } from "react";
import type { ReactNode } from "react";

interface UiHintOptions {
  style?: React.CSSProperties;
  key: string;
  dismissable?: boolean;
}

interface UiHintContent {
  message: ReactNode;
  icon?: ReactNode;
}

/**
 * Displays a UI hint with the given content and options.
 * @param content = UiHintContent | null
 * @param duration = Duration in milliseconds
 * @param options - Customization options
 */
export function useUiHint(
  content: UiHintContent | null,
  duration = 4000,
  options: UiHintOptions
) {
  const { addHint, removeHint } = useUIHintContext();
  const { key, style, dismissable } = options;

  const hasContent = !!content;
  const contentMessage = content?.message;
  const contentIcon = content?.icon;

  // Manage UI hint lifecycle
  useEffect(() => {
    if (content) {
      addHint({
        id: key,
        content: contentMessage,
        icon: contentIcon,
        dismissable: dismissable ?? false,
        duration,
        style,
      });
      return () => removeHint(key);
    } else {
      removeHint(key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasContent,
    key,
    duration,
    style,
    dismissable,
    contentMessage,
    contentIcon,
  ]);
}
