import React from "react";
import type { ReactNode } from "react";
import { DEFAULT_PANEL_WIDTH } from "@constants";
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
}: PanelProps) {
  usePanelHide({ show, onHide, escEnabled });

  return (
    <div
      role="complementary"
      tabIndex={-1}
      inert={!show}
      className={`panel ${show ? "panel-show" : "panel-hide"} ${className}`}
      style={{
        width,
        minWidth: width,
        ...style,
      }}
    >
      <PanelHeader title={title} showSeparator={showSeparator}>
        {headerActions}
      </PanelHeader>
      <div
        className={`flex-1 min-h-0 px-4 pb-8${
          scrollable ? " overflow-y-auto" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
