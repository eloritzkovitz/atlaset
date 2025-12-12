import { useState, useRef } from "react";
import {
  FaEllipsisVertical,
  FaPenToSquare,
  FaTrash,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaChevronRight,
} from "react-icons/fa6";
import { useTrips } from "@contexts/TripsContext";
import { useClickOutside } from "@hooks/useClickOutside";
import { useKeyHandler } from "@hooks/useKeyHandler";
import { useMenuPosition } from "@hooks/useMenuPosition";
import type { Trip } from "@types";
import {
  ActionButton,
  MenuButton,
  Menu,
  Separator,
  StarRatingInput,
} from "@components";
import { RATING_ACTION_OPTIONS } from "@features/trips/constants/trips";

interface TripActionsProps {
  trip: Trip;
  onEdit: (t: Trip) => void;
  onDelete: (t: Trip) => void;
}

export function TripActions({ trip, onEdit, onDelete }: TripActionsProps) {
  const { updateTripFavorite, updateTripRating } = useTrips();
  const [open, setOpen] = useState(false);
  const [rateMenuOpen, setRateMenuOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rateMenuRef = useRef<HTMLDivElement>(null);
  const rateMenuCloseTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close menu when clicking outside
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
    open || rateMenuOpen
  );

  // Close menu on ESC key
  useKeyHandler(
    () => {
      setOpen(false);
      setRateMenuOpen(false);
    },
    ["Escape"],
    open || rateMenuOpen
  );

  // Position the menu when open
  const menuStyle = useMenuPosition(open, btnRef, menuRef, 3, "left", false);
  const rateMenuStyle = useMenuPosition(
    rateMenuOpen,
    menuRef,
    rateMenuRef,
    0,
    "right",
    false
  );

  // Calculate left offset for rate menu (side-by-side)
  const rateMenuLeft =
    (typeof rateMenuStyle.left === "number" ? rateMenuStyle.left : 0) +
    (menuRef.current?.offsetWidth ?? 180);

  // Adjust rate menu position if not enough space
  const getRateMenuLeft = () => {
    const mainMenu = menuRef.current;
    const rateMenu = rateMenuRef.current;
    if (!mainMenu || !rateMenu) return rateMenuLeft;

    const mainRect = mainMenu.getBoundingClientRect();
    const rateWidth = rateMenu.offsetWidth || 180;
    const windowWidth = window.innerWidth;

    // If not enough space on the right, position to the left
    if (mainRect.right + rateWidth > windowWidth) {
      return mainRect.left - rateWidth;
    }
    // Otherwise, position to the right
    return mainRect.right;
  };

  const getRateMenuTop = () => {
    const mainMenu = menuRef.current;
    const rateMenu = rateMenuRef.current;
    if (!mainMenu || !rateMenu) return rateMenuStyle.top;

    const mainRect = mainMenu.getBoundingClientRect();
    const rateHeight = rateMenu.offsetHeight || 300;
    const windowHeight = window.innerHeight;

    // Default: align tops
    let top = mainRect.top;

    // If bottom would overflow, adjust top
    if (top + rateHeight > windowHeight) {
      top = Math.max(windowHeight - rateHeight - 8, 8); // 8px margin from edge
    }
    // If top would overflow, adjust top
    if (top < 8) {
      top = 8;
    }
    return top;
  };

  // Handlers for delayed hover menu
  const handleRateMenuEnter = () => {
    if (rateMenuCloseTimeout.current) {
      clearTimeout(rateMenuCloseTimeout.current);
      rateMenuCloseTimeout.current = null;
    }
    setRateMenuOpen(true);
  };

  const handleRateMenuLeave = () => {
    rateMenuCloseTimeout.current = setTimeout(() => {
      setRateMenuOpen(false);
    }, 150);
  };

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
      >
        <MenuButton
          onClick={() => {
            setTimeout(() => setOpen(false), 300);
            onEdit(trip);
          }}
          icon={<FaPenToSquare className="mr-2" />}
          className="w-full"
        >
          Edit
        </MenuButton>
        <MenuButton
          onClick={() => {
            setTimeout(() => setOpen(false), 300);
            onDelete(trip);
          }}
          icon={<FaTrash className="mr-2" />}
          className="text-danger w-full"
        >
          Delete
        </MenuButton>
        <Separator />
        <MenuButton
          onClick={() => {
            setTimeout(() => setOpen(false), 300);
            updateTripFavorite(trip.id, !trip.favorite);
          }}
          icon={
            trip.favorite ? (
              <FaRegHeart className="mr-2 text-gray-400" />
            ) : (
              <FaHeart className="mr-2 text-danger" />
            )
          }
          className="w-full"
        >
          {trip.favorite ? "Unfavorite" : "Favorite"}
        </MenuButton>
        <div
          style={{ display: "inline-block", width: "100%" }}
          onMouseEnter={handleRateMenuEnter}
          onMouseLeave={handleRateMenuLeave}
        >
          <MenuButton
            icon={<FaStar className="mr-2 text-yellow-400" />}
            className="justify-between w-full"
          >
            Rate
            <FaChevronRight className="ml-7" />
          </MenuButton>
          <Menu
            open={rateMenuOpen}
            onClose={() => setRateMenuOpen(false)}
            className="trips-actions-menu w-full"
            style={{
              ...rateMenuStyle,
              left: getRateMenuLeft(),
              top: getRateMenuTop(),
              zIndex: 1000,
              width: 280,
            }}
            containerRef={rateMenuRef}
            onMouseEnter={handleRateMenuEnter}
            onMouseLeave={handleRateMenuLeave}
          >
            {RATING_ACTION_OPTIONS.map((opt) => (
              <MenuButton
                key={opt.value}
                onClick={() => {
                  setTimeout(() => {
                    setRateMenuOpen(false);
                    setOpen(false);
                  }, 300);
                  if (updateTripRating) updateTripRating(trip.id, opt.value);
                }}
                icon={
                  <span className="flex items-center">
                    <StarRatingInput value={opt.value} readOnly />
                  </span>
                }
                className="w-full"
              >
                {opt.label}
              </MenuButton>
            ))}
          </Menu>
        </div>
      </Menu>
    </>
  );
}
