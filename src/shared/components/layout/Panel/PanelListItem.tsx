import type { DragEvent, ReactNode } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaArrowsToEye,
  FaEllipsisVertical,
} from "react-icons/fa6";
import { useState, useRef } from "react";
import { useRenameControls } from "@hooks";
import { useMenuPosition } from "@hooks";
import { RenameControls } from "./RenameControls";
import { ActionButton } from "../../action/ActionButton";
import { ColorDot } from "../../ui/ColorDot";
import { Menu } from "@components";
import { PanelListItemMenuActions } from "./PanelListItemMenuActions";

interface PanelListItemProps {
  color: string;
  icon?: ReactNode;
  name: string;
  onView?: () => void;
  visible: boolean;
  onToggleVisibility?: () => void;
  onCenter?: () => void;
  onEdit?: () => void;
  onNameChange?: (newName: string) => void;
  onRemove?: () => void;
  removeDisabled?: boolean;
  dragged?: boolean;
  onDragStart?: () => void;
  handleDragOver?: (e: DragEvent<HTMLLIElement>) => void;
  handleDragEnd?: () => void;
}

export function PanelListItem({
  color,
  icon,
  name,
  onView,
  visible,
  onToggleVisibility,
  onCenter,
  onEdit,
  onRemove,
  removeDisabled = false,
  dragged,
  onDragStart,
  handleDragOver,
  handleDragEnd,
  onNameChange,
}: PanelListItemProps) {
  const {
    isEditing,
    editName,
    setEditName,
    handleEdit,
    handleSave,
    handleCancel,
    handleBlur,
    handleKeyDown,
  } = useRenameControls({ name, onNameChange });

  const [menuOpen, setMenuOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position menu
  const menuStyle = useMenuPosition(
    menuOpen,
    btnRef,
    menuRef,
    30,
    "right",
    false,
  );

  // Close menu when renaming
  if (isEditing && menuOpen) setMenuOpen(false);

  return (
    <li
      id="panel-list-item"
      className={`mb-4 flex items-center bg-surface-alt rounded-lg px-3 py-2 ${
        dragged ? "ring-dashed" : ""
      }`}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      style={{ cursor: dragged ? "grabbing" : "grab" }}
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
          className="text-muted hover:text-muted-hover"
          icon={visible ? <FaEye /> : <FaEyeSlash />}
        />
      )}
      {!isEditing && (onCenter || onEdit || onNameChange || onRemove) && (
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
            className="panel-listitem-menu !p-2"
            style={menuStyle}
            containerRef={menuRef}
            disableScroll={true}
          >
            <PanelListItemMenuActions
              onCenter={
                onCenter
                  ? () => {
                      setTimeout(() => setMenuOpen(false), 200);
                      onCenter();
                    }
                  : undefined
              }
              onEdit={
                onEdit
                  ? () => {
                      setTimeout(() => setMenuOpen(false), 200);
                      onEdit();
                    }
                  : undefined
              }
              onNameChange={
                onNameChange
                  ? () => {
                      setTimeout(() => setMenuOpen(false), 200);
                      handleEdit();
                    }
                  : null
              }
              onRemove={
                onRemove
                  ? () => {
                      setTimeout(() => setMenuOpen(false), 200);
                      if (!removeDisabled && onRemove) onRemove();
                    }
                  : null
              }
              removeDisabled={removeDisabled}
              handleEdit={handleEdit}
            />
          </Menu>
        </div>
      )}
    </li>
  );
}
