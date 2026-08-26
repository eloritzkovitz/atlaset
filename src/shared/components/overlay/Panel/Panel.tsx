import React, { type ReactNode } from "react";
import { DEFAULT_PANEL_WIDTH } from "@constants/ui";
import { useDismiss, usePanelAnimation, useScreenSize } from "@hooks";
import { DialogHeader } from "../DialogHeader/DialogHeader";
import "./Panel.css";

export interface PanelProps {
  title: ReactNode;
  children: ReactNode;
  position?: "left" | "right";
  width?: number | string;
  scrollable?: boolean;
  showSidebar?: boolean;
  show?: boolean;
  onHide?: () => void;
  escEnabled?: boolean;
  showCloseButton?: boolean;
  headerActions?: ReactNode;
  showSeparator?: boolean;
  showPadding?: boolean;
  animationsEnabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/** Renders a panel component. */
export function Panel({
  title,
  children,
  position = "left",
  width = DEFAULT_PANEL_WIDTH,
  scrollable = true,
  showSidebar = true,
  show = true,
  onHide,
  escEnabled = true,
  showCloseButton = true,
  headerActions,
  showSeparator = true,
  showPadding = true,
  animationsEnabled = true,
  style = {},
  className = "",
}: PanelProps) {
  const { isMobile } = useScreenSize();

  useDismiss({ show, onHide, escEnabled });

  const panelAnimationClass = usePanelAnimation({
    show,
    showSidebar,
    isMobile,
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
        className={`flex-1 min-h-0 px-4 ${isMobile ? "pb-20" : showPadding ? "pb-8" : ""}${
          scrollable ? " overflow-y-auto" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
