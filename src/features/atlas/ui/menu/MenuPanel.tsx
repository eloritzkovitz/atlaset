import {
  FaRotateRight,
  FaXmark,
  FaEarthAmericas,
  FaGamepad,
  FaSuitcaseRolling,
} from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import {
  ActionButton,
  Branding,
  CollapsedPanelButton,
  Panel,
} from "@components";
import { useUI } from "@contexts/UIContext";
import "./MenuPanel.css";

export function MenuPanel() {
  const { uiVisible, showMenu, setShowMenu } = useUI();

  return (
    <div className="menu-panel-container">
      <Panel
        title={
          <div className="menu-panel-title">
            <Branding size={42} />
            <span className="font-bold text-3xl">Atlaset</span>
          </div>
        }
        show={uiVisible && showMenu}
        showSeparator={false}
        headerActions={
          <>
            <ActionButton
              onClick={() => window.location.reload()}
              aria-label="Reload application"
              title="Reload application"
            >
              <FaRotateRight />
            </ActionButton>
            <ActionButton
              onClick={() => setShowMenu(false)}
              aria-label="Hide sidebar"
              title="Hide sidebar"
            >
              <FaXmark />
            </ActionButton>
          </>
        }
      >
        {/* Navigation */}
        <nav className="menu-panel-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `menu-panel-link${isActive ? " menu-panel-link-active" : ""}`
            }
            end
          >
            <FaEarthAmericas />
            Atlas
          </NavLink>
          <NavLink
            to="/game"
            className={({ isActive }) =>
              `menu-panel-link${isActive ? " menu-panel-link-active" : ""}`
            }
          >
            <FaGamepad />
            Games
          </NavLink>
          <NavLink
            to="/trips"
            className={({ isActive }) =>
              `menu-panel-link${isActive ? " menu-panel-link-active" : ""}`
            }
          >
            <FaSuitcaseRolling />
            My Trips
          </NavLink>
        </nav>
      </Panel>
      {/* Collapsed action button */}
      <CollapsedPanelButton
        onClick={() => setShowMenu(true)}
        visible={uiVisible && !showMenu}
        className="fixed top-5 right-23 z-[9999]"
      />
    </div>
  );
}
