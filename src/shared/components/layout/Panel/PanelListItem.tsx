import type { DragEvent, ReactNode } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaPenToSquare,
  FaTrash,
  FaCrosshairs,
  FaCircleInfo,
  FaPencil,
  FaArrowsToEye,
} from "react-icons/fa6";
import { useRenameControls } from "@hooks";
import { RenameControls } from "./RenameControls";
import { ActionButton } from "../../action/ActionButton";
import { ColorDot } from "../../ui/ColorDot";

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
      {!isEditing && (
        <>
          {onView && (
            <ActionButton
              variant="toggle"
              onClick={onView}
              ariaLabel={"View"}
              title={"View"}
              className="text-code hover:text-code-hover"
              icon={<FaArrowsToEye className="text-xl" />}
            />
          )}
          {onToggleVisibility && (
            <ActionButton
              variant="toggle"
              onClick={onToggleVisibility}
              ariaLabel={visible ? "Hide" : "Show"}
              title={visible ? "Hide" : "Show"}
              className="text-muted hover:text-muted-hover"
              icon={visible ? <FaEye /> : <FaEyeSlash />}
            />
          )}
          {onCenter && (
            <ActionButton
              variant="toggle"
              onClick={onCenter}
              ariaLabel="Center"
              title="Center"
              className="text-info hover:text-info-hover"
              icon={<FaCrosshairs />}
            />
          )}
          {onEdit && (
            <ActionButton
              variant="toggle"
              onClick={onEdit}
              ariaLabel="Edit"
              title="Edit"
              className="text-info hover:text-info-hover"
              icon={<FaPenToSquare />}
            />
          )}
          {onNameChange && (
            <ActionButton
              variant="toggle"
              onClick={handleEdit}
              ariaLabel="Rename"
              title="Rename"
              className="text-info hover:text-info-hover"
              icon={<FaPencil />}
            />
          )}
          {onRemove && (
            <ActionButton
              variant="toggle"
              onClick={() => {
                if (!removeDisabled && onRemove) onRemove();
              }}
              ariaLabel="Remove"
              title={
                removeDisabled
                  ? "This item is managed automatically and cannot be removed"
                  : "Remove"
              }
              className={`text-danger hover:text-danger-hover" ${
                removeDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              icon={removeDisabled ? <FaCircleInfo /> : <FaTrash />}
            />
          )}
        </>
      )}
    </li>
  );
}
