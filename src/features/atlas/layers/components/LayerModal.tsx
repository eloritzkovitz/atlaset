import { useState } from "react";
import {
  ActionButton,
  Checkbox,
  ColorSelectInput,
  FormField,
  Modal,
  ModalActions,
  PanelHeader,
  SelectInput,
} from "@components";
import { ICONS } from "@constants/icons";
import { useCountryLists } from "@contexts/CountryListsContext";
import { CountrySelectField, useCountryData } from "@features/countries";
import type { Layer } from "../types";

type FilterLabelKey = "all" | "only" | "exclude";
const filterLabelKeys: FilterLabelKey[] = ["all", "only", "exclude"];

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
  const { countryLists } = useCountryLists();
  const { countries } = useCountryData();
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [useList, setUseList] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Don't render the modal if no layer is being edited
  if (!layer) return null;

  // Validate layer
  const isValid =
    layer.name.trim() !== "" && layer.countries && layer.countries.length > 0;

  // Handle list selection
  const handleListSelect = (listId: string | number) => {
    const selectedList = countryLists.find((l) => l.id === listId);
    if (selectedList) {
      onChange({
        ...layer,
        name: selectedList.name,
        countries: selectedList.countryCodes,
      });
    }
    setSelectedListId(listId as string);
  };

  // Handle filter label change
  const handleFilterLabelChange = (key: FilterLabelKey, value: string) => {
    onChange({
      ...layer,
      filterLabels: {
        ...layer.filterLabels,
        [key]: value,
      },
    });
  };

  // Handle modal close
  const handleClose = () => {
    if (!colorModalOpen && !countryModalOpen) {
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="rounded-xl shadow-2xl !min-w-[900px] max-h-[90vh] flex flex-col"
        disableClose={countryModalOpen || colorModalOpen}
        draggable
      >
        <div className="flex-shrink-0">
          <PanelHeader
            title={
              <>
                <ICONS.layers />
                {isEditing ? "Edit Layer" : "Add Layer"}
              </>
            }
            showSeparator
          >
            <ActionButton
              onClick={onClose}
              ariaLabel="Close Layer Modal"
              icon={<ICONS.close className="text-2xl" />}
              rounded
            />
          </PanelHeader>
        </div>
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isValid) {
                onSave(layer);
              }
            }}
          >
            <div className="flex flex-col p-4">
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
              {!isEditing && (
                <FormField label="">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={useList}
                      onChange={(
                        checked: boolean | ((prevState: boolean) => boolean),
                      ) => {
                        setUseList(checked);
                        if (!checked) {
                          setSelectedListId(null);
                        }
                      }}
                      label="From List:"
                    />
                    <SelectInput
                      value={selectedListId || ""}
                      onChange={(val) => handleListSelect(val as string)}
                      options={countryLists.map((list) => ({
                        value: list.id,
                        label: list.name,
                      }))}
                      placeholder="Select a list..."
                      disabled={!useList}
                      className="min-w-[220px]"
                    />
                  </div>
                </FormField>
              )}
              {filterLabelKeys.map((key, idx) => (
                <FormField label={idx === 0 ? "Filter Labels:" : ""} key={key}>
                  <input
                    type="text"
                    value={layer.filterLabels?.[key as FilterLabelKey] || ""}
                    onChange={(e) =>
                      handleFilterLabelChange(key, e.target.value)
                    }
                  />
                </FormField>
              ))}
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
        </div>
      </Modal>
    </>
  );
}
