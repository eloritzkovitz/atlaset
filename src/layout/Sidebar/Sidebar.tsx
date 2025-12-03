import type { Dispatch, SetStateAction } from "react";
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

interface SidebarProps {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ expanded, setExpanded }: SidebarProps) {
  const { uiVisible } = useUI();

  // Hide sidebar if UI is not visible
  if (!uiVisible) {
    return null;
  }

  // Determine sidebar width
  const sidebarWidth = expanded
    ? DEFAULT_SIDEBAR_EXPANDED_WIDTH
    : DEFAULT_SIDEBAR_WIDTH;

  return (
    <>
      {/* Backdrop when expanded */}
      {expanded && (
        <div className="sidebar-backdrop" onClick={() => setExpanded(false)} />
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
            onClick={() => setExpanded((v: any) => !v)}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className="sidebar-header-action"
          >
            <FaBars size={20} />
          </ActionButton>
          {expanded && (
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
            expanded={expanded}
            end
          />
          <SidebarMenuLink
            to="/dashboard"
            icon={<FaChartSimple size={24} />}
            label="Dashboard"
            expanded={expanded}
            end
          />
          <SidebarMenuLink
            to="/game"
            icon={<FaGamepad size={24} />}
            label="Games"
            expanded={expanded}
            end
          />
          <SidebarMenuLink
            to="/trips"
            icon={<FaSuitcaseRolling size={24} />}
            label="My Trips"
            expanded={expanded}
            end
          />
        </nav>
      </aside>
    </>
  );
}
