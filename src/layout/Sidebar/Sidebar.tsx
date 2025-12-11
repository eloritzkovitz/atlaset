import {
  FaBars,
  FaChartSimple,
  FaEarthAmericas,
  FaGamepad,
  FaSuitcaseRolling,
} from "react-icons/fa6";
import { ActionButton, Branding } from "@components";
import {
  DEFAULT_SIDEBAR_WIDTH,
  DEFAULT_SIDEBAR_EXPANDED_WIDTH,
} from "@constants/ui";
import { useUI } from "@contexts/UIContext";
import { usePanelHide } from "@hooks/usePanelHide";
import { SidebarMenuLink } from "./SidebarMenuLink";

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
      {/* Backdrop when expanded */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black opacity-20 z-[9999]"
          onClick={() => setSidebarExpanded(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen z-[10000] bg-sidebar transition-all duration-200 px-1 transition-all duration-200`}
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
            className="flex h-10 w-10 ml-1 hover:bg-sidebar-hover transition"
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
          <SidebarMenuLink
            to="/"
            icon={<FaEarthAmericas className="text-2xl" />}
            label="Atlas"
            expanded={sidebarExpanded}
            end
          />
          <SidebarMenuLink
            to="/dashboard"
            icon={<FaChartSimple className="text-2xl" />}
            label="Dashboard"
            expanded={sidebarExpanded}
          />
          <SidebarMenuLink
            to="/game"
            icon={<FaGamepad className="text-2xl" />}
            label="Games"
            expanded={sidebarExpanded}
            end
          />
          <SidebarMenuLink
            to="/trips"
            icon={<FaSuitcaseRolling className="text-2xl" />}
            label="My Trips"
            expanded={sidebarExpanded}
            end
          />
        </nav>
      </aside>
    </>
  );
}
