import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaChevronUp } from "react-icons/fa6";
import { ActionButton, ActionsToolbar } from "@components";
import { useUI } from "@contexts/UIContext";
import { useIsMobile } from "@hooks";
import { getToolbarActions } from "./actionsConfig";
import { MapControls } from "./MapControls";
import { MapToolbarActions } from "./MapToolbarActions";
import "./MapToolbar.css";

interface MapToolbarProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  children?: React.ReactNode;
}

export function MapToolbar({ zoom, setZoom, children }: MapToolbarProps) {
  // UI state
  const { uiVisible } = useUI();
  const [visible, setVisible] = useState(true);

  // Detect mobile
  const isMobile = useIsMobile();

  // Auto-hide toolbar on mobile after a delay
  const [menuOpen, setMenuOpen] = useState(false);

  // Use config for actions
  const actions = getToolbarActions({
    isMobile,
    setMenuOpen,
  });

  // Mobile toolbar
  if (isMobile) {
    return (
      <>
        {/* Floating FAB */}
        <button
          className="fixed bottom-20 right-4 z-50 bg-action rounded-full p-4 shadow"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close map actions" : "Open map actions"}
        >
          <FaChevronUp
            className={`text-2xl transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {/* Popover/modal menu */}
        {menuOpen && (
          <div
            className="fixed right-4 z-[10020] mb-2"
            style={{ bottom: "135px" }}
          >
            <div
              className="bg-action rounded-2xl p-4 w-52 shadow-xl flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <MapToolbarActions actions={actions} isDesktop={false} />
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop toolbar
  return (
    <div
      className={`toolbar-container ${
        uiVisible ? "toolbar-container-visible" : "toolbar-container-hidden"
      }`}
    >
      {/* Zoom controls: vertical slide */}
      <MapControls zoom={zoom} setZoom={setZoom} visible={visible} />
      <div
        className="relative flex items-center w-full justify-end"
        style={{ height: "40px" }}
      >
        {/* Toggle button */}
        <ActionButton
          onClick={() => setVisible((v) => !v)}
          ariaLabel={visible ? "Hide toolbar" : "Show toolbar"}
          title={visible ? "Hide toolbar" : "Show toolbar"}
          titlePosition="left"
          variant="action"
          className={`${!visible ? "opacity-70" : ""}`}
          icon={visible ? <FaChevronRight /> : <FaChevronLeft />}
          rounded
        />
        {/* Actions: horizontal slide */}
        <ActionsToolbar
          className={`right-10 md:right-14 bg-action rounded-full px-2 transition-all duration-300 gap-1 ${
            visible
              ? "opacity-100 pointer-events-auto translate-x-0"
              : "opacity-0 pointer-events-none translate-x-10"
          }`}
        >
          <MapToolbarActions actions={actions} isDesktop={true}>
            {children}
          </MapToolbarActions>
        </ActionsToolbar>
      </div>
    </div>
  );
}
