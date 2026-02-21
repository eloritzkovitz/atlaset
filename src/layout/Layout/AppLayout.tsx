import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useUI } from "@contexts/UIContext";
import { useScrollVisibility } from "@hooks";
import { AppPanels } from "./AppPanels";
import { AppHeader } from "../Header/AppHeader";
import { Sidebar } from "../Sidebar/Sidebar";

/** Renders the main application layout. */
export function AppLayout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const [showHeader] = useScrollVisibility(
    mainRef,
    (scrollTop) => scrollTop === 0,
    [children],
    true,
  );
  const location = useLocation();
  const { openMapToolbarPanel } = useUI();

  return (
    <div className="app-layout relative h-screen w-screen bg-bg overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col h-full min-w-0">
        <AppHeader
          show={showHeader}
          showSearch={location.pathname !== "/atlas" || !openMapToolbarPanel}
        />
        <main
          ref={mainRef}
          className="flex-1 h-0 min-h-0 overflow-auto pb-16 sm:pb-0"
        >
          {children}
        </main>
      </div>
      <AppPanels />
    </div>
  );
}
