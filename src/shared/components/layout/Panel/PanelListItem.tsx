import { useState, useRef } from "react";
import type { DragEvent, ReactNode } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaArrowsToEye,
  FaEllipsisVertical,
} from "react-icons/fa6";
import { useMenuPosition, useRenameControls } from "@hooks";
import { PanelListItemMenuActions } from "./PanelListItemMenuActions";
import { RenameControls } from "./RenameControls";
import { Menu } from "../Menu/Menu";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { ActionButton } from "../../action/ActionButton";
import { ColorDot } from "../../ui/ColorDot";

interface PanelListItemProps {
  color: string;
  icon?: ReactNode;
  name: ReactNode;
  onView?: () => void;
  visible: boolean;
  onToggleVisibility?: () => void;
  onCenter?: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
  onNameChange?: (newName: string) => void;
  onCopytoClipboard?: () => void;
  onRemove?: () => void;
  removeDisabled?: boolean;
  dragged?: boolean;
  onDragStart?: () => void;
  handleDragOver?: (e: DragEvent<HTMLLIElement>) => void;
  handleDragEnd?: () => void;
  menuContent?: ReactNode;
  menuPosition?: "left" | "right";
  children?: ReactNode;
}

export function PanelListItem({
  color,
  icon,
  name,
  onView,
  visible,
  onToggleVisibility,
  onCenter,
  onDownload,
  onEdit,
  onNameChange,
  onCopytoClipboard,
  onRemove,
  removeDisabled = false,
  dragged,
  onDragStart,
  handleDragOver,
  handleDragEnd,
  menuContent,
  menuPosition = "right",
  children,
}: PanelListItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Rename controls state and handlers
  const nameString = typeof name === "string" ? name : "";
  const {
    isEditing,
    editName,
    setEditName,
    handleEdit,
    handleSave,
    handleCancel,
    handleBlur,
    handleKeyDown,
  } = useRenameControls({ name: nameString, onNameChange });

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Position menu
  const menuStyle = useMenuPosition(
    menuOpen,
    btnRef,
    menuRef,
    30,
    menuPosition,
    false,
  );

  // Helper to close menu and call action
  const closeMenuAndCall = (action?: () => void) => {
    setTimeout(() => setMenuOpen(false), 200);
    if (action) action();
  };

  // Close menu when renaming
  if (isEditing && menuOpen) setMenuOpen(false);

  return (
    <>
      <li
        id="panel-list-item"
        className={`mb-4 flex items-center bg-surface-alt rounded-lg px-3 py-2 ${
          dragged ? "ring-dashed" : ""
        }`}
        draggable={onDragStart ? true : false}
        onDragStart={onDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        style={{
          cursor: onDragStart ? (dragged ? "grabbing" : "grab") : "default",
        }}
      >
        {!icon ? <ColorDot color={color} size={22} /> : icon}
        <div className="flex-1 ml-2 flex items-center">
          {isEditing ? (
            <RenameControls
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <strong
              className="cursor-pointer truncate"
              onDoubleClick={handleEdit}
            >
              {name}
            </strong>
          )}
          {children}
        </div>
        {!isEditing && onView && (
          <ActionButton
            variant="toggle"
            onClick={onView}
            ariaLabel={"View"}
            title={"View"}
            className="text-code hover:text-code-hover"
            icon={<FaArrowsToEye className="text-xl" />}
          />
        )}
        {!isEditing && onToggleVisibility && (
          <ActionButton
            variant="toggle"
            onClick={onToggleVisibility}
            ariaLabel={visible ? "Hide" : "Show"}
            title={visible ? "Hide" : "Show"}
            className={`${visible ? "text-muted" : "text-muted/50"} hover:text-muted-hover`}
            icon={visible ? <FaEye /> : <FaEyeSlash />}
          />
        )}
        {!isEditing && (
          <div ref={btnRef} style={{ position: "relative" }}>
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              ariaLabel="More actions"
              title="More actions"
              icon={<FaEllipsisVertical />}
              rounded
            />
            <Menu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              className="panel-listitem-menu !p-2 !z-[10100]"
              style={menuStyle}
              containerRef={menuRef}
              disableScroll={true}
            >
              {menuContent ? (
                menuContent
              ) : (
                <PanelListItemMenuActions
                  onCenter={
                    onCenter ? () => closeMenuAndCall(onCenter) : undefined
                  }
                  onDownload={
                    onDownload ? () => closeMenuAndCall(onDownload) : undefined
                  }
                  onEdit={onEdit ? () => closeMenuAndCall(onEdit) : undefined}
                  onNameChange={
                    onNameChange
                      ? () => closeMenuAndCall(handleEdit)
                      : undefined
                  }
                  onCopytoClipboard={
                    onCopytoClipboard
                      ? () => closeMenuAndCall(onCopytoClipboard)
                      : undefined
                  }
                  onRemove={
                    onRemove
                      ? () =>
                          closeMenuAndCall(() => {
                            if (!removeDisabled) setConfirmOpen(true);
                          })
                      : undefined
                  }
                  removeDisabled={removeDisabled}
                  handleEdit={handleEdit}
                />
              )}
            </Menu>
          </div>
        )}
      </li>
      {confirmOpen && onRemove && (
        <ConfirmModal
          isOpen={confirmOpen}
          title={"Delete item?"}
          message={
            <span>
              Are you sure you want to delete <strong>{name}</strong>?
            </span>
          }
          onConfirm={() => {
            setConfirmOpen(false);
            onRemove();
          }}
          onCancel={() => setConfirmOpen(false)}
          submitLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
}
