import { useEffect, useMemo, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useUiHint } from "@hooks/useUiHint";

export function useUiToggleHint(
  uiVisible: boolean,
  setUiVisible: React.Dispatch<React.SetStateAction<boolean>>
) {
  // Track previous value of uiVisible
  const prevUiVisible = useRef(uiVisible);

  // Show hint when uiVisible changes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Ignore if typing in input, textarea, or contenteditable
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key.toLowerCase() === "u") {
        setUiVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setUiVisible]);

  // Show hint when UI visibility changes
  const toggleUiHint = useMemo(() => {
    if (uiVisible) {
      return {
        message: (
          <>
            UI is now visible. Press <kbd>U</kbd> to hide.
          </>
        ),
        icon: <FaEye className="text-lg" />,
      };
    } else {
      return {
        message: (
          <>
            UI is hidden. Press <kbd>U</kbd> to show.
          </>
        ),
        icon: <FaEyeSlash className="text-lg" />,
      };
    }
  }, [uiVisible]);
  useUiHint(toggleUiHint, 4000, { key: "toggle-ui" });

  // Show hint only when UI transitions from visible to hidden
  useEffect(() => {
    prevUiVisible.current = uiVisible;
  }, [uiVisible]);
}
