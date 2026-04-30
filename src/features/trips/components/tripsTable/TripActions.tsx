import { useState, useRef } from "react";
import {
  FaEllipsisVertical,
  FaPenToSquare,
  FaTrash,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaCalendar,
} from "react-icons/fa6";
import {
  ActionButton,
  DirectionalIcon,
  MenuButton,
  Menu,
  Separator,
  RateMenu,
} from "@components";
import { useTrips } from "@contexts/TripsContext";
import {
  useClickOutside,
  useFloatingHover,
  useFloatingMenuPosition,
  useKeyHandler,
  useMenuActions,
  useMenuPosition,
} from "@hooks";
import type { Trip } from "../../types";
import { hasValidStartDate } from "../../utils/trips";

interface TripActionsProps {
  trip: Trip;
  onViewInCalendar?: (t: Trip) => void;
  onEdit: (t: Trip) => void;
  onDelete: (t: Trip) => void;
}

export function TripActions({
  trip,
  onViewInCalendar,
  onEdit,
  onDelete,
}: TripActionsProps) {
  const { sharedTripIds, updateTripFavorite, updateTripRating } = useTrips();
  const [open, setOpen] = useState(false);
  const [rateMenuOpen, setRateMenuOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rateMenuRef = useRef<HTMLDivElement>(null);

  const {
    hoverHandlers: rateMenuHoverHandlers,
    floatingHandlers: rateButtonHoverHandlers,
  } = useFloatingHover(true, 150);

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
  const menuStyle = useMenuPosition(open, btnRef, menuRef, 3, "left", false);
  const rateMenuStyle = useMenuPosition(
    rateMenuOpen,
    menuRef,
    rateMenuRef,
    0,
    "right",
    false,
  );

  // Calculate rate menu left position to prevent overflow
  const rateMenuLeft =
    (typeof rateMenuStyle.left === "number" ? rateMenuStyle.left : 0) +
    (menuRef.current?.offsetWidth ?? 180);
  const { left: rateMenuLeftFinal, top: rateMenuTopFinal } =
    useFloatingMenuPosition(
      menuRef,
      rateMenuRef,
      rateMenuLeft,
      rateMenuStyle.top as number,
    );

  // Check if trip is shared
  const isShared = sharedTripIds?.has(trip.id);

  // Menu actions
  const menuActions = useMenuActions(
    {
      onEdit: () => onEdit(trip),
      onDelete: () => onDelete(trip),
      onFavorite: () => updateTripFavorite(trip.id, !trip.favorite),
    },
    setOpen,
  );

  if (isShared) {
    return (
      <ActionButton
        ariaLabel="Shared trip actions disabled"
        title="Shared trips cannot be edited"
        icon={<FaEllipsisVertical />}
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
            setOpen((v) => !v);
          }}
          ariaLabel="More actions"
          title="More actions"
          icon={<FaEllipsisVertical />}
          rounded
        />
      </div>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        className="trips-actions-menu !p-2"
        style={menuStyle}
        containerRef={menuRef}
        disableScroll={true}
      >
        {hasValidStartDate(trip) && (
          <MenuButton
            onClick={() => {
              setTimeout(() => setOpen(false), 300);
              onViewInCalendar?.(trip);
            }}
            icon={<FaCalendar className="me-2" />}
            className="w-full"
          >
            View in Calendar
          </MenuButton>
        )}
        <MenuButton
          onClick={menuActions.onEdit}
          icon={<FaPenToSquare className="me-2" />}
          className="w-full"
        >
          Edit Trip
        </MenuButton>
        <Separator className="my-2" />
        <MenuButton
          onClick={menuActions.onFavorite}
          icon={
            trip.favorite ? (
              <FaRegHeart className="me-2 text-muted" />
            ) : (
              <FaHeart className="me-2 text-danger" />
            )
          }
          className="w-full"
        >
          {trip.favorite ? "Unfavorite" : "Favorite"}
        </MenuButton>
        <div
          style={{ display: "inline-block", width: "100%" }}
          onMouseEnter={() => setRateMenuOpen(true)}
          onMouseLeave={() => setRateMenuOpen(false)}
        >
          <MenuButton
            {...rateButtonHoverHandlers}
            icon={<FaStar className="me-2 text-yellow-400" />}
            className="w-full flex items-center justify-between"
          >
            Rate
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
                setTimeout(() => setOpen(false), 300);
                if (updateTripRating) updateTripRating(trip.id, value);
              }}
              onClose={() => setOpen(false)}
            />
          )}
          <Separator className="my-2" />
          <MenuButton
            onClick={menuActions.onDelete}
            icon={<FaTrash className="me-2" />}
            className="!text-danger w-full"
          >
            Delete Trip
          </MenuButton>
        </div>
      </Menu>
    </>
  );
}
