import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Checkbox,
  ColorSelectInput,
  FormField,
  Modal,
  ModalActions,
  ModalHeader,
  SelectInput,
} from "@components";
import { ICONS } from "@constants/icons";
import { useCountryLists } from "@features/atlas/countries/context/CountryListsContext";
import { CountrySelectField, useCountryData } from "@features/countries";
import { useDisclosure } from "@hooks";
import { isAuthenticated } from "@lib/firebase";
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
  const { t } = useTranslation(["atlas", "common"]);

  const countryModal = useDisclosure();
  const colorModal = useDisclosure();

  const [useList, setUseList] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Don't render the modal if no layer is being edited
  if (!layer) return null;

  // Validate layer
  const isListManaged = !!layer.listId && isEditing;
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
    if (!colorModal.isOpen && !countryModal.isOpen) {
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="rounded-xl shadow-2xl !min-w-[900px] max-h-[90vh] flex flex-col"
        disableClose={countryModal.isOpen || colorModal.isOpen}
        draggable
      >
        <div className="flex-shrink-0">
          <ModalHeader
            title={
              <>
                <ICONS.layers />
                {isEditing
                  ? t("layers.editTitle", "Edit Layer")
                  : t("layers.addTitle", "Add Layer")}
              </>
            }
          />
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
              <FormField label={t("layers.form.name", "Name:")}>
                <input
                  id="layer-name"
                  name="name"
                  type="text"
                  value={layer.name}
                  onChange={(e) => onChange({ ...layer, name: e.target.value })}
                  disabled={isListManaged}
                />
              </FormField>
              <FormField label={t("layers.form.color", "Color:")}>
                <ColorSelectInput
                  value={layer.color}
                  onChange={(color: string) => onChange({ ...layer, color })}
                  onModalOpenChange={colorModal.setIsOpen}
                />
              </FormField>
              <CountrySelectField
                countryCodes={layer.countries}
                countries={countries}
                onChange={(newCodes) =>
                  onChange({ ...layer, countries: newCodes })
                }
                isOpen={countryModal.isOpen}
                onOpen={countryModal.open}
                onClose={countryModal.close}
                disabled={isListManaged}
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
                      label={t("layers.form.fromList", "From List:")}
                      disabled={!isAuthenticated()}
                    />
                    <SelectInput
                      value={selectedListId || ""}
                      onChange={(val) => handleListSelect(val as string)}
                      options={countryLists.map((list) => ({
                        value: list.id,
                        label: list.name,
                      }))}
                      placeholder={t(
                        "layers.form.selectList",
                        "Select a list...",
                      )}
                      disabled={!useList}
                      className="min-w-[220px]"
                    />
                  </div>
                </FormField>
              )}
              {filterLabelKeys.map((key, idx) => (
                <FormField
                  label={
                    idx === 0
                      ? t("layers.form.filterLabels", "Filter Labels:")
                      : ""
                  }
                  key={key}
                >
                  <input
                    id={`filter-label-${key}`}
                    name={`filter-label-${key}`}
                    type="text"
                    value={layer.filterLabels?.[key as FilterLabelKey] || ""}
                    onChange={(e) =>
                      handleFilterLabelChange(key, e.target.value)
                    }
                  />
                </FormField>
              ))}
              {isListManaged && (
                <div className="flex px-3 py-2 mb-2 items-center text-danger ">
                  <ICONS.info className="inline me-2" />
                  {t(
                    "layers.linkedListWarning",
                    "This layer is linked with a list. To edit its name or countries, update the list itself.",
                  )}
                </div>
              )}
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
                  submitLabel={
                    isEditing
                      ? t("layers.saveChanges", "Save Changes")
                      : t("layers.add", "Add Layer")
                  }
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
