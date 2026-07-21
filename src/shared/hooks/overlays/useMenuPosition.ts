import { useLayoutEffect, useState } from "react";

/**
 * Calculates and returns the style for a dropdown/menu anchored to a button.
 * @param open Whether the menu is open
 * @param btnRef Ref to the anchor/button element
 * @param menuRef Ref to the menu element
 * @param offset Optional offset in px
 * @param align "left" or "right" alignment (default: "right")
 * @param placement "overlay" (align under control) or "adjacent" (place beside control)
 * @param withWidth If true, menu matches button width (default: true)
 */
export function useMenuPosition(
  open: boolean,
  btnRef: React.RefObject<HTMLElement | null>,
  menuRef: React.RefObject<HTMLElement | null>,
  offset?: number,
  align: "left" | "right" | "top" = "right",
  placement?: "overlay" | "adjacent",
  withWidth: boolean = true,
) {
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  // Calculate menu position when open or dependencies change
  useLayoutEffect(() => {
    if (open && btnRef.current && menuRef.current) {
      // Determine RTL directly from the document
      const htmlDir = document.documentElement.getAttribute("dir") || document.dir;
      const bodyDir = document.body.getAttribute("dir") || document.body.dir;
      const isRtl = htmlDir === "rtl" || bodyDir === "rtl";

      const btnRect = btnRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - btnRect.bottom;
      const spaceAbove = btnRect.top;

      let top: number;
      let left: number;

      if (align === "top") {
        top = btnRect.top + window.scrollY - menuRect.height - (offset ?? 0);
        left = btnRect.left + window.scrollX;
      } else {
        top = btnRect.top + window.scrollY + (offset ?? 0);

        if (placement === "overlay") {
          left =
            align === "left"
              ? btnRect.left - menuRect.width + window.scrollX
              : btnRect.left + window.scrollX;
        } else {
          // Adjacent placement logic with direct RTL handling
          if (align === "left") {
            left = isRtl
              ? btnRect.right + window.scrollX
              : btnRect.left - menuRect.width + window.scrollX;
          } else {
            // align === "right"
            left = isRtl
              ? btnRect.left - menuRect.width + window.scrollX
              : btnRect.right + window.scrollX;
          }
        }

        // Flip above if space below is insufficient
        if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
          top = btnRect.top + window.scrollY - menuRect.height;
        }
      }

      const style: React.CSSProperties = {
        position: "absolute",
        top,
        left,
        zIndex: 1000,
      };

      if (withWidth) {
        style.width = btnRect.width;
      }

      setMenuStyle(style);
    } else {
      setMenuStyle({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, offset, align, placement, withWidth]);

  return menuStyle;
}
