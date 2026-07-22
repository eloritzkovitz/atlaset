import React, { type ReactNode } from "react";
import { DEFAULT_PANEL_WIDTH } from "@constants/ui";
import { usePanelAnimation, usePanelHide, useScreenSize } from "@hooks";
import { DialogHeader } from "../DialogHeader/DialogHeader";
import "./Panel.css";

export interface PanelProps {
  title: ReactNode;
  children: ReactNode;
  show?: boolean;
  position?: "left" | "right";
  width?: number | string;
  onHide?: () => void;
  escEnabled?: boolean;
  showCloseButton?: boolean;
  showSidebar?: boolean;
  headerActions?: ReactNode;
  showSeparator?: boolean;
  scrollable?: boolean;
  animationsEnabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/** Renders a panel component. */
export function Panel({
  title,
  children,
  show = true,
  position = "left",
  width = DEFAULT_PANEL_WIDTH,
  onHide,
  escEnabled = true,
  showCloseButton = true,
  headerActions,
  showSeparator = true,
  showSidebar = true,
  scrollable = true,
  animationsEnabled = true,
  style = {},
  className = "",
}: PanelProps) {
  const { isMobile } = useScreenSize();

  usePanelHide({ show, onHide, escEnabled });

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
        className={`flex-1 min-h-0 px-4 ${isMobile ? "pb-20" : ""}${
          scrollable ? " overflow-y-auto" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
