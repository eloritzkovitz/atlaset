import { useEffect, useRef, useState, type JSX } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useUI } from "@contexts/UIContext";
import { useUiHint } from "@hooks";

/**
 * Manages UI toggle hint display when the UI visibility changes.
 */
export function useUiToggleHint() {
  const { uiVisible } = useUI();

  // Refs and state to track previous visibility and hint
  const prevUiVisible = useRef(uiVisible);

  // Hint state
  const [hint, setHint] = useState<null | {
    message: JSX.Element;
    icon: JSX.Element;
  }>(null);
  const [hintKey, setHintKey] = useState(0);

  // Show hint only when UI transitions (never on initial load)
  useEffect(() => {
    if (prevUiVisible.current !== uiVisible) {
      if (prevUiVisible.current && !uiVisible) {
        setHintKey((k) => k + 1);
        setHint({
          message: <>UI hidden. Press U to show the UI.</>,
          icon: <FaEyeSlash className="text-lg" />,
        });
      } else if (!prevUiVisible.current && uiVisible) {
        setHintKey((k) => k + 1);
        setHint({
          message: <>UI shown. Press U to hide the UI.</>,
          icon: <FaEye className="text-lg" />,
        });
      }
    }
    prevUiVisible.current = uiVisible;
  }, [uiVisible]);

  // Use the useUiHint hook to display the hint
  useUiHint(hint, 4000, { key: `toggle-ui-${hintKey}` });

  // Clear hint after 4 seconds
  useEffect(() => {
    if (hint) {
      const timeout = setTimeout(() => setHint(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [hint]);
}
