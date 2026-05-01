import { useState } from "react";
import { FaChevronUp } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { ActionButton, ActionsToolbar, DirectionalIcon } from "@components";
import { useUI } from "@contexts/UIContext";
import { useIsRtl, useScreenSize } from "@hooks";
import { MapControls } from "./MapControls";
import { MapToolbarActions } from "./MapToolbarActions";
import { useToolbarActions } from "./useToolbarActions";
import "./MapToolbar.css";

interface MapToolbarProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  isEmbed?: boolean;
  children?: React.ReactNode;
}

export function MapToolbar({
  zoom,
  setZoom,
  isEmbed,
  children,
}: MapToolbarProps) {
  const { t } = useTranslation("atlas");

  // UI state
  const { uiVisible } = useUI();
  const [visible, setVisible] = useState(true);

  // Detect mobile
  const { isMobile } = useScreenSize();
  const isRtl = useIsRtl();

  // Auto-hide toolbar on mobile after a delay
  const [menuOpen, setMenuOpen] = useState(false);

  // Use config for actions
  const actions = useToolbarActions({
    isMobile,
    setMenuOpen,
  });

  // Mobile toolbar
  if (isMobile) {
    return (
      <>
        {/* Floating FAB */}
        <button
          className="fixed bottom-20 end-4 z-50 bg-action rounded-full p-4 shadow"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen
              ? t("toolbar.closeMapActions")
              : t("toolbar.openMapActions")
          }
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
            className="fixed end-4 z-[10020] mb-2"
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
        isEmbed ? "!end-2 !bottom-0" : "end-0 md:end-4 bottom-8"
      } ${
        uiVisible ? "toolbar-container-visible" : "toolbar-container-hidden"
      }`}
    >
      {/* Zoom controls: vertical slide */}
      <MapControls zoom={zoom} setZoom={setZoom} visible={visible} />
      {!isEmbed && (
        <div
          className="relative flex items-center w-full justify-end"
          style={{ height: "40px" }}
        >
          {/* Toggle button */}
          <ActionButton
            onClick={() => setVisible((v) => !v)}
            ariaLabel={
              visible ? t("toolbar.hideToolbar") : t("toolbar.showToolbar")
            }
            title={
              visible ? t("toolbar.hideToolbar") : t("toolbar.showToolbar")
            }
            titlePosition="left"
            variant="action"
            className={`${!visible ? "opacity-70" : ""}`}
            icon={
              visible ? (
                <DirectionalIcon direction="next" />
              ) : (
                <DirectionalIcon direction="prev" />
              )
            }
            rounded
          />
          {/* Actions: horizontal slide */}
          <ActionsToolbar
            className={`end-10 md:end-14 bg-action rounded-full px-2 transition-all duration-300 gap-1 ${
              visible
                ? "opacity-100 pointer-events-auto translate-x-0"
                : `opacity-0 pointer-events-none ${isRtl ? "-translate-x-10" : "translate-x-10"}`
            }`}
          >
            <MapToolbarActions actions={actions} isDesktop={true}>
              {children}
            </MapToolbarActions>
          </ActionsToolbar>
        </div>
      )}
    </div>
  );
}
