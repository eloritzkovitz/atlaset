import React from "react";
import type { ReactNode } from "react";
import { DEFAULT_PANEL_WIDTH } from "@constants";
import { useIsMobile } from "@hooks";
import { usePanelHide } from "@hooks/usePanelHide";
import { PanelHeader } from "./PanelHeader";
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
}

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
}: PanelProps) {
  usePanelHide({ show, onHide, escEnabled });

  const isMobile = useIsMobile();

  return (
    <div
      role="complementary"
      tabIndex={-1}
      inert={!show}
      className={
        isMobile
          ? `fixed bottom-0 left-0 right-0 z-50 bg-surface flex flex-col rounded-t-2xl shadow-lg transition-all duration-300 ease-in-out
            ${
              show
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0 pointer-events-none"
            } ${className}`
          : `fixed bg-surface flex flex-col h-screen top-0 ${position === "right" ? "right-0" : "left-16"} z-40 will-change-transform transition-all duration-300 ease-in-out focus:outline-none shadow
            ${
              show
                ? "translate-x-0 opacity-100"
                : position === "right"
                  ? "translate-x-full opacity-0 pointer-events-none"
                  : "-translate-x-full opacity-0 pointer-events-none"
            } ${className}`
      }
      style={
        isMobile
          ? { width: "100vw", height: "100vh", minHeight: 0, ...style }
          : { width, minWidth: width, ...style }
      }
    >
      <PanelHeader title={title} showSeparator={showSeparator}>
        {headerActions}
      </PanelHeader>
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
