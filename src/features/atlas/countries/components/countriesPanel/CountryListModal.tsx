import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FormField, Modal, ModalActions, ModalHeader } from "@components";
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
  isTrackingList?: boolean;
  list: CountryList | null;
  onChange: (list: CountryList) => void;
  onSave: (list: CountryList) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function CountryListModal({
  isOpen,
  isEditing,
  isTrackingList = false,
  list,
  onChange,
  onSave,
  onDelete,
  onClose,
}: CountryListModalProps) {
  const { countries } = useCountryData();
  const { isTripBased, isVisitedCountry } = useVisitedCountries();

  const [countrySelectOpen, setCountrySelectOpen] = useState(false);
  const { t } = useTranslation("atlas");

  // Don't render the modal if no list is being edited
  if (!list) return null;

  // Validate list
  const isLinked = !!list.layerId && isEditing;

  // Determine if the list is valid for saving
  const isValid = isTrackingList
    ? list.countryCodes.length >= 0
    : list.name.trim() !== "" && list.countryCodes.length > 0;

  // Determine if the list is a tracking list
  const isVisitedList = list.id === "VISITED_COUNTRIES";
  const isWantToVisitList = list.id === "WANT_TO_VISIT";

  // Determine if a country should be disabled based on the list type
  const handleIsCountryDisabled = (code: string): boolean => {
    if (isWantToVisitList) {
      return isVisitedCountry(code);
    } else if (isVisitedList) {
      return isTripBased(code);
    }
    return false;
  };

  // Handle modal close
  const handleClose = () => {
    if (!countrySelectOpen) {
      onClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="rounded-xl shadow-2xl !min-w-[900px] max-h-[95vh] overflow-y-auto"
        disableClose={countrySelectOpen}
        draggable
      >
        <ModalHeader
          title={
            <>
              {isWantToVisitList ? (
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
        />
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
              disabled={isTrackingList}
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

                // If it's a tracking list, save the changes immediately
                if (isTrackingList) {
                  onSave(updatedList);
                }
              }}
              isOpen={countrySelectOpen}
              onOpen={() => setCountrySelectOpen(true)}
              onClose={() => setCountrySelectOpen(false)}
              isTripBasedCountry={isTrackingList ? isTripBased : undefined}
              isCountryDisabled={handleIsCountryDisabled}
            />
            {isEditing && isLinked && (
              <div className="flex px-3 py-2 mb-2 items-center text-danger ">
                <ICONS.info className="inline me-2" />
                {t("countries.lists.form.linkedWarning")}
              </div>
            )}
            {isTrackingList && (
              <div className="flex px-3 py-2 mb-2 items-center text-danger ">
                <ICONS.info className="inline me-2" />
                {t("countries.lists.form.trackingListWarning")}
              </div>
            )}
            <div className="flex items-center justify-end mt-6">
              {!isTrackingList && (
                <ModalActions
                  onCancel={onClose}
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
