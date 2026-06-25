import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  FormField,
  Modal,
  ModalActions,
  PanelHeader,
} from "@components";
import { ICONS } from "@constants/icons";
import {
  CountrySelectField,
  useCountryData,
  type CountryList,
} from "@features/countries";
import { useVisitedCountries } from "@features/visits";

interface CountryListModalProps {
  isOpen: boolean;
  isEditing: boolean;
  isSystemList?: boolean;
  list: CountryList | null;
  onChange: (list: CountryList) => void;
  onSave: (list: CountryList) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function CountryListModal({
  isOpen,
  isEditing,
  isSystemList = false,
  list,
  onChange,
  onSave,
  onDelete,
  onClose,
}: CountryListModalProps) {
  const { countries } = useCountryData();
  const { isTripBased } = useVisitedCountries();

  const [countrySelectOpen, setCountrySelectOpen] = useState(false);
  const { t } = useTranslation("atlas");

  // Handle modal close
  const handleClose = () => {
    if (!countrySelectOpen) {
      onClose();
    }
  };

  // Don't render the modal if no list is being edited
  if (!list) return null;

  // Validate list
  const isLinked = !!list.layerId && isEditing;

  // Determine if the list is valid for saving
  const isValid = isSystemList
    ? list.countryCodes.length >= 0
    : list.name.trim() !== "" && list.countryCodes.length > 0;

  // Determine if the list is a system-managed list
  const isVisitedList = list.id === "VISITED_COUNTRIES";
  const isBucketList = list.id === "BUCKET_LIST";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="rounded-xl shadow-2xl !min-w-[900px] max-h-[95vh] overflow-y-auto"
        disableClose={countrySelectOpen}
        draggable
      >
        <PanelHeader
          title={
            <>
              {isBucketList ? (
                <ICONS.favorite />
              ) : isVisitedList ? (
                <ICONS.visits />
              ) : (
                <ICONS.countryLists />
              )}
              {isEditing
                ? t("countries.lists.form.editTitle")
                : t("countries.lists.form.addTitle")}
            </>
          }
          showSeparator
        >
          <ActionButton
            onClick={onClose}
            ariaLabel={t("common:actions.close")}
            title={t("common:actions.close")}
            icon={<ICONS.close className="text-2xl" />}
            rounded
          />
        </PanelHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isValid) {
              onSave(list);
            }
          }}
        >
          <div className="p-4">
            <FormField
              label={t("countries.lists.form.nameLabel")}
              disabled={isSystemList}
            >
              <input
                type="text"
                name="name"
                value={list.name}
                onChange={(e) => onChange({ ...list, name: e.target.value })}
              />
            </FormField>
            <CountrySelectField
              key={list.id}
              countryCodes={list.countryCodes}
              countries={countries}
              onChange={(newCodes) => {
                const updatedList = { ...list, countryCodes: newCodes };

                // Update the list in the parent component
                onChange(updatedList);

                // If it's a system list, save the changes immediately
                if (isSystemList) {
                  onSave(updatedList);
                }
              }}
              isOpen={countrySelectOpen}
              onOpen={() => setCountrySelectOpen(true)}
              onClose={() => setCountrySelectOpen(false)}
              isTripBasedCountry={isSystemList ? isTripBased : undefined}
            />
            {isEditing && isLinked && (
              <div className="flex px-3 py-2 mb-2 items-center text-danger ">
                <ICONS.info className="inline me-2" />
                {t("countries.lists.form.linkedWarning")}
              </div>
            )}
            {isSystemList && (
              <div className="flex px-3 py-2 mb-2 items-center text-danger ">
                <ICONS.info className="inline me-2" />
                {t("countries.lists.form.systemListWarning")}
              </div>
            )}
            <div className="flex items-center justify-end mt-6">
              {!isSystemList && (
                <ModalActions
                  onCancel={onClose}
                  onSubmit={() => isValid && onSave(list)}
                  onDelete={
                    isEditing && onDelete ? () => onDelete(list.id) : undefined
                  }
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
                      ? t("countries.lists.form.save")
                      : t("countries.lists.form.add")
                  }
                  deleteLabel={t("countries.lists.form.delete")}
                  disabled={!isValid}
                />
              )}
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
