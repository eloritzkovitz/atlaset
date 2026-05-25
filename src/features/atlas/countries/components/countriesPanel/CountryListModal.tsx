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

interface CountryListModalProps {
  isOpen: boolean;
  isEditing: boolean;
  list: CountryList | null;
  onChange: (list: CountryList) => void;
  onSave: (list: CountryList) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function CountryListModal({
  isOpen,
  isEditing,
  list,
  onChange,
  onSave,
  onDelete,
  onClose,
}: CountryListModalProps) {
  const { countries } = useCountryData();
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
  const isValid = list.name.trim() !== "" && list.countryCodes.length > 0;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="rounded-xl shadow-2xl !min-w-[600px] max-h-[90vh] overflow-y-auto"
        disableClose={countrySelectOpen}
        draggable
      >
        <PanelHeader
          title={
            <>
              <ICONS.countryLists />
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
            <FormField label={t("countries.lists.form.nameLabel")}>
              <input
                type="text"
                name="name"
                value={list.name}
                onChange={(e) => onChange({ ...list, name: e.target.value })}
              />
            </FormField>
            <CountrySelectField
              countryCodes={list.countryCodes}
              countries={countries}
              onChange={(newCodes) =>
                onChange({ ...list, countryCodes: newCodes })
              }
              isOpen={countrySelectOpen}
              onOpen={() => setCountrySelectOpen(true)}
              onClose={() => setCountrySelectOpen(false)}
            />
            {isEditing && isLinked && (
              <div className="flex px-3 py-2 mb-2 items-center text-danger ">
                <ICONS.info className="inline me-2" />
                {t("countries.lists.form.linkedWarning")}
              </div>
            )}
            <div className="flex items-center justify-end mt-6">
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
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
