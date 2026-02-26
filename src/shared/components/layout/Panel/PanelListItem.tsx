import { useState, useRef } from "react";
import type { DragEvent, ReactNode } from "react";
import { FaEye, FaEyeSlash, FaEllipsisVertical } from "react-icons/fa6";
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
  onDuplicate?: () => void;
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
  onDuplicate,
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
    setTimeout(() => setMenuOpen(false), 100);
    if (action) action();
  };

  // Close menu when renaming
  if (isEditing && menuOpen) setMenuOpen(false);

  // Action configs for quick actions
  const quickActions = [
    onToggleVisibility && {
      variant: "toggle" as const,
      onClick: onToggleVisibility,
      ariaLabel: visible ? "Hide" : "Show",
      title: visible ? "Hide" : "Show",
      className: `${visible ? "text-muted" : "text-muted/50"} hover:text-muted-hover`,
      icon: visible ? <FaEye /> : <FaEyeSlash />,
    },
  ].filter(Boolean);

  // Wrap menu actions to close menu after action
  const wrapMenuAction = (action?: () => void) =>
    action ? () => closeMenuAndCall(action) : undefined;

  // Menu actions config
  const menuActions = {
    onView: wrapMenuAction(onView),
    onCenter: wrapMenuAction(onCenter),
    onDownload: wrapMenuAction(onDownload),
    onEdit: wrapMenuAction(onEdit),
    onNameChange: wrapMenuAction(onNameChange ? handleEdit : undefined),
    onDuplicate: wrapMenuAction(onDuplicate),
    onCopytoClipboard: wrapMenuAction(onCopytoClipboard),
    onRemove: onRemove
      ? () =>
          closeMenuAndCall(() => {
            if (!removeDisabled) setConfirmOpen(true);
          })
      : undefined,
    removeDisabled,
    handleEdit,
  };

  return (
    <>
      <li
        id="panel-list-item"
        className={`mb-4 flex items-center bg-surface-alt rounded-lg px-3 py-2 ${
          dragged ? "ring-dashed" : ""
        } ${onView ? "cursor-pointer transition" : ""}`}
        draggable={onDragStart ? true : false}
        onDragStart={onDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        style={{
          cursor: onDragStart
            ? dragged
              ? "grabbing"
              : "grab"
            : onView
              ? "pointer"
              : "default",
        }}
        onClick={
          !isEditing && onView
            ? (e) => {
                // Prevent menu or other actions from triggering view
                const target = e.target as HTMLElement;
                if (
                  target &&
                  target.closest &&
                  target.closest(".panel-listitem-menu")
                )
                  return;
                onView();
              }
            : undefined
        }
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
        {!isEditing &&
          quickActions.map((action, i) => <ActionButton key={i} {...action} />)}
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
                <PanelListItemMenuActions {...menuActions} />
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
