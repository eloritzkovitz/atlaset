import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  DirectionalIcon,
  MenuButton,
  Menu,
  Separator,
  RateMenu,
} from "@components";
import { ICONS } from "@constants/icons";
import { useTrips } from "@contexts/TripsContext";
import {
  useClickOutside,
  useFloatingHover,
  useFloatingMenuPosition,
  useKeyHandler,
  useMenuActions,
  useMenuPosition,
} from "@hooks";
import type { Point } from "@types";
import type { Trip } from "../../types";
import { hasValidStartDate } from "../../utils/trips";

interface TripActionsProps {
  trip: Trip;
  onViewInCalendar?: (t: Trip) => void;
  onEdit: (t: Trip) => void;
  onDuplicate: (t: Trip) => void;
  onDelete: (t: Trip) => void;
}

export const TripActions = forwardRef(function TripActions(
  { trip, onViewInCalendar, onEdit, onDuplicate, onDelete }: TripActionsProps,
  ref,
) {
  const { t } = useTranslation("trips");
  const { sharedTripIds, updateTripFavorite, updateTripRating } = useTrips();
  const [open, setOpen] = useState(false);
  const [rateMenuOpen, setRateMenuOpen] = useState(false);
  const [contextCoords, setContextCoords] = useState<Point | null>(null);

  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rateMenuRef = useRef<HTMLDivElement>(null);

  const {
    hoverHandlers: rateMenuHoverHandlers,
    floatingHandlers: rateButtonHoverHandlers,
  } = useFloatingHover(true, 150);

  // Expose method to open menu at specific coordinates for context menu support
  useImperativeHandle(ref, () => ({
    openAtCoordinates: (x: number, y: number) => {
      setContextCoords({ x, y });
      setOpen(true);
    },
  }));

  // Clean interceptor to wipe coordinates when resetting menus
  const handleClose = () => {
    setOpen(false);
    setRateMenuOpen(false);
    setContextCoords(null);
  };

  // Close both menus when clicking outside
  useClickOutside(
    [
      menuRef as React.RefObject<HTMLElement>,
      btnRef as React.RefObject<HTMLElement>,
      rateMenuRef as React.RefObject<HTMLElement>,
    ],
    () => {
      setOpen(false);
      setRateMenuOpen(false);
    },
    open || rateMenuOpen,
  );

  // Close both menus on ESC key
  useKeyHandler(
    () => {
      setOpen(false);
      setRateMenuOpen(false);
    },
    ["Escape"],
    open || rateMenuOpen,
  );

  // Position the menu when open
  const menuStyle = useMenuPosition(
    open,
    btnRef,
    menuRef,
    3,
    "left",
    "adjacent",
    false,
  );
  const rateMenuStyle = useMenuPosition(
    rateMenuOpen,
    menuRef,
    rateMenuRef,
    0,
    "right",
    "adjacent",
    false,
  );

  const dynamicMenuStyle: React.CSSProperties = contextCoords
    ? {
        position: "fixed",
        left: contextCoords.x,
        top: contextCoords.y,
        transform: "none",
      }
    : menuStyle;

  // Calculate rate menu left position to prevent overflow
  const rateMenuLeft =
    (typeof rateMenuStyle.left === "number" ? rateMenuStyle.left : 0) +
    (menuRef.current?.offsetWidth ?? 180);
  const { left: rateMenuLeftFinal, top: rateMenuTopFinal } =
    useFloatingMenuPosition(
      menuRef,
      rateMenuRef,
      contextCoords
        ? contextCoords.x + (menuRef.current?.offsetWidth ?? 180)
        : rateMenuLeft,
      contextCoords ? contextCoords.y : (rateMenuStyle.top as number),
    );

  // Check if trip is shared
  const isShared = sharedTripIds?.has(trip.id);

  // Menu actions
  const menuActions = useMenuActions(
    {
      onEdit: () => onEdit(trip),
      onDelete: () => onDelete(trip),
      onFavorite: () => updateTripFavorite(trip.id, !trip.favorite),
      onDuplicate: () => onDuplicate(trip),
    },
    setOpen,
  );

  if (isShared) {
    return (
      <ActionButton
        ariaLabel={t("table.actions.sharedDisabledTitle")}
        title={t("table.actions.sharedDisabledTitle")}
        icon={<ICONS.more />}
        rounded
        disabled
      />
    );
  }

  return (
    <>
      <div ref={btnRef}>
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            setContextCoords(null);
            setOpen((v) => !v);
          }}
          ariaLabel={t("table.actions.moreActions")}
          title={t("table.actions.moreActions")}
          icon={<ICONS.more />}
          rounded
        />
      </div>
      <Menu
        open={open}
        onClose={handleClose}
        className="trips-actions-menu !p-2"
        style={dynamicMenuStyle}
        containerRef={menuRef}
        disableScroll={true}
      >
        {hasValidStartDate(trip) && (
          <MenuButton
            onClick={() => {
              setTimeout(handleClose, 300);
              onViewInCalendar?.(trip);
            }}
            icon={<ICONS.calendar className="me-2" />}
            className="w-full"
          >
            {t("table.actions.viewInCalendar")}
          </MenuButton>
        )}
        <MenuButton
          onClick={() => {
            menuActions.onEdit?.();
            handleClose();
          }}
          icon={<ICONS.edit className="me-2" />}
          className="w-full"
        >
          {t("table.actions.editTrip")}
        </MenuButton>
        <Separator className="my-2" />
        <MenuButton
          onClick={() => {
            menuActions.onDuplicate?.();
            handleClose();
          }}
          icon={<ICONS.duplicate className="me-2" />}
          className="w-full"
        >
          {t("table.actions.duplicate")}
        </MenuButton>
        <MenuButton
          onClick={() => {
            menuActions.onFavorite?.();
            handleClose();
          }}
          icon={
            trip.favorite ? (
              <ICONS.unfavorite className="me-2 text-muted" />
            ) : (
              <ICONS.favorite className="me-2 text-danger" />
            )
          }
          className="w-full"
        >
          {trip.favorite
            ? t("table.actions.unfavorite")
            : t("table.actions.favorite")}
        </MenuButton>
        <div
          style={{ display: "inline-block", width: "100%" }}
          onMouseEnter={() => setRateMenuOpen(true)}
          onMouseLeave={() => setRateMenuOpen(false)}
        >
          <MenuButton
            {...rateButtonHoverHandlers}
            icon={<ICONS.rate className="me-2 text-yellow-400" />}
            className="w-full flex items-center justify-between"
          >
            {t("table.actions.rate")}
            <DirectionalIcon direction="next" className="ms-auto" />
          </MenuButton>
          {rateMenuOpen && (
            <RateMenu
              open={rateMenuOpen}
              menuStyle={{
                ...rateMenuStyle,
                left: rateMenuLeftFinal,
                top: rateMenuTopFinal,
                zIndex: 1000,
                width: 280,
              }}
              menuRef={rateMenuRef}
              hoverHandlers={rateMenuHoverHandlers}
              onRate={(value) => {
                setTimeout(handleClose, 300);
                if (updateTripRating) updateTripRating(trip.id, value);
              }}
              onClose={handleClose}
            />
          )}
        </div>
        <Separator className="my-2" />
        <MenuButton
          onClick={() => {
            menuActions.onDelete?.();
            handleClose();
          }}
          icon={<ICONS.remove className="me-2" />}
          className="!text-danger w-full"
        >
          {t("table.actions.deleteTrip")}
        </MenuButton>
      </Menu>
    </>
  );
});
