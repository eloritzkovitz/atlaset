import {
  FaCircleInfo,
  FaCrosshairs,
  FaDownload,
  FaLink,
  FaPencil,
  FaPenToSquare,
  FaTrash,
} from "react-icons/fa6";
import { MenuButton } from "../Menu/MenuButton";
import { Separator } from "../Separator";

interface PanelListItemMenuActionsProps {
  onCenter?: () => void;
  onDownload?: (() => void) | null;
  onEdit?: () => void;
  onNameChange?: (() => void) | null;
  onCopytoClipboard?: () => void;
  onRemove?: (() => void) | null;
  removeDisabled?: boolean;
  handleEdit: () => void;
}

export function PanelListItemMenuActions({
  onCenter,
  onDownload,
  onEdit,
  onNameChange,
  onCopytoClipboard,
  onRemove,
  removeDisabled = false,
  handleEdit,
}: PanelListItemMenuActionsProps) {
  return (
    <>
      {onDownload && (
        <MenuButton
          onClick={onDownload}
          icon={<FaDownload className="mr-2" />}
          className="w-full"
        >
          Download
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
      {onNameChange && (
        <MenuButton
          onClick={handleEdit}
          icon={<FaPencil className="mr-2" />}
          className="w-full"
        >
          Rename
        </MenuButton>
      )}
      {onCenter && (
        <MenuButton
          onClick={onCenter}
          icon={<FaCrosshairs className="mr-2" />}
          className="w-full"
        >
          Center
        </MenuButton>
      )}
      {onCopytoClipboard && (
        <MenuButton
          onClick={onCopytoClipboard}
          icon={<FaLink className="mr-2" />}
          className="w-full"
        >
          Copy Link
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
            className={`w-full !text-danger ${removeDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={removeDisabled}
          >
            {removeDisabled ? "Cannot delete" : "Delete"}
          </MenuButton>
        </>
      )}
    </>
  );
}
