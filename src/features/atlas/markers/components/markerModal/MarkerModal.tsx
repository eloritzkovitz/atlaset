import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ColorSelectInput,
  FormField,
  Modal,
  ModalActions,
  ModalHeader,
} from "@components";
import { ICONS } from "@constants/icons";
import {
  CountrySelectField,
  getCountryName,
  useCountryData,
} from "@features/countries";
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
  const { countries } = useCountryData();
  const { t } = useTranslation(["atlas", "common"]);

  const nameRef = useRef<HTMLInputElement>(null);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);

  // Focus the name input when the modal opens
  useEffect(() => {
    if (isOpen && nameRef.current) {
      nameRef.current.focus();
    }
  }, [isOpen]);

  // Don't render if no marker
  if (!isOpen || !marker) return null;

  const currentCountryCodes = marker.isoCode ? [marker.isoCode] : [];

  // Handle country change
  const handleCountryChange = (codes: string[]) => {
    const selectedCode = codes[codes.length - 1] || "";

    const previousName = getCountryName(marker.isoCode, countries);
    const shouldUpdateName =
      !marker.name || marker.name.trim() === "" || marker.name === previousName;

    onChange({
      ...marker,
      isoCode: selectedCode,
      name: shouldUpdateName
        ? getCountryName(selectedCode, countries)
        : marker.name,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      className="modal w-[600px] max-h-[90vh]"
      disableClose={colorModalOpen || countrySelectOpen}
      draggable
    >
      <ModalHeader
        title={
          <>
            <ICONS.markers />
            {isEditing
              ? t("markers.editTitle", "Edit Marker")
              : t("markers.addTitle", "Add Marker")}
          </>
        }
      />
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <div className="p-2 space-y-4">
          <FormField label={t("markers.form.name", "Name")}>
            <input
              ref={nameRef}
              id="marker-name"
              type="text"
              name="name"
              placeholder={t("markers.form.namePlaceholder", "Marker name")}
              required
              value={marker?.name || ""}
              onChange={(e) =>
                onChange({
                  ...marker,
                  name: e.target.value,
                })
              }
              autoFocus
            />
          </FormField>

          <CountrySelectField
            label={t("markers.form.country", "Country")}
            countryCodes={currentCountryCodes}
            countries={countries}
            onChange={handleCountryChange}
            isOpen={countrySelectOpen}
            onOpen={() => setCountrySelectOpen(true)}
            onClose={() => setCountrySelectOpen(false)}
          />

          <FormField label={t("markers.form.color", "Color")}>
            <ColorSelectInput
              value={marker.color}
              onChange={(color: string) => onChange({ ...marker, color })}
              onModalOpenChange={setColorModalOpen}
              disabled={false}
            />
          </FormField>

          <FormField label="Notes">
            <input
              id="marker-notes"
              name="notes"
              placeholder={t(
                "markers.form.notesPlaceholder",
                "Notes (optional)",
              )}
              value={marker?.notes || ""}
              onChange={(e) =>
                onChange({
                  ...marker,
                  notes: e.target.value,
                })
              }
            />
          </FormField>

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
