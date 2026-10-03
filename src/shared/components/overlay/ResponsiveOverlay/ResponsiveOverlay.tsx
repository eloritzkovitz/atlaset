import type { ReactNode } from "react";
import { useScreenSize } from "@hooks";
import { DrawerPanel } from "../Drawer/DrawerPanel";
import { DropdownMenu } from "../../navigation/Menu/DropdownMenu";

interface ResponsiveOverlayProps {
  isOpen: boolean;
  closing?: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  mobileHeader?: ReactNode;
  mobileWidth?: number | string;
  mobileClassName?: string;
  desktopClassName?: string;
  desktopPlacement?: React.ComponentProps<typeof DropdownMenu>["placement"];
}

/** A responsive overlay component that displays a dropdown on desktop and a drawer on mobile. */
export function ResponsiveOverlay({
  isOpen,
  closing = false,
  onClose,
  triggerRef,
  children,
  mobileHeader,
  mobileWidth = "100%",
  mobileClassName = "",
  desktopClassName = "",
  desktopPlacement = "bottom-end",
}: ResponsiveOverlayProps) {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    if (!isOpen && !closing) return null;

    return (
      <DrawerPanel open={isOpen} onClose={onClose} width={mobileWidth}>
        <div className={`flex h-full flex-col p-4 ${mobileClassName}`}>
          {mobileHeader}
          {children}
        </div>
      </DrawerPanel>
    );
  }

  return (
    <DropdownMenu
      isOpen={isOpen || closing}
      onClose={onClose}
      triggerRef={triggerRef}
      floating
      placement={desktopPlacement}
      className={desktopClassName}
    >
      {children}
    </DropdownMenu>
  );
}
