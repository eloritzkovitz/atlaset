import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  ColorSelectInput,
  FormField,
  Modal,
  ModalActions,
  PanelHeader,
} from "@components";
import { ICONS } from "@constants/icons";
import type { Marker } from "../../types";

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
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const { t } = useTranslation(["atlas", "common"]);

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
      disableClose={colorModalOpen}
      draggable
    >
      <PanelHeader
        title={
          <>
            <ICONS.markers />
            {isEditing
              ? t("markers.editTitle", "Edit Marker")
              : t("markers.addTitle", "Add Marker")}
          </>
        }
      >
        <ActionButton
          onClick={onClose}
          ariaLabel="Close"
          icon={<ICONS.close className="text-2xl" />}
          rounded
          title={t("common:actions.close")}
        />
      </PanelHeader>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <div className="p-2">
          <FormField label={t("markers.form.name", "Name")}>
            <input
              ref={nameRef}
              name="name"
              placeholder={t("markers.form.namePlaceholder", "Marker name")}
              required
              value={marker?.name || ""}
              onChange={(e) =>
                onChange({
                  ...marker!,
                  name: e.target.value,
                  coordinates: marker?.coordinates || [0, 0],
                })
              }
              autoFocus
            />
          </FormField>
          <FormField label="Color">
            <ColorSelectInput
              value={marker.color || "#e53e3e"}
              onChange={(color) =>
                onChange({
                  ...marker,
                  color,
                  coordinates: marker?.coordinates || [0, 0],
                })
              }
              onModalOpenChange={setColorModalOpen}
              disabled={false}
            />
          </FormField>
          <FormField label="Description">
            <input
              name="description"
              placeholder={t(
                "markers.form.descriptionPlaceholder",
                "Description (optional)",
              )}
              value={marker?.description || ""}
              onChange={(e) =>
                onChange({
                  ...marker!,
                  description: e.target.value,
                  coordinates: marker?.coordinates || [0, 0],
                })
              }
            />
          </FormField>
          {marker && !isEditing && (
            <div className="text-xs text-muted">
              {t("markers.locationLabel", "Location:")}{" "}
              {marker.coordinates[0].toFixed(4)},{" "}
              {marker.coordinates[1].toFixed(4)}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-4">
            <ModalActions
              onCancel={onClose}
              onSubmit={onSave}
              submitType="submit"
              submitIcon={
                isEditing ? (
                  <ICONS.save className="inline" />
                ) : (
                  <ICONS.add className="inline" />
                )
              }
              submitLabel={
                isEditing
                  ? t("markers.saveChanges", "Save Changes")
                  : t("markers.add", "Add Marker")
              }
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
