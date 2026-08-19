import { useEffect, useRef } from "react";
import type { DragEvent, ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import {
  useClickOutside,
  useContextMenu,
  useDisclosure,
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
  } = useRenameControls({
    name: nameString,
    onNameChange,
  });

  const confirmModal = useDisclosure();

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
      : {
          ...baseMenuStyle,
          zIndex: 10100,
        };

  // Close menu when renaming
  useEffect(() => {
    if (isEditing && menuOpen) {
      setMenuOpen(false);
    }
  }, [isEditing, menuOpen, setMenuOpen]);

  useClickOutside([btnRef, menuRef], handleCloseContext, menuOpen);

  const quickActions = [
    onToggleVisibility && {
      variant: "toggle" as const,
      onClick: onToggleVisibility,
      ariaLabel: visible ? t("actions.hide") : t("actions.show"),
      title: visible ? t("actions.hide") : t("actions.show"),
      className: `${
        visible ? "text-muted" : "text-muted/50"
      } hover:text-muted-hover`,
      icon: visible ? <ICONS.show /> : <ICONS.hide />,
    },
  ].filter(Boolean);

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
            if (!removeDisabled) {
              confirmModal.open();
            }
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
        className={`mb-4 flex items-center ${
          variant === "border" ? borderClass : baseClass
        } rounded-lg px-3 py-2 ${
          dragged ? "ring-dashed" : ""
        } ${onView ? "cursor-pointer transition" : ""}`}
        draggable={!!onDragStart}
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
                const target = e.target as HTMLElement;

                if (target?.closest?.(".panel-listitem-menu")) {
                  return;
                }

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
              icon={<ICONS.more />}
              rounded
            />

            <Menu
              open={menuOpen}
              className="panel-listitem-menu !p-2 !z-[10100]"
              style={dynamicMenuStyle}
              containerRef={menuRef as React.RefObject<HTMLDivElement>}
              disableScroll
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

      {confirmModal.isOpen && onRemove && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
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
            confirmModal.close();
            onRemove();
          }}
          onCancel={confirmModal.close}
          submitLabel={t("actions.delete")}
          cancelLabel={t("actions.cancel")}
        />
      )}
    </>
  );
}
