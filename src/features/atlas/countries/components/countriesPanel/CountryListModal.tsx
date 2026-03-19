import { useState } from "react";
import {
  ActionButton,
  Chip,
  FormField,
  Modal,
  ModalActions,
  PanelHeader,
} from "@components";
import { ICONS } from "@constants/icons";
import { CountrySelectModal } from "@features/countries/components/countrySelect/CountrySelectModal";
import { useCountryData } from "@features/countries";
import type { CountryList } from "@features/countries/types";

interface CountryListModalProps {
  isOpen: boolean;
  isEditing: boolean;
  list: CountryList | null;
  onChange: (list: CountryList) => void;
  onSave: (list: CountryList) => void;
  onClose: () => void;
}

export function CountryListModal({
  isOpen,
  isEditing,
  list,
  onChange,
  onSave,
  onClose,
}: CountryListModalProps) {
  const { countries } = useCountryData();
  const [countryModalOpen, setCountryModalOpen] = useState(false);

  // State for country select modal
  const selectedCountries = countries.filter(
    (country) => list && list.countryCodes.includes(country.isoCode),
  );

  // Handle modal close
  const handleClose = () => {
    if (!countryModalOpen) {
      onClose();
    }
  };

  if (!list) return null;

  // Validate list
  const isValid = list.name.trim() !== "" && list.countryCodes.length > 0;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        className="rounded-xl shadow-2xl !min-w-[600px] max-h-[90vh] overflow-y-auto"
        disableClose={countryModalOpen}
        draggable
      >
        <PanelHeader
          title={
            <>
              <ICONS.countryLists />
              {isEditing ? "Edit List" : "Add List"}
            </>
          }
        >
          <ActionButton
            onClick={onClose}
            ariaLabel="Close List Modal"
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
          <div className="p-2">
            {/* Name */}
            <FormField label="Name:">
              <input
                type="text"
                name="name"
                value={list.name}
                onChange={(e) => onChange({ ...list, name: e.target.value })}
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
                          ...list,
                          countryCodes: list.countryCodes.filter(
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
                  <ICONS.edit className="inline" /> Edit
                </ActionButton>
              </div>
            </FormField>

            <div className="flex items-center justify-between mt-6">
              <ModalActions
                onCancel={onClose}
                onSubmit={() => isValid && onSave(list)}
                submitType="submit"
                submitIcon={
                  isEditing ? (
                    <ICONS.save className="inline" />
                  ) : (
                    <ICONS.add className="inline" />
                  )
                }
                submitLabel={isEditing ? "Save Changes" : "Add List"}
                disabled={!isValid}
              />
            </div>
          </div>
        </form>
      </Modal>
      {/* Country Select Modal */}
      <CountrySelectModal
        isOpen={countryModalOpen}
        selected={list.countryCodes}
        options={countries}
        onClose={() => setCountryModalOpen(false)}
        onChange={(newCodes) => {
          onChange({ ...list, countryCodes: newCodes });
        }}
      />
    </>
  );
}
