import { FaBars } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { ActionButton, Branding } from "@components";
import {
  DEFAULT_SIDEBAR_WIDTH,
  DEFAULT_SIDEBAR_EXPANDED_WIDTH,
} from "@constants/ui";
import { useUI } from "@contexts/UIContext";
import { useDismiss } from "@hooks";
import { NAV_LINKS, SETTINGS_LINK } from "./navLinks";
import { SidebarMenuLink } from "./SidebarMenuLink";

export function Sidebar() {
  const { uiVisible, sidebarExpanded, setSidebarExpanded } = useUI();
  const { t } = useTranslation("common");

  useDismiss({
    show: sidebarExpanded,
    onHide: () => setSidebarExpanded(false),
    isModal: false,
    escEnabled: true,
  });

  // Hide sidebar if UI is not visible
  if (!uiVisible) return null;

  // Calculate sidebar width based on expanded state
  const sidebarWidth = sidebarExpanded
    ? DEFAULT_SIDEBAR_EXPANDED_WIDTH
    : DEFAULT_SIDEBAR_WIDTH;
  const toggleLabel = t(
    sidebarExpanded
      ? "navigation.sidebar.collapse"
      : "navigation.sidebar.expand",
  );

  return (
    <>
      {/* Desktop sidebar */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black opacity-20 z-[9999]"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      <aside
        className="hidden md:block fixed top-0 start-0 justify-center h-screen z-[10000] bg-sidebar transition-all duration-200 px-1"
        style={{ width: sidebarWidth, minWidth: sidebarWidth }}
      >
        {/* Header */}
        <div className="flex items-center h-14 mt-1">
          <ActionButton
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            aria-label={toggleLabel}
            title={toggleLabel}
            className="flex h-10 w-10 ms-1 hover:bg-sidebar-btn-hover transition"
            icon={<FaBars className="text-text text-2xl" />}
            rounded
          />
          {sidebarExpanded && (
            <div className="flex items-center gap-2 px-2 animate-fade-in">
              <Branding size={36} />
              <span className="font-bold text-2xl">Atlaset</span>
            </div>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="flex flex-col gap-2 mt-2">
          {NAV_LINKS.map((link) => (
            <SidebarMenuLink
              key={link.to}
              {...link}
              expanded={sidebarExpanded}
            />
          ))}
        </nav>

        {/* Settings Footer */}
        <div className="absolute bottom-2 start-0 w-full px-1">
          <SidebarMenuLink {...SETTINGS_LINK} expanded={sidebarExpanded} />
        </div>
      </aside>

      {/* Mobile bottom navigation bar */}
      <nav className="fixed bottom-0 start-0 end-0 z-[10000] bg-sidebar border-t border-gray-700 flex justify-around items-center h-16 md:hidden">
        {NAV_LINKS.map((link) => (
          <SidebarMenuLink key={link.to} {...link} expanded={false} />
        ))}
      </nav>
    </>
  );
}
