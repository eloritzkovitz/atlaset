import { FaBars } from "react-icons/fa6";
import { ActionButton, Branding } from "@components";
import {
  DEFAULT_SIDEBAR_WIDTH,
  DEFAULT_SIDEBAR_EXPANDED_WIDTH,
} from "@constants/ui";
import { useUI } from "@contexts/UIContext";
import { usePanelHide } from "@hooks/usePanelHide";
import { SidebarMenuLink } from "./SidebarMenuLink";
import { NAV_LINKS } from "../navLinks";

export function Sidebar() {
  const { uiVisible, sidebarExpanded, setSidebarExpanded } = useUI();

  // Hide sidebar on Escape key or when UI is hidden
  usePanelHide({
    show: sidebarExpanded,
    onHide: () => setSidebarExpanded(false),
    isModal: false,
    escEnabled: true,
  });

  // Hide sidebar if UI is not visible
  if (!uiVisible) {
    return null;
  }

  // Determine sidebar width
  const sidebarWidth = sidebarExpanded
    ? DEFAULT_SIDEBAR_EXPANDED_WIDTH
    : DEFAULT_SIDEBAR_WIDTH;

  return (
    <>
      {/* Desktop sidebar: hidden on mobile, block on md+ */}
      {/* Backdrop when expanded */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black opacity-20 z-[9999]"
          onClick={() => setSidebarExpanded(false)}
        />
      )}
      <aside
        className={`hidden md:block fixed top-0 left-0 h-screen z-[10000] bg-sidebar transition-all duration-200 px-1`}
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
        }}
      >
        {/* Expand/Collapse Button */}
        <div className="flex items-center h-14 mt-1">
          <ActionButton
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            className="flex h-10 w-10 ml-1 hover:bg-sidebar-btn-hover transition"
            icon={<FaBars className="text-2xl" />}
            rounded
          />
          {sidebarExpanded && (
            <div className="flex items-center gap-2 px-2">
              <Branding size={36} />
              <span className="font-bold text-2xl">Atlaset</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-2">
          {NAV_LINKS.map((link) => (
            <SidebarMenuLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              expanded={sidebarExpanded}
              end={link.end}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile bottom navigation bar: only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-[10000] bg-sidebar border-t border-gray-700 flex justify-around items-center h-16 md:hidden">
        {NAV_LINKS.map((link) => (
          <SidebarMenuLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            expanded={sidebarExpanded}
            end={link.end}
          />
        ))}
      </nav>
    </>
  );
}
