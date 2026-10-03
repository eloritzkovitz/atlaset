import React, { type ReactNode } from "react";
import { DEFAULT_PANEL_WIDTH } from "@constants/ui";
import { useDismiss, usePanelAnimation, useScreenSize } from "@hooks";
import { DialogHeader } from "../DialogHeader/DialogHeader";
import { Sheet } from "../Sheet/Sheet";
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
  showHeader?: boolean;
  showCloseButton?: boolean;
  headerActions?: ReactNode;
  showSeparator?: boolean;
  showPadding?: boolean;
  animationsEnabled?: boolean;
  topOffset?: string;
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
  showHeader = true,
  showCloseButton = true,
  headerActions,
  showSeparator = true,
  showPadding = true,
  animationsEnabled = true,
  topOffset = "0px",
  style = {},
  className = "",
}: PanelProps) {
  const { isMobile } = useScreenSize();

  useDismiss({ show: show && !isMobile, onHide, escEnabled });

  const panelAnimationClass = usePanelAnimation({
    show,
    showSidebar,
    isMobile,
    animationsEnabled,
    position,
  });

  const panelHeader = showHeader ? (
    <DialogHeader
      title={title}
      showSeparator={showSeparator}
      onClose={onHide}
      showCloseButton={showCloseButton}
    >
      {headerActions}
    </DialogHeader>
  ) : null;

  const panelContent = (
    <div
      className={`flex-1 min-h-0 px-4 ${isMobile ? "pb-20" : showPadding ? "pb-8" : ""}${
        scrollable ? " overflow-y-auto" : ""
      }`}
    >
      {children}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet
        open={show}
        onClose={onHide ?? (() => {})}
        className={`h-screen max-h-screen rounded-none ${className}`}
        style={style}
        disableClose={!onHide || !escEnabled}
      >
        {panelHeader}
        {panelContent}
      </Sheet>
    );
  }

  return (
    <div
      role="complementary"
      tabIndex={-1}
      inert={!show}
      className={`${panelAnimationClass} ${className}`}
      style={
        isMobile
          ? { width: "100vw", height: "100vh", minHeight: 0, ...style }
          : {
              width,
              minWidth: width,
              top: topOffset,
              height: `calc(100vh - ${topOffset})`,
              ...style,
            }
      }
    >
      {panelHeader}
      {panelContent}
    </div>
  );
}
