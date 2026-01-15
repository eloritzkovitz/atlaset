import React from "react";
import { FaCopy, FaPlus, FaTrash } from "react-icons/fa6";
import { ActionButton, ConfirmModal } from "@components";

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
      <div className="flex items-center gap-2">
        <ActionButton
          onClick={onBulkDuplicate}
          ariaLabel="Duplicate selected"
          title="Duplicate selected"
          icon={<FaCopy />}
          active={hasSelection}
          disabled={!hasSelection}
          variant="toggle"
        />
        <ActionButton
          onClick={() => setShowDeleteConfirm(true)}
          ariaLabel="Delete selected"
          title="Delete selected"
          icon={<FaTrash />}
          active={hasSelection}
          disabled={!hasSelection}
          variant="toggle"
        />
        <div className="relative left-200">
          <ActionButton
            variant="primary"
            onClick={onAddTrip}
            icon={<FaPlus className="text-xl mr-2" />}
            className="ml-4"
          >
            Add Trip
          </ActionButton>
        </div>
      </div>

      {/* Confirm Modals */}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Delete Trips"
          message={`Delete ${selectedTripIds.length} selected trips?`}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onBulkDelete();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
          submitLabel="Delete"
          cancelLabel="Cancel"
          submitIcon={<FaTrash className="inline" />}
        />
      )}
    </div>
  );
}
