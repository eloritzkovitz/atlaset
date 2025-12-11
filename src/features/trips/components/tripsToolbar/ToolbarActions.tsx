import React from "react";
import { FaCopy, FaTrash } from "react-icons/fa6";
import { ActionButton, ConfirmModal } from "@components";

interface ToolbarActionsProps {
  selectedTripIds: string[];
  onBulkDuplicate: () => void;
  onBulkDelete: () => void;
  onBulkArchive?: () => void;
  onBulkFavorite?: () => void;
}

export function ToolbarActions({
  selectedTripIds,
  onBulkDuplicate,
  onBulkDelete,
}: ToolbarActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Check if there are selected trips
  const hasSelection = selectedTripIds.length > 0;

  return (
    <>
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
    </>
  );
}
