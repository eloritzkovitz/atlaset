import React, { useState } from "react";
import { HamburgerButton } from "@components";
import { useScreenSize } from "@hooks";

interface SidebarLayoutProps {
  menu: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * A responsive layout for pages with a sidebar menu and hamburger toggle on mobile.
 */
export function SidebarLayout({
  menu,
  children,
  className = "",
  contentClassName = "",
}: SidebarLayoutProps) {
  const { isMobile } = useScreenSize();
  const [panelOpen, setPanelOpen] = useState(false);

  // If the menu is a valid React element, clone it with additional props for mobile behavior
  const menuWithProps =
    isMobile && React.isValidElement(menu)
      ? React.cloneElement(
          menu as React.ReactElement<Record<string, unknown>>,
          {
            open: panelOpen,
            onClose: () => setPanelOpen(false),
          },
        )
      : menu;

  return (
    <div
      className={`relative h-screen w-screen bg-bg overflow-x-hidden flex flex-col ${className}`}
    >
      {isMobile && (
        <>
          <HamburgerButton onClick={() => setPanelOpen(true)} />
          <div className="mb-4" />
        </>
      )}
      <div className="flex flex-1 flex-col md:flex-row w-full max-w-6xl mx-auto gap-0 md:gap-6 h-full">
        <div className="flex-shrink-0 flex flex-col justify-start w-full md:w-auto md:h-full">
          {menuWithProps}
        </div>
        <main
          className={`flex-1 flex flex-col items-center px-2 md:px-12 py-10 md:py-16 ${contentClassName}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
