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
import { SidebarMenuLink } from "./SidebarMenuLink";
import "./Sidebar.css";
import { usePanelHide } from "@hooks/usePanelHide";

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
          className="sidebar-backdrop"
          onClick={() => setSidebarExpanded(false)}
        />
      )}
      <aside
        className={`sidebar-container transition-all duration-200`}
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
        }}
      >
        {/* Expand/Collapse Button */}
        <div className="sidebar-title">
          <ActionButton
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            className="sidebar-header-action"
            icon={<FaBars size={20} />}
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
        <nav className="sidebar-nav">
          <SidebarMenuLink
            to="/"
            icon={<FaEarthAmericas size={24} />}
            label="Atlas"
            expanded={sidebarExpanded}
            end
          />
          <SidebarMenuLink
            to="/dashboard"
            icon={<FaChartSimple size={24} />}
            label="Dashboard"
            expanded={sidebarExpanded}
          />
          <SidebarMenuLink
            to="/game"
            icon={<FaGamepad size={24} />}
            label="Games"
            expanded={sidebarExpanded}
            end
          />
          <SidebarMenuLink
            to="/trips"
            icon={<FaSuitcaseRolling size={24} />}
            label="My Trips"
            expanded={sidebarExpanded}
            end
          />
        </nav>
      </aside>
    </>
  );
}
