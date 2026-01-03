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
  ColorSelectInput,
  FormField,
  Modal,
  ModalActions,
  PanelHeader,
} from "@components";
import { CountrySelectModal, useCountryData } from "@features/countries";
import { VISITED_OVERLAY_ID } from "../constants/overlays";
import type { Overlay } from "../types";

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
        className="rounded-xl shadow-2xl !min-w-[900px] max-h-[90vh] overflow-y-auto"
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
          <div className="p-2">
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
              <ColorSelectInput
                value={overlay.color}
                onChange={(color: string) => onChange({ ...overlay, color })}
                disabled={isVisited}
                onModalOpenChange={setColorModalOpen}
              />
            </FormField>

            {/* Countries */}
            <FormField label="Countries:">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCountries.length === 0 ? (
                  <span className="text-muted">No countries selected</span>
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
                <ActionButton
                  type="button"
                  variant="secondary"
                  onClick={() => setCountryModalOpen(true)}
                  disabled={isVisited}
                >
                  <FaPencil className="inline" /> Edit
                </ActionButton>
              </div>
            </FormField>

            {/* Filter Labels */}
            <FormField label="Filter Labels:">
              <input
                type="text"
                value={overlay.filterLabels?.all || ""}
                onChange={(e) =>
                  onChange({
                    ...overlay,
                    filterLabels: {
                      ...overlay.filterLabels,
                      all: e.target.value,
                    },
                  })
                }
                disabled={isVisited}
                className={`${isVisited ? "opacity-50" : ""}`}
              />
            </FormField>
            <FormField label="">
              <input
                type="text"
                value={overlay.filterLabels?.only || ""}
                onChange={(e) =>
                  onChange({
                    ...overlay,
                    filterLabels: {
                      ...overlay.filterLabels,
                      only: e.target.value,
                    },
                  })
                }
                disabled={isVisited}
                className={`${isVisited ? "opacity-50" : ""}`}
              />
            </FormField>
            <FormField label="">
              <input
                type="text"
                value={overlay.filterLabels?.exclude || ""}
                onChange={(e) =>
                  onChange({
                    ...overlay,
                    filterLabels: {
                      ...overlay.filterLabels,
                      exclude: e.target.value,
                    },
                  })
                }
                disabled={isVisited}
                className={`${isVisited ? "opacity-50" : ""}`}
              />
            </FormField>
            <div className="flex items-center justify-between mt-6">
              {isVisited && (
                <div className="flex items-center text-base text-muted mr-4">
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
          </div>
        </form>
      </Modal>
      {/* Country Select Modal */}
      <CountrySelectModal
        isOpen={countryModalOpen}
        selected={overlay.countries}
        options={countries}
        onClose={() => setCountryModalOpen(false)}
        onChange={(newCountries) => {
          onChange({ ...overlay, countries: newCountries });
        }}
        disabled={isVisited}
      />
    </>
  );
}
