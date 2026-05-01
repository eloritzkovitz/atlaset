import { useTranslation } from "react-i18next";
import { MenuButton } from "./MenuButton";
import { Separator } from "../layout/Separator";
import { ICONS } from "../../constants/icons";

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
  const { t } = useTranslation("common");

  return (
    <>
      {onView && (
        <>
          <MenuButton
            onClick={onView}
            icon={<ICONS.view className="me-2" />}
            className="w-full"
          >
            {t("actions.view", "View")}
          </MenuButton>
          <Separator className="my-1" />
        </>
      )}
      {onDownload && (
        <MenuButton
          onClick={onDownload}
          icon={<ICONS.download className="me-2" />}
          className="w-full"
        >
          {t("actions.download", "Download")}
        </MenuButton>
      )}
      {onEdit && (
        <MenuButton
          onClick={onEdit}
          icon={<ICONS.edit className="me-2" />}
          className="w-full"
        >
          {t("actions.edit", "Edit")}
        </MenuButton>
      )}
      {onNameChange && (
        <MenuButton
          onClick={handleEdit}
          icon={<ICONS.rename className="me-2" />}
          className="w-full"
        >
          {t("actions.rename", "Rename")}
        </MenuButton>
      )}
      {onCenter && (
        <MenuButton
          onClick={onCenter}
          icon={<ICONS.center className="me-2" />}
          className="w-full"
        >
          {t("actions.center", "Center")}
        </MenuButton>
      )}
      {onDuplicate && (
        <MenuButton
          onClick={onDuplicate}
          icon={<ICONS.duplicate className="me-2" />}
          className="w-full"
        >
          {t("actions.duplicate", "Duplicate")}
        </MenuButton>
      )}
      {onCreateList && (
        <MenuButton
          onClick={onCreateList}
          icon={<ICONS.createList className="me-2" />}
          className="w-full"
        >
          {t("actions.createList", "Create List")}
        </MenuButton>
      )}
      {(onShare || onCopytoClipboard) && <Separator className="my-1" />}
      {onShare && (
        <MenuButton
          onClick={onShare}
          icon={<ICONS.share className="me-2" />}
          className="w-full"
        >
          {t("actions.share", "Share")}
        </MenuButton>
      )}
      {onCopytoClipboard && (
        <MenuButton
          onClick={onCopytoClipboard}
          icon={<ICONS.copyLink className="me-2" />}
          className="w-full"
        >
          {t("actions.copyLink", "Copy Link")}
        </MenuButton>
      )}
      {onRemove && (
        <>
          <Separator className="my-1" />
          <MenuButton
            onClick={onRemove}
            icon={
              removeDisabled ? (
                <ICONS.info className="me-2" />
              ) : (
                <ICONS.remove className="me-2" />
              )
            }
            className={`w-full !text-danger ${removeDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={removeDisabled}
          >
            {removeDisabled
              ? t("actions.cannotDelete", "Cannot delete")
              : t("actions.delete", "Delete")}
          </MenuButton>
        </>
      )}
    </>
  );
}
