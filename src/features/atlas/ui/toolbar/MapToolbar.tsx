import { useState } from "react";
import { FaChevronUp } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  ActionsToolbar,
  DirectionalIcon,
  Separator,
} from "@components";
import { useUI } from "@contexts/UIContext";
import { useLanguage } from "@features/settings";
import { useScreenSize } from "@hooks";
import { MapControls } from "./MapControls";
import { MapToolbarActions } from "./MapToolbarActions";
import { useToolbarActions } from "./useToolbarActions";
import "./MapToolbar.css";

interface MapToolbarProps {
  orientation: "horizontal" | "vertical";
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  isEmbed?: boolean;
  children?: React.ReactNode;
}

export function MapToolbar({
  orientation = "vertical",
  zoom,
  setZoom,
  isEmbed,
  children,
}: MapToolbarProps) {
  const { isRtl } = useLanguage();
  const { isMobile } = useScreenSize();
  const { uiVisible } = useUI();
  const { t } = useTranslation("atlas");

  const [visible, setVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const actions = useToolbarActions({
    isMobile,
    setMenuOpen,
  });

  // Handle toolbar toggle for vertical layout
  const handleToggle = () => {
    if (!visible) {
      setShouldRender(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  };

  // Handle transition end to unmount the toolbar when it is hidden
  const handleTransitionEnd = () => {
    if (!visible) {
      setShouldRender(false);
    }
  };

  const isVertical = orientation === "vertical";

  // Mobile Layout: Floating FAB + Popover
  if (isMobile) {
    return (
      <>
        <button
          className="fixed bottom-20 end-4 z-50 bg-action rounded-full p-4 shadow-lg"
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

        {menuOpen && (
          <div className="fixed end-4 z-[10020] mb-2 bottom-36">
            <div
              className="bg-action rounded-2xl p-4 w-52 shadow-xl flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <MapToolbarActions
                actions={actions}
                isDesktop={false}
                orientation={orientation}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // Vertical layout
  if (isVertical) {
    return (
      <div
        className={`fixed end-4 bottom-8 z-40 flex flex-col items-center transition-opacity duration-300 ${
          uiVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`flex flex-col items-center transition-all duration-300 origin-bottom ${
            visible
              ? "opacity-100 pointer-events-auto translate-y-0"
              : "opacity-0 pointer-events-none translate-y-4"
          } ${!shouldRender ? "hidden" : ""}`}
        >
          <div className="bg-action/90 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col items-center">
            <MapControls
              orientation="vertical"
              zoom={zoom}
              setZoom={setZoom}
              visible={visible}
            />
            <Separator orientation="horizontal" className="my-1 w-6" />
            <div className="flex flex-col items-center">
              <MapToolbarActions
                actions={actions}
                isDesktop={true}
                orientation="vertical"
              >
                {children}
              </MapToolbarActions>
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        {!isEmbed && (
          <ActionButton
            onClick={handleToggle}
            ariaLabel={
              visible ? t("toolbar.hideToolbar") : t("toolbar.showToolbar")
            }
            title={
              visible ? t("toolbar.hideToolbar") : t("toolbar.showToolbar")
            }
            titlePosition="left"
            variant="action"
            className={`shadow ${!visible ? "opacity-70" : ""}`}
            icon={
              <FaChevronUp
                className={`transition-transform duration-300 ${
                  visible ? "rotate-180" : "rotate-0"
                }`}
              />
            }
            rounded
          />
        )}
      </div>
    );
  }

  // Horizontal layout
  return (
    <div
      className={`toolbar-container ${
        isEmbed ? "!end-2 !bottom-0" : `end-4 bottom-8`
      } ${
        uiVisible ? "toolbar-container-visible" : "toolbar-container-hidden"
      }`}
    >
      <MapControls
        orientation="horizontal"
        zoom={zoom}
        setZoom={setZoom}
        visible={visible}
      />

      {!isEmbed && (
        <div
          className="relative flex items-center justify-end"
          style={{ height: "40px" }}
        >
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
            className={`shadow ${!visible ? "opacity-70" : ""}`}
            icon={
              visible ? (
                <DirectionalIcon direction="next" />
              ) : (
                <DirectionalIcon direction="prev" />
              )
            }
            rounded
          />
          <ActionsToolbar
            className={`end-14 bg-action rounded-full px-2 transition-all duration-300 gap-1 shadow ${
              visible
                ? "opacity-100 pointer-events-auto translate-x-0"
                : `opacity-0 pointer-events-none ${isRtl ? "-translate-x-10" : "translate-x-10"}`
            }`}
          >
            <MapToolbarActions
              actions={actions}
              isDesktop={true}
              orientation="horizontal"
            >
              {children}
            </MapToolbarActions>
          </ActionsToolbar>
        </div>
      )}
    </div>
  );
}
