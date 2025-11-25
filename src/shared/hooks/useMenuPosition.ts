import { useLayoutEffect, useState } from "react";

export function useMenuPosition(
  open: boolean,
  btnRef: React.RefObject<HTMLElement | null>,
  menuRef: React.RefObject<HTMLElement | null>,
  offset?: number,
  align?: "left" | "right"
) {
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  useLayoutEffect(() => {
    if (open && btnRef.current && menuRef.current) {
      const btnRect = btnRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - btnRect.bottom;
      const spaceAbove = btnRect.top;

      let top = btnRect.top + window.scrollY + (offset ?? 0);
      let left =
        align === "left"
          ? btnRect.left - menuRect.width + window.scrollX
          : btnRect.left + window.scrollX;

      // Flip above if not enough space below
      if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
        top = btnRect.top + window.scrollY - menuRect.height - (offset ?? 0);
      }

      setMenuStyle({
        position: "absolute",
        top,
        left,
        zIndex: 1000,
      });
    } else {
      setMenuStyle({});
    }
  }, [open, offset, align]);

  return menuStyle;
}
