import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuButton, Separator } from "@components";
import { ICONS } from "@constants/icons";
import type { Country } from "@features/countries";
import { useClickOutside, useKeyHandler, useMenuPosition } from "@hooks";
import type { Point } from "@types";
import { useCountryActions } from "../../hooks/useCountryActions";

interface CountryActionsProps {
  country: Country | null;
  triggerRef: React.RefObject<HTMLElement | null>;
  onCountryInfo?: (country: Country) => void;
  onCloseListPanel?: () => void;
}

export const CountryActions = forwardRef(function CountryActions(
  { country, triggerRef, onCountryInfo, onCloseListPanel }: CountryActionsProps,
  ref,
) {
  const { t } = useTranslation("atlas");
  const [open, setOpen] = useState(false);
  const [contextCoords, setContextCoords] = useState<Point | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Expose method to trigger menu position dynamically from right-click events
  useImperativeHandle(ref, () => ({
    openAtCoordinates: (x: number, y: number) => {
      setContextCoords({ x, y });
      setOpen(true);
    },
  }));

  // Close menu and reset context coordinates
  const handleClose = () => {
    setOpen(false);
    setContextCoords(null);
  };

  // Close menu on outside click or Escape key press
  useClickOutside([menuRef as React.RefObject<HTMLElement>], handleClose, open);
  useKeyHandler(handleClose, ["Escape"], open);

  // Position menu dynamically based on context coordinates or trigger element
  const menuStyle = useMenuPosition(
    open,
    triggerRef,
    menuRef,
    0,
    "left",
    "adjacent",
    false,
  );

  const dynamicMenuStyle: React.CSSProperties = contextCoords
    ? {
        position: "fixed",
        left: contextCoords.x,
        top: contextCoords.y,
        transform: "none",
        zIndex: 1000,
      }
    : menuStyle;

  // Get action configurations based on country and context
  const actions = useCountryActions({
    country: country!,
    onCloseMenu: handleClose,
    onClosePanel: onCloseListPanel,
  });

  // Do not render menu if no country is selected
  if (!country) return null;

  return (
    <Menu
      open={open}
      onClose={handleClose}
      className="country-actions-menu !p-2"
      style={dynamicMenuStyle}
      containerRef={menuRef}
      disableScroll={true}
    >
      <MenuButton
        onClick={() => {
          handleClose();
          if (onCountryInfo) onCountryInfo(country);
        }}
        icon={<ICONS.view className="me-2" />}
        className="w-full"
      >
        {t("countries.actions.viewDetails", "View Details")}
      </MenuButton>
      <Separator className="my-2" />

      {actions.map((action) => (
        <MenuButton
          key={action.id}
          onClick={() => {
            action.onClick();
            handleClose();
          }}
          icon={
            <span className="me-2 inline-flex items-center">{action.icon}</span>
          }
          className="w-full"
        >
          {action.label}
        </MenuButton>
      ))}
    </Menu>
  );
});
