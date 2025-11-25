import { useEffect, useRef, useState, type JSX } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useUiHint } from "@hooks/useUiHint";

export function useUiToggleHint(
  uiVisible: boolean,
  setUiVisible: React.Dispatch<React.SetStateAction<boolean>>
) {
  const prevUiVisible = useRef(uiVisible);
  const isFirstRender = useRef(true);
  const [hint, setHint] = useState<null | {
    message: JSX.Element;
    icon: JSX.Element;
  }>(null);

  // Keyboard shortcut for toggling UI
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
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

  // Show hint only on toggle, and let it linger for the duration
  useEffect(() => {
    if (!isFirstRender.current) {
      if (!prevUiVisible.current && uiVisible) {
        setHint({
          message: <>UI shown. Press U to hide the UI.</>,
          icon: <FaEye className="text-lg" />,
        });
      } else if (prevUiVisible.current && !uiVisible) {
        setHint({
          message: <>UI hidden. Press U to show the UI.</>,
          icon: <FaEyeSlash className="text-lg" />,
        });
      }
    }
    prevUiVisible.current = uiVisible;
    isFirstRender.current = false;
  }, [uiVisible]);

  // Pass the hint to useUiHint, and clear it after duration
  useUiHint(hint, 4000, { key: "toggle-ui" });

  useEffect(() => {
    if (hint) {
      const timeout = setTimeout(() => setHint(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [hint]);
}
