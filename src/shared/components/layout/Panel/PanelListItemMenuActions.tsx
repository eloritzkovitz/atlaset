import {
  FaPenToSquare,
  FaTrash,
  FaCrosshairs,
  FaCircleInfo,
  FaPencil,
  FaDownload,
} from "react-icons/fa6";
import { MenuButton, Separator } from "@components";

interface PanelListItemMenuActionsProps {
  onCenter?: () => void;
  onDownload?: (() => void) | null;
  onEdit?: () => void;
  onNameChange?: (() => void) | null;
  onRemove?: (() => void) | null;
  removeDisabled?: boolean;
  handleEdit: () => void;
}

export function PanelListItemMenuActions({
  onCenter,
  onDownload,
  onEdit,
  onNameChange,
  onRemove,
  removeDisabled = false,
  handleEdit,
}: PanelListItemMenuActionsProps) {
  return (
    <>
      {onCenter && (
        <MenuButton
          onClick={onCenter}
          icon={<FaCrosshairs className="mr-2" />}
          className="w-full"
        >
          Center
        </MenuButton>
      )}
      {onEdit && (
        <MenuButton
          onClick={onEdit}
          icon={<FaPenToSquare className="mr-2" />}
          className="w-full"
        >
          Edit
        </MenuButton>
      )}
      {onDownload && (
        <MenuButton
          onClick={onDownload}
          icon={<FaDownload className="mr-2" />}
          className="w-full"
        >
          Download
        </MenuButton>
      )}
      {onNameChange && (
        <MenuButton
          onClick={handleEdit}
          icon={<FaPencil className="mr-2" />}
          className="w-full"
        >
          Rename
        </MenuButton>
      )}
      {onRemove && (
        <>
          <Separator />
          <MenuButton
            onClick={onRemove}
            icon={
              removeDisabled ? (
                <FaCircleInfo className="mr-2" />
              ) : (
                <FaTrash className="mr-2" />
              )
            }
            className={`w-full text-danger ${removeDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={removeDisabled}
          >
            {removeDisabled ? "Cannot remove" : "Remove"}
          </MenuButton>
        </>
      )}
    </>
  );
}
