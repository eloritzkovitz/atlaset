import { forwardRef, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  DirectionalIcon,
  MenuButton,
  Menu,
  Separator,
  RateMenu,
  ConfirmModal,
} from "@components";
import { ICONS } from "@constants/icons";
import { useTrips } from "@contexts/TripsContext";
import {
  useContextMenu,
  useFloatingHover,
  useFloatingMenuPosition,
  useMenuActions,
  useMenuPosition,
} from "@hooks";
import type { Trip } from "../../types";
import { canMarkCompleted, hasValidStartDate } from "../../utils/trips";
import { useUI } from "@contexts/UIContext";

interface TripActionsProps {
  trip: Trip;
  onEdit: (t: Trip) => void;
}

export const TripActions = forwardRef(function TripActions(
  { trip, onEdit }: TripActionsProps,
  ref,
) {
  const { t } = useTranslation("trips");
  const {
    sharedTripIds,
    markCompleted,
    duplicateTrip,
    updateTripFavorite,
    updateTripRating,
    removeTrip,
  } = useTrips();
  const { handleViewInCalendar } = useUI();

  const [rateMenuOpen, setRateMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const btnRef = useRef<HTMLDivElement>(null);
  const rateMenuRef = useRef<HTMLDivElement>(null);

  // Hover handlers for the rate submenu
  const {
    hoverHandlers: rateMenuHoverHandlers,
    floatingHandlers: rateButtonHoverHandlers,
  } = useFloatingHover(true, 150);

  // Context menu management
  const {
    open,
    setOpen,
    menuStyle: contextMenuStyle,
    menuRef,
    contextCoords,
    handleCloseContext,
  } = useContextMenu({
    zIndex: 1000,
    forwardedRef: ref,
    ignoreRefs: [btnRef, rateMenuRef],
    onClose: () => setRateMenuOpen(false),
  });
  const baseMenuStyle = useMenuPosition(
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
  const dynamicMenuStyle: React.CSSProperties =
    contextMenuStyle.position === "fixed"
      ? contextMenuStyle
      : { ...baseMenuStyle, zIndex: 1000 };

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
      onMarkCompleted: () => markCompleted(trip),
      onDuplicate: () => duplicateTrip(trip),
      onFavorite: () => updateTripFavorite(trip.id, !trip.favorite),
      onDelete: () => setConfirmOpen(true),
    },
    setOpen,
  );

  // Unified global close handler for all menus
  const handleCloseAll = () => {
    handleCloseContext();
    setRateMenuOpen(false);
  };

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
            handleCloseAll();
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
        onClose={handleCloseAll}
        className="trips-actions-menu !p-2"
        style={dynamicMenuStyle}
        containerRef={menuRef as React.RefObject<HTMLDivElement>}
        disableScroll={true}
      >
        {hasValidStartDate(trip) && (
          <MenuButton
            onClick={() => {
              handleCloseAll();
              handleViewInCalendar?.(trip);
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
            handleCloseAll();
          }}
          icon={<ICONS.edit className="me-2" />}
          className="w-full"
        >
          {t("table.actions.editTrip")}
        </MenuButton>
        {canMarkCompleted(trip) && (
          <MenuButton
            onClick={() => {
              menuActions.onMarkCompleted?.();
              handleCloseAll();
            }}
            icon={<ICONS.tripCompleted className="me-2" />}
            className="w-full"
          >
            {t("table.actions.markCompleted", "Mark Completed")}
          </MenuButton>
        )}
        <Separator className="my-2" />
        <MenuButton
          onClick={() => {
            menuActions.onDuplicate?.();
            handleCloseAll();
          }}
          icon={<ICONS.duplicate className="me-2" />}
          className="w-full"
        >
          {t("table.actions.duplicate")}
        </MenuButton>
        <MenuButton
          onClick={() => {
            menuActions.onFavorite?.();
            handleCloseAll();
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
                handleCloseAll();
                if (updateTripRating) updateTripRating(trip.id, value);
              }}
              onClose={handleCloseAll}
            />
          )}
        </div>
        <Separator className="my-2" />
        <MenuButton
          onClick={() => {
            menuActions.onDelete?.();
            handleCloseAll();
          }}
          icon={<ICONS.remove className="me-2" />}
          className="!text-danger w-full"
        >
          {t("table.actions.deleteTrip")}
        </MenuButton>
      </Menu>
      {confirmOpen && !!removeTrip && (
        <ConfirmModal
          isOpen={confirmOpen}
          title={"Delete item?"}
          message={
            <span>
              Are you sure you want to delete <strong>{trip?.name}</strong>?
            </span>
          }
          onConfirm={() => {
            setConfirmOpen(false);
            removeTrip(trip?.id ?? "").catch((error) => {
              console.error("Error deleting trip:", error);
            });
          }}
          onCancel={() => setConfirmOpen(false)}
          submitLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
});
