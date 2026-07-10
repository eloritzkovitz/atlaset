import React, { type ReactNode } from "react";
import { DEFAULT_PANEL_WIDTH } from "@constants/ui";
import { useAccessibility, useLanguage } from "@features/settings";
import { usePanelAnimation, usePanelHide, useScreenSize } from "@hooks";
import { DialogHeader } from "../DialogHeader/DialogHeader";
import "./Panel.css";

interface PanelProps {
  title: ReactNode;
  children: ReactNode;
  show?: boolean;
  onHide?: () => void;
  escEnabled?: boolean;
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
  headerActions?: ReactNode;
  showSeparator?: boolean;
  scrollable?: boolean;
  position?: "left" | "right";
  showCloseButton?: boolean;
}

/** Renders a panel component. */
export function Panel({
  title,
  children,
  show = true,
  onHide,
  escEnabled = true,
  width = DEFAULT_PANEL_WIDTH,
  style = {},
  className = "",
  headerActions,
  showSeparator = true,
  scrollable = true,
  position = "left",
  showCloseButton = true,
}: PanelProps) {
  const { animationsEnabled } = useAccessibility();
  const { isRtl } = useLanguage();
  const { isMobile } = useScreenSize();

  usePanelHide({ show, onHide, escEnabled });

  const panelAnimationClass = usePanelAnimation({
    show,
    isMobile,
    isRtl,
    animationsEnabled,
    position,
  });

  return (
    <div
      role="complementary"
      tabIndex={-1}
      inert={!show}
      className={`${panelAnimationClass} ${className}`}
      style={
        isMobile
          ? { width: "100vw", height: "100vh", minHeight: 0, ...style }
          : { width, minWidth: width, ...style }
      }
    >
      <DialogHeader
        title={title}
        showSeparator={showSeparator}
        onClose={onHide}
        showCloseButton={showCloseButton}
      >
        {headerActions}
      </DialogHeader>
      <div
        className={`flex-1 min-h-0 px-4 pb-8${isMobile ? " pb-20" : ""}${
          scrollable ? " overflow-y-auto" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
