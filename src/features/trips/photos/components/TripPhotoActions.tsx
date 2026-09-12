import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowDown, FaArrowUp, FaSpinner } from "react-icons/fa6";
import { ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import { useClickOutside, useKeyHandler } from "@hooks";

interface TripPhotoActionsProps {
  index: number;
  photoCount: number;
  isRemoving: boolean;
  removeDisabled: boolean;
  onMove: (offset: number) => void;
  onRemove: () => void;
}

const actionButtonClass =
  "flex h-8 w-8 items-center justify-center rounded-md bg-black/65 text-white";

export function TripPhotoActions({
  index,
  photoCount,
  isRemoving,
  removeDisabled,
  onMove,
  onRemove,
}: TripPhotoActionsProps) {
  const { t } = useTranslation("trips");

  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useKeyHandler(() => setConfirmingDelete(false), ["Escape"], {
    enabled: confirmingDelete,
  });

  useClickOutside(
    [actionsRef],
    () => setConfirmingDelete(false),
    confirmingDelete,
    { click: true, escape: false },
  );

  const moveActions = [
    {
      offset: -1,
      label: t("editor.photos.actions.moveUp", "Move photo up"),
      icon: <FaArrowUp aria-hidden="true" />,
      disabled: index === 0,
    },
    {
      offset: 1,
      label: t("editor.photos.actions.moveDown", "Move photo down"),
      icon: <FaArrowDown aria-hidden="true" />,
      disabled: index === photoCount - 1,
    },
  ];

  return (
    <div
      ref={actionsRef}
      className="absolute inset-x-2 top-2 flex justify-between gap-1"
    >
      <div className="flex gap-1">
        {moveActions.map((action) => (
          <ActionButton
            key={action.offset}
            ariaLabel={action.label}
            title={action.label}
            disabled={action.disabled}
            variant="custom"
            rounded
            icon={action.icon}
            className={`${actionButtonClass} hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-40`}
            onClick={() => {
              setConfirmingDelete(false);
              onMove(action.offset);
            }}
          />
        ))}
      </div>
      <ActionButton
        ariaLabel={
          confirmingDelete
            ? t("editor.photos.actions.confirmDelete")
            : t("editor.photos.actions.delete", "Delete photo")
        }
        title={
          confirmingDelete
            ? t("editor.photos.actions.confirmDelete")
            : t("editor.photos.actions.delete", "Delete photo")
        }
        disabled={removeDisabled}
        variant="custom"
        rounded
        icon={
          isRemoving ? (
            <FaSpinner className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : confirmingDelete ? (
            <ICONS.selected className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ICONS.remove className="h-4 w-4" aria-hidden="true" />
          )
        }
        className={`${actionButtonClass} ${
          confirmingDelete
            ? "bg-danger hover:bg-danger-hover"
            : "hover:bg-danger"
        } disabled:cursor-not-allowed disabled:opacity-50`}
        onClick={() => {
          if (confirmingDelete) {
            setConfirmingDelete(false);
            onRemove();
            return;
          }

          setConfirmingDelete(true);
        }}
      />
    </div>
  );
}
