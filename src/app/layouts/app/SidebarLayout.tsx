import React from "react";
import { Outlet } from "react-router-dom";
import { Container, HamburgerButton } from "@components";
import { useDisclosure, useScreenSize } from "@hooks";

interface SidebarLayoutProps {
  menu: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

/** A responsive layout for pages with a sidebar menu and hamburger toggle on mobile. */
export function SidebarLayout({
  menu,
  children,
  className = "",
  contentClassName = "",
}: SidebarLayoutProps) {
  const { isMobile } = useScreenSize();

  const panelMenu = useDisclosure();

  const menuWithProps =
    isMobile && React.isValidElement(menu)
      ? React.cloneElement(
          menu as React.ReactElement<Record<string, unknown>>,
          {
            open: panelMenu.isOpen,
            onClose: () => panelMenu.close(),
          },
        )
      : menu;

  return (
    <div
      className={`relative h-screen w-screen bg-bg overflow-x-hidden flex flex-col ${className}`}
    >
      {isMobile && (
        <>
          <HamburgerButton onClick={() => panelMenu.open()} />
          <div className="mb-4" />
        </>
      )}
      <div className="flex gap-0 md:gap-6 h-full">
        <div className="flex-shrink-0 flex flex-col justify-start w-full md:w-auto md:h-full">
          {menuWithProps}
        </div>
        <main className={`items-center mx-auto ${contentClassName}`}>
          <Container className="w-full mt-12">
            {children ?? <Outlet />}
          </Container>
        </main>
      </div>
    </div>
  );
}
