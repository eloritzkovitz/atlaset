import {
  FaCircleInfo,
  FaCopy,
  FaCrosshairs,
  FaDownload,
  FaLink,
  FaPencil,
  FaPenToSquare,
  FaRegEye,
  FaTrash,
  FaUserPlus,
} from "react-icons/fa6";
import { MenuButton } from "../Menu/MenuButton";
import { Separator } from "../Separator";

interface PanelListItemMenuActionsProps {
  onView?: () => void;
  onCenter?: () => void;
  onDownload?: (() => void) | null;
  onEdit?: () => void;
  onNameChange?: (() => void) | null;
  onDuplicate?: () => void;
  onShare?: () => void;
  onCopytoClipboard?: () => void;
  onRemove?: (() => void) | null;
  removeDisabled?: boolean;
  handleEdit: () => void;
}

export function PanelListItemMenuActions({
  onView,
  onCenter,
  onDownload,
  onEdit,
  onNameChange,
  onDuplicate,
  onShare,
  onCopytoClipboard,
  onRemove,
  removeDisabled = false,
  handleEdit,
}: PanelListItemMenuActionsProps) {
  return (
    <>
      {onView && (
        <>
          <MenuButton
            onClick={onView}
            icon={<FaRegEye className="mr-2" />}
            className="w-full"
          >
            View
          </MenuButton>
          <Separator className="my-1" />
        </>
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
      {onDuplicate && (
        <MenuButton
          onClick={onDuplicate}
          icon={<FaCopy className="mr-2" />}
          className="w-full"
        >
          Duplicate
        </MenuButton>
      )}
      {(onShare || onCopytoClipboard) && <Separator className="my-1" />}
      {onShare && (
        <MenuButton
          onClick={onShare}
          icon={<FaUserPlus className="mr-2" />}
          className="w-full"
        >
          Share
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
          <Separator className="my-1" />
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
