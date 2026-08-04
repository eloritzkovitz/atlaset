import React, { useRef } from "react";
import { Outlet } from "react-router-dom";
import { useScrollVisibility } from "@hooks";
import { AppHeader } from "./AppHeader";
import { AppPanels } from "./AppPanels";
import { GlobalShortcuts } from "./GlobalShortcuts";
import { Sidebar } from "./Sidebar/Sidebar";

interface AppLayoutProps {
  children?: React.ReactNode;
}

/** Renders the main application layout. */
export function AppLayout({ children }: AppLayoutProps) {
  const mainRef = useRef<HTMLElement>(null);
  const [showHeader] = useScrollVisibility(
    mainRef,
    (scrollTop) => scrollTop === 0,
    [children],
    true,
  );

  return (
    <div className="app-layout relative h-screen w-screen bg-bg overflow-x-hidden">
      <GlobalShortcuts />
      <Sidebar />
      <div className="flex flex-col h-full min-w-0">
        <AppHeader show={showHeader} />
        <main
          ref={mainRef}
          className="flex-1 h-0 min-h-0 overflow-auto pb-16 sm:pb-0"
        >
          {children || <Outlet />}
        </main>
      </div>
      <AppPanels />
    </div>
  );
}
