import { useCallback, useState } from "react";

export interface DisclosureState<T = undefined> {
  isOpen: boolean;
  data: T | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Manages open/close state and optional payload data for modals, drawers, and popovers.
 * @param initialState - The initial open state (default: false).
 * @param initialData - Optional initial data payload.
 */
export function useDisclosure<T = undefined>(
  initialState = false,
  initialData: T | null = null,
): DisclosureState<T> {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState<T | null>(initialData);

  const open = useCallback((payload?: T) => {
    if (payload !== undefined) {
      setData(payload);
    }
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    setIsOpen,
    setData,
    open,
    close,
    toggle,
  };
}
