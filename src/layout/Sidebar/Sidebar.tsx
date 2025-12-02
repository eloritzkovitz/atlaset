import type { Dispatch, SetStateAction } from "react";
import {
  FaBars,
  FaEarthAmericas,
  FaGamepad,
  FaSuitcaseRolling,
} from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { ActionButton, Branding, MenuButton } from "@components";
import {
  DEFAULT_SIDEBAR_WIDTH,
  DEFAULT_SIDEBAR_EXPANDED_WIDTH,
} from "@constants/ui";
import "./Sidebar.css";

interface SidebarProps {
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({ expanded, setExpanded }: SidebarProps) {
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
        className={`sidebar-container bg-zinc-900 transition-all duration-200`}
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
        }}
      >
        {/* Expand/Collapse Button */}
        <div className="sidebar-title h-14 px-2">
          <ActionButton
            onClick={() => setExpanded((v: any) => !v)}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FaBars size={24} />
          </ActionButton>
          {expanded && (
            <div className="flex items-center gap-2 px-4 py-2">
              <Branding size={36} />
              <span className="font-bold text-2xl">Atlaset</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <NavLink to="/" end>
            {({ isActive }) => (
              <MenuButton
                icon={<FaEarthAmericas size={24} />}
                active={isActive}
                ariaLabel="Atlas"
                title="Atlas"
                className="text-2xl gap-3"
              >
                {expanded && "Atlas"}
              </MenuButton>
            )}
          </NavLink>
          <NavLink to="/game" end>
            {({ isActive }) => (
              <MenuButton
                icon={<FaGamepad size={24} />}
                active={isActive}
                ariaLabel="Games"
                title="Games"
                className="text-2xl gap-3"
              >
                {expanded && "Games"}
              </MenuButton>
            )}
          </NavLink>
          <NavLink to="/trips" end>
            {({ isActive }) => (
              <MenuButton
                icon={<FaSuitcaseRolling size={24} />}
                active={isActive}
                ariaLabel="My Trips"
                title="My Trips"
                className="text-2xl gap-3"
              >
                {expanded && "My Trips"}
              </MenuButton>
            )}
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
