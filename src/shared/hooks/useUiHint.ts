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

export function useUiHint(
  content: UiHintContent | null,
  duration = 4000,
  options: UiHintOptions
) {
  const { addHint, removeHint } = useUIHintContext();
  const { key, style, dismissable } = options;

  useEffect(() => {
    if (content) {
      addHint({
        id: key,
        content: content.message,
        icon: content.icon,
        dismissable: dismissable ?? false,
        duration,
        style,
      });
      return () => removeHint(key);
    } else {
      removeHint(key);
    }
    // Add content?.message and content?.icon to dependencies for correct updates
  }, [
    !!content,
    key,
    duration,
    style,
    dismissable,
    content?.message,
    content?.icon,
  ]);
}
