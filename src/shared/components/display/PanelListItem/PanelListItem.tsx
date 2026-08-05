import { useState, useRef } from "react";
import type { DragEvent, ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaEllipsisVertical } from "react-icons/fa6";
import {
  useContextMenu,
  useMenuActions,
  useMenuPosition,
  useRenameControls,
} from "@hooks";
import { RenameControls } from "./RenameControls";
import { ColorDot } from "../ColorDot";
import { ActionButton } from "../../inputs/Button/ActionButton";
import { Menu } from "../../navigation/Menu/Menu";
import { MenuActions } from "../../navigation/Menu/MenuActions";
import { ConfirmModal } from "../../overlay/Modal/ConfirmModal";

interface PanelListItemProps {
  color: string;
  variant?: "default" | "border";
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
  onCreateList?: () => void;
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
  variant = "default",
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
  onCreateList,
  removeDisabled = false,
  dragged,
  onDragStart,
  handleDragOver,
  handleDragEnd,
  menuContent,
  menuPosition = "right",
  children,
}: PanelListItemProps) {
  const btnRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation("common");

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

  // Context menu state and handlers
  const {
    open: menuOpen,
    setOpen: setMenuOpen,
    menuStyle: contextMenuStyle,
    menuRef,
    handleContextMenu,
    handleCloseContext,
  } = useContextMenu({
    zIndex: 10100,
    disabled: isEditing,
    ignoreRefs: [btnRef],
  });
  const baseMenuStyle = useMenuPosition(
    menuOpen,
    btnRef,
    menuRef,
    30,
    menuPosition,
    "adjacent",
    false,
  );
  const dynamicMenuStyle: React.CSSProperties =
    contextMenuStyle.position === "fixed"
      ? contextMenuStyle
      : { ...baseMenuStyle, zIndex: 10100 };

  // Close menu when renaming
  if (isEditing && menuOpen) setMenuOpen(false);

  // Action configs for quick actions
  const quickActions = [
    onToggleVisibility && {
      variant: "toggle" as const,
      onClick: onToggleVisibility,
      ariaLabel: visible ? t("actions.hide") : t("actions.show"),
      title: visible ? t("actions.hide") : t("actions.show"),
      className: `${visible ? "text-muted" : "text-muted/50"} hover:text-muted-hover`,
      icon: visible ? <FaEye /> : <FaEyeSlash />,
    },
  ].filter(Boolean);

  // Generic menu actions config using useMenuActions
  const menuActions = useMenuActions(
    {
      onView,
      onCenter,
      onDownload,
      onEdit,
      onNameChange: onNameChange ? handleEdit : undefined,
      onDuplicate,
      onCopytoClipboard,
      onCreateList,
      onRemove: onRemove
        ? () => {
            if (!removeDisabled) setConfirmOpen(true);
          }
        : undefined,
    },
    handleCloseContext,
  );

  const baseClass = "bg-input/50 hover:bg-input-hover/50";
  const borderClass = "border border-border hover:bg-input-hover/50";

  return (
    <>
      <li
        id="panel-list-item"
        className={`mb-4 flex items-center ${variant === "border" ? borderClass : baseClass} rounded-lg px-3 py-2 ${
          dragged ? "ring-dashed" : ""
        } ${onView ? "cursor-pointer transition" : ""}`}
        draggable={onDragStart ? true : false}
        onDragStart={onDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onContextMenu={handleContextMenu}
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
        <div className="flex-1 ms-2 flex items-center">
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
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              ariaLabel={t("actions.moreActions")}
              title={t("actions.moreActions")}
              icon={<FaEllipsisVertical />}
              rounded
            />
            <Menu
              open={menuOpen}
              onClose={handleCloseContext}
              className="panel-listitem-menu !p-2 !z-[10100]"
              style={dynamicMenuStyle}
              containerRef={menuRef as React.RefObject<HTMLDivElement>}
              disableScroll={true}
            >
              {menuContent ? (
                menuContent
              ) : (
                <MenuActions
                  {...menuActions}
                  handleEdit={handleEdit}
                  removeDisabled={removeDisabled}
                />
              )}
            </Menu>
          </div>
        )}
      </li>
      {confirmOpen && onRemove && (
        <ConfirmModal
          isOpen={confirmOpen}
          title={t("feedback.delete.confirmTitle")}
          message={
            <Trans
              i18nKey="feedback.delete.confirmMessage"
              ns="common"
              values={{ name: nameString }}
              components={[<span key="0" />, <strong key="1" />]}
            />
          }
          onConfirm={() => {
            setConfirmOpen(false);
            onRemove();
          }}
          onCancel={() => setConfirmOpen(false)}
          submitLabel={t("actions.delete")}
          cancelLabel={t("actions.cancel")}
        />
      )}
    </>
  );
}
