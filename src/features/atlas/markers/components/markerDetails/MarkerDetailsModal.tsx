import { useTranslation } from "react-i18next";
import { Modal, ModalHeader } from "@components";
import { ICONS } from "@constants/icons";
import type { Marker } from "../../types";

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
      <MarkerDetailsContent
        marker={marker}
        onClose={onClose}
        position={position}
      />
    </Modal>
  );
}

function MarkerDetailsContent({
  marker,
  onClose,
}: {
  marker: Marker;
  onClose: () => void;
  position?: { top: number; left: number } | null;
}) {
  const { t } = useTranslation("atlas");

  return (
    <div className="relative overflow-visible">
      <ModalHeader
        onClose={onClose}
        title={
          <span className="flex items-center gap-2">
            <ICONS.markers />
            {marker.name}
          </span>
        }
      />
      <div className="mb-4 text-muted">
        {marker.description ||
          t("markers.noDescription", "No description provided.")}
      </div>
    </div>
  );
}
