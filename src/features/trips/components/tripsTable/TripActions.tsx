import { useState, useRef } from "react";
import {
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaStar,
  FaChevronRight,
} from "react-icons/fa";
import { useClickOutside } from "@hooks/useClickOutside";
import { useKeyHandler } from "@hooks/useKeyHandler";
import { useMenuPosition } from "@hooks/useMenuPosition";
import type { Trip } from "@types";
import { ActionButton, MenuButton, Modal, Separator, StarRatingInput } from "@components";
import { RATING_ACTION_OPTIONS } from "@features/trips/constants/trips";

interface TripActionsProps {
  trip: Trip;
  onEdit: (t: Trip) => void;
  onDelete: (t: Trip) => void;
  onRatingChange?: (id: string, rating: number | undefined) => void;
}

export function TripActions({
  trip,
  onEdit,
  onDelete,
  onRatingChange,
}: TripActionsProps) {
  const [open, setOpen] = useState(false);
  const [rateMenuOpen, setRateMenuOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const rateMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <div ref={btnRef}>
        <ActionButton
          onClick={() => setOpen((v) => !v)}
          ariaLabel="More actions"
          title="More actions"
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          icon={<FaEllipsisV />}
        />
      </div>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        scrollable={false}
        position="custom"
        style={menuStyle}
        containerRef={menuRef}
        backdropClassName="trips-actions-backdrop"
        containerClassName="trips-actions-menu"
      >
        <MenuButton
          className="trips-actions-button"
          onClick={() => {
            setTimeout(() => setOpen(false), 300);
            onEdit(trip);
          }}
          icon={<FaEdit className="mr-2" />}
        >
          Edit
        </MenuButton>
        <MenuButton
          className="trips-actions-button trips-actions-delete"
          onClick={() => {
            setTimeout(() => setOpen(false), 300);
            onDelete(trip);
          }}
          icon={<FaTrash className="mr-2" />}
        >
          Delete
        </MenuButton>
        <Separator />
        <MenuButton
          className="trips-actions-button flex justify-between items-center"
          onClick={() => setRateMenuOpen(true)}
          icon={<FaStar className="mr-2 text-yellow-400" />}
        >
          Rate
          <FaChevronRight className="ml-2" />
        </MenuButton>
      </Modal>
      <Modal
        isOpen={rateMenuOpen}
        onClose={() => setRateMenuOpen(false)}
        scrollable={false}
        position="custom"
        style={{
          ...rateMenuStyle,
          left: getRateMenuLeft(),
          top: getRateMenuTop(),
          zIndex: 1000,
          width: 280,
        }}
        containerRef={rateMenuRef}
        backdropClassName="trips-actions-backdrop"
        containerClassName="trips-actions-menu"
      >
        {RATING_ACTION_OPTIONS.map((opt) => (
          <MenuButton
            key={opt.value}
            className="trips-actions-button"
            onClick={() => {
              setTimeout(() => {
                setRateMenuOpen(false);
                setOpen(false);
              }, 300);
              if (onRatingChange) onRatingChange(trip.id, opt.value);
            }}
            icon={
              <span className="flex items-center">
                <StarRatingInput value={opt.value} readOnly />
              </span>
            }
          >
            {opt.label}
          </MenuButton>
        ))}        
      </Modal>
    </>
  );
}
