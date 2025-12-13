import { useState } from "react";
import {
  FaLayerGroup,
  FaPencil,
  FaXmark,
  FaFloppyDisk,
  FaCircleInfo,
} from "react-icons/fa6";
import {
  ActionButton,
  Chip,
  FormButton,
  FormField,
  Modal,
  ModalActions,
  PanelHeader,
} from "@components";
import { VISITED_OVERLAY_ID } from "@constants/overlays";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountrySelectModal } from "@features/countries";
import type { Overlay } from "@types";
import { ColorPickerModal } from "./ColorPickerModal";

interface OverlayModalProps {
  isOpen: boolean;
  isEditing: boolean;
  overlay: Overlay | null;
  onChange: (overlay: Overlay) => void;
  onSave: () => void;
  onClose: () => void;
}

export function OverlayModal({
  isOpen,
  isEditing,
  overlay,
  onChange,
  onSave,
  onClose,
}: OverlayModalProps) {
  const { countries } = useCountryData();
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);

  // Check if editing visited countries overlay
  const isVisited = overlay?.id === VISITED_OVERLAY_ID;

  // State for country select modal
  const selectedCountries = countries.filter(
    (country) => overlay && overlay.countries.includes(country.isoCode)
  );

  // Handle modal close
  const handleClose = () => {
    // Only allow closing if no submodal is open
    if (!colorModalOpen && !countryModalOpen) {
      onClose();
    }
  };

  // Don't render the modal if no overlay is being edited
  if (!overlay) return null;

  // Validate overlay
  const isValid =
    overlay.name.trim() !== "" &&
    overlay.countries &&
    overlay.countries.length > 0;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        disableClose={countryModalOpen || colorModalOpen}
        className="rounded-xl shadow-2xl p-8 min-w-[500px] max-w-[800px] max-h-[90vh] overflow-y-auto"
      >
        <PanelHeader
          title={
            <>
              <FaLayerGroup />
              {isEditing ? "Edit Overlay" : "Add Overlay"}
            </>
          }
        >
          <ActionButton
            onClick={onClose}
            ariaLabel="Close Overlay Modal"
            title="Close"
            icon={<FaXmark className="text-2xl" />}
            rounded
          />
        </PanelHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          {/* Name */}
          <FormField label="Name:">
            <input
              type="text"
              name="name"
              value={overlay.name}
              onChange={(e) => onChange({ ...overlay, name: e.target.value })}
              disabled={isVisited}
              className={`${isVisited ? "opacity-50" : ""}`}
            />
          </FormField>

          {/* Color */}
          <FormField label="Color:">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border"
                style={{ background: overlay.color }}
                title={overlay.color}
              />
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => setColorModalOpen(true)}
                disabled={isVisited}
              >
                <FaPencil className="inline" /> Edit
              </FormButton>
            </div>
          </FormField>

          {/* Countries */}
          <FormField label="Countries:">
            <div className="flex items-center gap-2 flex-wrap">
              {selectedCountries.length === 0 ? (
                <span className="text-gray-400">No countries selected</span>
              ) : (
                selectedCountries.map((country) => (
                  <Chip
                    key={country.isoCode}
                    removable={true}
                    onRemove={() =>
                      onChange({
                        ...overlay,
                        countries: overlay.countries.filter(
                          (code) => code !== country.isoCode
                        ),
                      })
                    }
                    disabled={isVisited}
                  >
                    {country.name}
                  </Chip>
                ))
              )}
              <FormButton
                type="button"
                variant="secondary"
                onClick={() => setCountryModalOpen(true)}
                disabled={isVisited}
              >
                <FaPencil className="inline" /> Edit
              </FormButton>
            </div>
          </FormField>

          {/* Tooltip */}
          <FormField label="Tooltip:">
            <input
              type="text"
              value={overlay.tooltip || ""}
              onChange={(e) =>
                onChange({ ...overlay, tooltip: e.target.value })
              }
              disabled={isVisited}
              className={`${isVisited ? "opacity-50" : ""}`}
            />
          </FormField>
          <div className="flex items-center justify-between mt-6">
            {isVisited && (
              <div className="flex items-center text-base text-gray-400 mr-4">
                <FaCircleInfo size={24} className="mr-4" />
                <span>
                  This overlay is managed automatically based on your trips.
                </span>
              </div>
            )}
            <ModalActions
              onCancel={onClose}
              onSubmit={onSave}
              submitType="submit"
              submitIcon={
                isEditing ? (
                  <FaFloppyDisk className="inline" />
                ) : (
                  <FaLayerGroup className="inline" />
                )
              }
              submitLabel={isEditing ? "Save Changes" : "Add Overlay"}
              disabled={!isValid || isVisited}
            />
          </div>
        </form>
      </Modal>
      {/* Color Picker Modal */}
      <ColorPickerModal
        isOpen={colorModalOpen}
        color={overlay.color}
        onChange={(newColor) => onChange({ ...overlay, color: newColor })}
        onClose={() => setColorModalOpen(false)}
      />
      {/* Country Select Modal */}
      <CountrySelectModal
        isOpen={countryModalOpen}
        selected={overlay.countries}
        options={countries}
        onClose={() => setCountryModalOpen(false)}
        onChange={(newCountries) => {
          onChange({ ...overlay, countries: newCountries });
          setCountryModalOpen(false);
        }}
        disabled={isVisited}
      />
    </>
  );
}
