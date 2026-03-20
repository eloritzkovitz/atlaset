import { useState } from "react";
import {
  ActionButton,
  ColorSelectInput,
  FormField,
  Modal,
  ModalActions,
  PanelHeader,
} from "@components";
import { ICONS } from "@constants/icons";
import { CountrySelectField, useCountryData } from "@features/countries";
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

  // Handle modal close
  const handleClose = () => {
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
        className="rounded-xl shadow-2xl !min-w-[900px] max-h-[90vh] overflow-y-auto"
        disableClose={countryModalOpen || colorModalOpen}
        draggable
      >
        <PanelHeader
          title={
            <>
              <ICONS.layers />
              {isEditing ? "Edit Layer" : "Add Layer"}
            </>
          }
        >
          <ActionButton
            onClick={onClose}
            ariaLabel="Close Layer Modal"
            icon={<ICONS.close className="text-2xl" />}
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
            <FormField label="Name:">
              <input
                type="text"
                name="name"
                value={layer.name}
                onChange={(e) => onChange({ ...layer, name: e.target.value })}
              />
            </FormField>
            <FormField label="Color:">
              <ColorSelectInput
                value={layer.color}
                onChange={(color: string) => onChange({ ...layer, color })}
                onModalOpenChange={setColorModalOpen}
              />
            </FormField>
            <CountrySelectField
              countryCodes={layer.countries}
              countries={countries}
              onChange={(newCodes) =>
                onChange({ ...layer, countries: newCodes })
              }
              isOpen={countryModalOpen}
              onOpen={() => setCountryModalOpen(true)}
              onClose={() => setCountryModalOpen(false)}
            />
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
                    <ICONS.save className="inline" />
                  ) : (
                    <ICONS.add className="inline" />
                  )
                }
                submitLabel={isEditing ? "Save Changes" : "Add Layer"}
                disabled={!isValid}
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
