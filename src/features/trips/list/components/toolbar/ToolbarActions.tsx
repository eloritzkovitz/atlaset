import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionButton, ConfirmModal } from "@components";
import { ICONS } from "@constants/icons";
import { useTrips } from "../../../core/context/TripsContext";

interface ToolbarActionsProps {
  onAddTrip?: () => void;
}

export function ToolbarActions({ onAddTrip }: ToolbarActionsProps) {
  const { selectedTripIds, handleBulkDuplicate, handleBulkDelete } = useTrips();
  const { t } = useTranslation("trips");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasSelection = selectedTripIds.length > 0;

  return (
    <>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex shrink-0 items-center">
          <ActionButton
            onClick={() => handleBulkDuplicate(selectedTripIds)}
            ariaLabel={t("table.toolbar.bulkActions.duplicateSelected")}
            title={t("table.toolbar.bulkActions.duplicateSelected")}
            icon={<ICONS.duplicate />}
            active={hasSelection}
            disabled={!hasSelection}
            variant="toggle"
          />

          <ActionButton
            onClick={() => setShowDeleteConfirm(true)}
            ariaLabel={t("table.toolbar.bulkActions.deleteSelected")}
            title={t("table.toolbar.bulkActions.deleteSelected")}
            icon={<ICONS.remove />}
            active={hasSelection}
            disabled={!hasSelection}
            variant="toggle"
          />
        </div>

        <ActionButton
          variant="primary"
          onClick={onAddTrip}
          className="shrink-0 ms-4"
        >
          <ICONS.add className="text-xl" />
          {t("table.toolbar.bulkActions.addTrip")}
        </ActionButton>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title={t("table.toolbar.bulkActions.deleteConfirmTitle")}
          message={t("table.toolbar.bulkActions.deleteConfirmMessage", {
            count: selectedTripIds.length,
          })}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            handleBulkDelete(selectedTripIds);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          submitLabel={t("table.toolbar.bulkActions.delete")}
          cancelLabel={t("table.toolbar.bulkActions.cancel")}
          submitIcon={<ICONS.remove className="inline" />}
        />
      )}
    </>
  );
}
