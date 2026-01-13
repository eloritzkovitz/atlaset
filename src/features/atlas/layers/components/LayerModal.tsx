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
import { CountrySelectModal } from "@features/countries/components/countrySelect/CountrySelectModal";
import { useCountryData } from "@features/countries";
import { VISITED_LAYER_ID } from "../constants/layers";
import type { Layer } from "../types";

interface LayerModalProps {
  isOpen: boolean;
  isEditing: boolean;
  layer: Layer | null;
  onChange: (layer: Layer) => void;
  onSave: () => void;
  onClose: () => void;
}

export function LayerModal({
  isOpen,
  isEditing,
  layer,
  onChange,
  onSave,
  onClose,
}: LayerModalProps) {
  const { countries } = useCountryData();
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);

  // Check if editing visited countries layer
  const isVisited = layer?.id === VISITED_LAYER_ID;

  // State for country select modal
  const selectedCountries = countries.filter(
    (country) => layer && layer.countries.includes(country.isoCode)
  );

  // Handle modal close
  const handleClose = () => {
    // Only allow closing if no submodal is open
    if (!colorModalOpen && !countryModalOpen) {
      onClose();
    }
  };

  // Don't render the modal if no layer is being edited
  if (!layer) return null;

  // Validate layer
  const isValid =
    layer.name.trim() !== "" &&
    layer.countries &&
    layer.countries.length > 0;

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
              {isEditing ? "Edit Layer" : "Add Layer"}
            </>
          }
        >
          <ActionButton
            onClick={onClose}
            ariaLabel="Close Layer Modal"
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
                value={layer.name}
                onChange={(e) => onChange({ ...layer, name: e.target.value })}
                disabled={isVisited}
                className={`${isVisited ? "opacity-50" : ""}`}
              />
            </FormField>

            {/* Color */}
            <FormField label="Color:">
              <ColorSelectInput
                value={layer.color}
                onChange={(color: string) => onChange({ ...layer, color })}
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
                          ...layer,
                          countries: layer.countries.filter(
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
                value={layer.filterLabels?.all || ""}
                onChange={(e) =>
                  onChange({
                    ...layer,
                    filterLabels: {
                      ...layer.filterLabels,
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
                value={layer.filterLabels?.only || ""}
                onChange={(e) =>
                  onChange({
                    ...layer,
                    filterLabels: {
                      ...layer.filterLabels,
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
                value={layer.filterLabels?.exclude || ""}
                onChange={(e) =>
                  onChange({
                    ...layer,
                    filterLabels: {
                      ...layer.filterLabels,
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
                    This layer is managed automatically based on your trips.
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
                submitLabel={isEditing ? "Save Changes" : "Add Layer"}
                disabled={!isValid || isVisited}
              />
            </div>
          </div>
        </form>
      </Modal>
      {/* Country Select Modal */}
      <CountrySelectModal
        isOpen={countryModalOpen}
        selected={layer.countries}
        options={countries}
        onClose={() => setCountryModalOpen(false)}
        onChange={(newCountries) => {
          onChange({ ...layer, countries: newCountries });
        }}
        disabled={isVisited}
      />
    </>
  );
}
