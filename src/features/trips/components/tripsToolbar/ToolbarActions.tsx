import React from "react";
import { ActionButton, ConfirmModal } from "@components";
import { ICONS } from "@constants/icons";

interface ToolbarActionsProps {
  selectedTripIds: string[];
  onAddTrip?: () => void;
  onBulkDuplicate: () => void;
  onBulkDelete: () => void;
  onBulkArchive?: () => void;
  onBulkFavorite?: () => void;
}

export function ToolbarActions({
  selectedTripIds,
  onAddTrip,
  onBulkDuplicate,
  onBulkDelete,
}: ToolbarActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Check if there are selected trips
  const hasSelection = selectedTripIds.length > 0;

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2 w-full justify-between">
        <div className="flex items-center gap-2">
          <ActionButton
            onClick={onBulkDuplicate}
            ariaLabel="Duplicate selected"
            title="Duplicate selected"
            icon={<ICONS.duplicate />}
            active={hasSelection}
            disabled={!hasSelection}
            variant="toggle"
          />
          <ActionButton
            onClick={() => setShowDeleteConfirm(true)}
            ariaLabel="Delete selected"
            title="Delete selected"
            icon={<ICONS.remove />}
            active={hasSelection}
            disabled={!hasSelection}
            variant="toggle"
          />
        </div>
        <ActionButton
          variant="primary"
          onClick={onAddTrip}
          icon={<ICONS.add className="text-xl me-2" />}
          className="ms-4"
        >
          Add Trip
        </ActionButton>
      </div>

      {/* Confirm Modals */}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete trips?"
          message={`Delete ${selectedTripIds.length} selected trips?`}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onBulkDelete();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          submitLabel="Delete"
          cancelLabel="Cancel"
          submitIcon={<ICONS.remove className="inline" />}
        />
      )}
    </div>
  );
}
