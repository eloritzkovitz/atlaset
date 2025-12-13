import React, { useEffect, useRef } from "react";
import { FaMapPin, FaFloppyDisk, FaXmark } from "react-icons/fa6";
import {
  ActionButton,
  FormField,
  Modal,
  ModalActions,
  PanelHeader,
} from "@components";
import type { Marker } from "@types";
import {  } from "react-icons/fa6";

interface MarkerModalProps {
  marker: Marker | null;
  onChange: (marker: Marker) => void;
  onSave: () => void;
  onClose: () => void;
  isOpen: boolean;
  isEditing: boolean;
}

export const MarkerModal: React.FC<MarkerModalProps> = ({
  marker,
  onChange,
  onSave,
  onClose,
  isOpen,
  isEditing,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);

  // Focus the name input when the modal opens
  useEffect(() => {
    if (isOpen && nameRef.current) {
      nameRef.current.focus();
    }
  }, [isOpen]);

  // Don't render if no marker (for edit)
  if (!isOpen || !marker) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      className="modal min-w-[900px] max-w-[1200px] max-h-[90vh]"
    >
      <PanelHeader
        title={
          <>
            <FaMapPin />
            {isEditing ? "Edit Marker" : "Add Marker"}
          </>
        }
      >
        <ActionButton onClick={onClose} ariaLabel="Close" title="Close" icon={<FaXmark className="text-2xl" />} />
        
        
      </PanelHeader>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <FormField label="Name">
          <input
            ref={nameRef}
            name="name"
            placeholder="Marker name"
            required
            value={marker?.name || ""}
            onChange={(e) =>
              onChange({
                ...marker!,
                name: e.target.value,
                // For add: ensure coords are set
                longitude: marker?.longitude ?? 0,
                latitude: marker?.latitude ?? 0,
              })
            }
            autoFocus
          />
        </FormField>
        <FormField label="Color">
          <input
            name="color"
            type="color"
            className="w-8 h-8 p-0 border rounded mt-1"
            value={marker?.color || "#e53e3e"}
            onChange={(e) =>
              onChange({
                ...marker!,
                color: e.target.value,
                longitude: marker?.longitude ?? 0,
                latitude: marker?.latitude ?? 0,
              })
            }
          />
        </FormField>
        <FormField label="Description">
          <input
            name="description"
            placeholder="Description (optional)"
            value={marker?.description || ""}
            onChange={(e) =>
              onChange({
                ...marker!,
                description: e.target.value,
                longitude: marker?.longitude ?? 0,
                latitude: marker?.latitude ?? 0,
              })
            }
          />
        </FormField>
        {marker && !isEditing && (
          <div className="text-xs text-gray-500">
            Location: {marker.longitude.toFixed(4)},{" "}
            {marker.latitude.toFixed(4)}
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <ModalActions
            onCancel={onClose}
            onSubmit={onSave}
            submitType="submit"
            submitIcon={
              isEditing ? (
                <FaFloppyDisk className="inline" />
              ) : (
                <FaMapPin className="inline" />
              )
            }
            submitLabel={isEditing ? "Save Changes" : "Add Marker"}
          />
        </div>
      </form>
    </Modal>
  );
};
