import type { DragEvent } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaPenToSquare,
  FaTrash,
  FaCrosshairs,
  FaCircleInfo,
} from "react-icons/fa6";
import { ActionButton } from "../../action/ActionButton";
import { ColorDot } from "../../ui/ColorDot";

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
      className={`mb-4 flex items-center bg-surface-alt rounded-lg px-3 py-2 ${
        dragged ? "ring-dashed" : ""
      }`}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      style={{ cursor: dragged ? "grabbing" : "grab" }}
    >
      <ColorDot color={color} size={22} />
      <strong className="flex-1 ml-2">{name}</strong>
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
    </li>
  );
}
