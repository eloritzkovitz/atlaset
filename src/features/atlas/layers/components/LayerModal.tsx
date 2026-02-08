import { useState } from "react";
import { FaLayerGroup, FaPencil, FaXmark, FaFloppyDisk } from "react-icons/fa6";
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
import type { Layer } from "../types";

interface LayerModalProps {
  isOpen: boolean;
  isEditing: boolean;
  layer: Layer | null;
  onChange: (layer: Layer) => void;
  onSave: (layer: Layer) => void;
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

  // State for country select modal
  const selectedCountries = countries.filter(
    (country) => layer && layer.countries.includes(country.isoCode),
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
    layer.name.trim() !== "" && layer.countries && layer.countries.length > 0;

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
            if (isValid) {
              onSave(layer);
            }
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
              />
            </FormField>

            {/* Color */}
            <FormField label="Color:">
              <ColorSelectInput
                value={layer.color}
                onChange={(color: string) => onChange({ ...layer, color })}
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
                            (code) => code !== country.isoCode,
                          ),
                        })
                      }
                    >
                      {country.name}
                    </Chip>
                  ))
                )}
                <ActionButton
                  type="button"
                  variant="secondary"
                  onClick={() => setCountryModalOpen(true)}
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
              />
            </FormField>
            <div className="flex items-center justify-between mt-6">
              <ModalActions
                onCancel={onClose}
                onSubmit={() => isValid && onSave(layer)}
                submitType="submit"
                submitIcon={
                  isEditing ? (
                    <FaFloppyDisk className="inline" />
                  ) : (
                    <FaLayerGroup className="inline" />
                  )
                }
                submitLabel={isEditing ? "Save Changes" : "Add Layer"}
                disabled={!isValid}
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
      />
    </>
  );
}
