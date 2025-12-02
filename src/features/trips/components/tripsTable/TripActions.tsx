import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { useClickOutside } from "@hooks/useClickOutside";
import { useKeyHandler } from "@hooks/useKeyHandler";
import { useMenuPosition } from "@hooks/useMenuPosition";
import type { Trip } from "@types";
import { ActionButton, MenuButton } from "@components";

interface TripActionsProps {
  trip: Trip;
  onEdit: (t: Trip) => void;
  onDelete: (t: Trip) => void;
}

export function TripActions({ trip, onEdit, onDelete }: TripActionsProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useClickOutside(
    [
      menuRef as React.RefObject<HTMLElement>,
      btnRef as React.RefObject<HTMLElement>,
    ],
    () => setOpen(false),
    open
  );

  // Close menu on ESC key
  useKeyHandler(() => setOpen(false), ["Escape"], open);

  // Position the menu when open
  const menuStyle = useMenuPosition(open, btnRef, menuRef, 3, "left", false);

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
      {open &&
        createPortal(
          <div ref={menuRef} className="trips-actions-menu" style={menuStyle}>
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
          </div>,
          document.body
        )}
    </>
  );
}
