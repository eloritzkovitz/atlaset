import { useLayoutEffect, useState } from "react";
import { useIsRtl } from "@hooks";

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
  align?: "left" | "right" | "top",
  placement?: "overlay" | "adjacent",
  withWidth: boolean = true,
) {
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const isRtl = useIsRtl();

  // Calculate menu position when open or dependencies change
  useLayoutEffect(() => {
    if (open && btnRef.current && menuRef.current) {
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

        // Calculate horizontal position based on alignment and placement
        if (placement === "overlay") {
          if (align === "left") {
            left = btnRect.left - menuRect.width + window.scrollX;
          } else {
            left = btnRect.left + window.scrollX;
          }
        } else {
          if (align === "left") {
            left = isRtl
              ? btnRect.right + window.scrollX
              : btnRect.left - menuRect.width + window.scrollX;
          } else {
            left = isRtl
              ? btnRect.left - menuRect.width + window.scrollX
              : btnRect.right + window.scrollX;
          }
        }

        // Flip above if not enough space below
        if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
          top = btnRect.top + window.scrollY - menuRect.height;
        }
      }

      // Set menu style
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
  }, [open, offset, align, withWidth, isRtl]);

  return menuStyle;
}
