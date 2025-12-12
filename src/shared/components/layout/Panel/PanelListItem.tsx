import {
  FaEye,
  FaEyeSlash,
  FaPenToSquare,
  FaTrash,
  FaCrosshairs,
  FaCircleInfo,
} from "react-icons/fa6";
import type { DragEvent } from "react";
import { ActionButton, ColorDot } from "@components";

interface PanelListItemProps {
  color: string;
  name: string;
  visible: boolean;
  onToggleVisibility?: () => void;
  onCenter?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  removeDisabled?: boolean;
  dragged?: boolean;
  onDragStart?: () => void;
  handleDragOver?: (e: DragEvent<HTMLLIElement>) => void;
  handleDragEnd?: () => void;
}

export function PanelListItem({
  color,
  name,
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
}: PanelListItemProps) {
  return (
    <li
      id="panel-list-item"
      className={`mb-4 flex items-center gap-2 bg-surface-alt rounded-lg px-3 py-2 ${
        dragged ? "ring-dashed" : ""
      }`}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      style={{ cursor: dragged ? "grabbing" : "grab" }}
    >
      <ColorDot color={color} size={22} />
      <strong className="flex-1">{name}</strong>
      {onToggleVisibility && (
        <ActionButton
          onClick={onToggleVisibility}
          ariaLabel={visible ? "Hide" : "Show"}
          title={visible ? "Hide" : "Show"}
          className="mx-1 text-lg text-muted hover:text-muted-hover"
          icon={visible ? <FaEye /> : <FaEyeSlash />}
        />
      )}
      {onCenter && (
        <ActionButton
          onClick={onCenter}
          ariaLabel="Center"
          title="Center"
          className="mx-1 text-lg text-info hover:text-info-hover"
          icon={<FaCrosshairs />}
        />
      )}
      {onEdit && (
        <ActionButton
          onClick={onEdit}
          ariaLabel="Edit"
          title="Edit"
          className="mx-1 text-lg text-info hover:text-info-hover"
          icon={<FaPenToSquare />}
        />
      )}
      {onRemove && (
        <ActionButton
          onClick={onRemove}
          ariaLabel="Remove"
          title={
            removeDisabled
              ? "This item is managed automatically and cannot be removed"
              : "Remove"
          }
          className={`mx-1 text-lg text-danger hover:text-danger-hover ${
            removeDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          icon={removeDisabled ? <FaCircleInfo /> : <FaTrash />}
          disabled={removeDisabled}
        />
      )}
    </li>
  );
}
