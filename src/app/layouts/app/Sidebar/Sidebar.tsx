import { FaBars } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { ActionButton, Backdrop, Branding } from "@components";
import {
  DEFAULT_SIDEBAR_WIDTH,
  DEFAULT_SIDEBAR_EXPANDED_WIDTH,
} from "@constants/ui";
import { useUI } from "@app/contexts/UIContext";
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
      {/* Desktop sidebar backdrop */}
      {sidebarExpanded && (
        <Backdrop
          className="z-[9999] bg-black/20"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden md:block fixed top-0 start-0 h-screen z-[10000] bg-sidebar px-1 overflow-hidden transition-[width] duration-200 ease-in-out"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
        }}
      >
        {/* Header */}
        <div className="flex items-center h-14 mt-1">
          <ActionButton
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            aria-label={toggleLabel}
            title={toggleLabel}
            className="flex h-10 w-10 ms-1 shrink-0 hover:bg-sidebar-btn-hover transition"
            icon={<FaBars className="text-text text-2xl" />}
            rounded
          />

          <div
            className={`flex items-center gap-2 px-2 whitespace-nowrap transition-opacity duration-150 ${
              sidebarExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Branding size={36} />
            <span className="font-bold text-2xl">Atlaset</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className={`flex flex-col gap-2 mt-2 ${sidebarExpanded ? "px-1" : ""}`}>
          {NAV_LINKS.map((link) => (
            <SidebarMenuLink
              key={link.to}
              {...link}
              expanded={sidebarExpanded}
            />
          ))}
        </nav>

        {/* Settings Footer */}
        <div className={`absolute bottom-2 w-full ${sidebarExpanded ? "px-1" : ""}`}>
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
