import { useRef, useCallback } from "react";

/**
 * Manages pending focus for an input element.
 * @returns An object containing the ref setter, focus request function, and the input ref itself.
 */
export function usePendingFocus() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingRef = useRef(false);

  const setRef = useCallback((el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (el && pendingRef.current) {
      pendingRef.current = false;
      try {
        el.focus();
        const len = el.value?.length ?? 0;
        el.setSelectionRange(len, len);
      } catch {
        void 0;
      }
    }
  }, []);

  const requestFocus = useCallback(() => {
    pendingRef.current = true;
    setTimeout(() => {
      if (inputRef.current) {
        try {
          inputRef.current.focus();
          const len = inputRef.current.value?.length ?? 0;
          inputRef.current.setSelectionRange(len, len);
        } catch {
          void 0;
        }
        pendingRef.current = false;
      }
    }, 0);
  }, []);

  return { setRef, requestFocus, inputRef } as const;
}
