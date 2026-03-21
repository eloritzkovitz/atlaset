import { MenuButton } from "../Menu/MenuButton";
import { Separator } from "../Separator";
import { ICONS } from "../../../constants/icons";

interface MenuActionsProps {
  onView?: () => void;
  onCenter?: () => void;
  onDownload?: (() => void) | null;
  onEdit?: () => void;
  onNameChange?: (() => void) | null;
  onDuplicate?: () => void;
  onCreateList?: () => void;
  onShare?: () => void;
  onCopytoClipboard?: () => void;
  onRemove?: (() => void) | null;
  removeDisabled?: boolean;
  handleEdit: () => void;
}

export function MenuActions({
  onView,
  onCenter,
  onDownload,
  onEdit,
  onNameChange,
  onDuplicate,
  onCreateList,
  onShare,
  onCopytoClipboard,
  onRemove,
  removeDisabled = false,
  handleEdit,
}: MenuActionsProps) {
  return (
    <>
      {onView && (
        <>
          <MenuButton
            onClick={onView}
            icon={<ICONS.view className="mr-2" />}
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
          icon={<ICONS.download className="mr-2" />}
          className="w-full"
        >
          Download
        </MenuButton>
      )}
      {onEdit && (
        <MenuButton
          onClick={onEdit}
          icon={<ICONS.edit className="mr-2" />}
          className="w-full"
        >
          Edit
        </MenuButton>
      )}
      {onNameChange && (
        <MenuButton
          onClick={handleEdit}
          icon={<ICONS.rename className="mr-2" />}
          className="w-full"
        >
          Rename
        </MenuButton>
      )}
      {onCenter && (
        <MenuButton
          onClick={onCenter}
          icon={<ICONS.center className="mr-2" />}
          className="w-full"
        >
          Center
        </MenuButton>
      )}
      {onDuplicate && (
        <MenuButton
          onClick={onDuplicate}
          icon={<ICONS.duplicate className="mr-2" />}
          className="w-full"
        >
          Duplicate
        </MenuButton>
      )}
      {onCreateList && (
        <MenuButton
          onClick={onCreateList}
          icon={<ICONS.createList className="mr-2" />}
          className="w-full"
        >
          Create List
        </MenuButton>
      )}
      {(onShare || onCopytoClipboard) && <Separator className="my-1" />}
      {onShare && (
        <MenuButton
          onClick={onShare}
          icon={<ICONS.share className="mr-2" />}
          className="w-full"
        >
          Share
        </MenuButton>
      )}
      {onCopytoClipboard && (
        <MenuButton
          onClick={onCopytoClipboard}
          icon={<ICONS.copyLink className="mr-2" />}
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
                <ICONS.info className="mr-2" />
              ) : (
                <ICONS.remove className="mr-2" />
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
