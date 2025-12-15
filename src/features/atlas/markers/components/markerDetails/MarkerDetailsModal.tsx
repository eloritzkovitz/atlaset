import { FaLocationDot, FaXmark } from "react-icons/fa6";
import { ActionButton, Modal, PanelHeader } from "@components";
import type { Marker } from "@types";

interface MarkerDetailsModalProps {
  isOpen: boolean;
  marker: Marker | null;
  position: { top: number; left: number } | null;  
  onClose: () => void;
}

export function MarkerDetailsModal({
  isOpen,
  marker,
  position,  
  onClose,
}: MarkerDetailsModalProps) {
  // Don't render the modal if no marker is selected
  if (!marker) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position={position ? "custom" : "center"}
      className="min-w-[400px] max-w-[600px] rounded-xl shadow-2xl p-8 overflow-y-auto"
      style={
        position
          ? {
              position: "fixed",
              top: position.top,
              left: position.left,
              transform: "translate(-50%, -100%)",
              zIndex: 1000,
            }
          : undefined
      }
    >
      <div className="relative overflow-visible">
        <PanelHeader
          title={
            <span className="flex items-center gap-2">
              <FaLocationDot />
              {marker.name}
            </span>
          }
        >
          <ActionButton
            onClick={onClose}
            ariaLabel="Close country details"
            title="Close"
            rounded
            icon={<FaXmark />}
          />
        </PanelHeader>
      </div>
      <div className="mb-4 text-muted">
        {marker.description || "No description provided."}
      </div>
    </Modal>
  );
}
