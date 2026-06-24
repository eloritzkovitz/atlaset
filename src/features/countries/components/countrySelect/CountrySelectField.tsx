import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import { ActionButton, Chip, FormField } from "@components";
import { ICONS } from "@constants/icons";
import { useHomeCountry } from "@features/user";
import { CountrySelectModal } from "./CountrySelectModal";
import type { Country } from "../../types";

interface CountrySelectFieldProps {
  label?: string;
  countryCodes: string[];
  countries: Country[];
  onChange: (codes: string[]) => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  disabled?: boolean;
  isTripBasedCountry?: (code: string) => boolean;
}

export function CountrySelectField({
  label,
  countryCodes,
  countries,
  onChange,
  isOpen,
  onOpen,
  onClose,
  disabled,
  isTripBasedCountry,
}: CountrySelectFieldProps) {
  const { homeCountry } = useHomeCountry();
  const { t } = useTranslation("atlas");
  const labelText = label ?? t("countries.select.label");

  // Map codes to countries and sort alphabetically
  const selectedCountries = countries
    .filter((country) => countryCodes.includes(country.isoCode))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Handle changes from the modal, ensuring trip-based countries remain selected
  const handleModalChange = (incomingCodes: string[]) => {
    if (!isTripBasedCountry) {
      onChange(incomingCodes);
      return;
    }

    // Identify all currently selected codes that are system-locked by trip parameters
    const lockedCodes = countryCodes.filter((code) => isTripBasedCountry(code));

    // Combine the user selection with locked codes, ensuring no duplicates exist
    const mergedCodes = Array.from(new Set([...incomingCodes, ...lockedCodes]));

    onChange(mergedCodes);
  };

  return (
    <>
      <FormField label={labelText}>
        <div className="flex items-center gap-2 flex-wrap">
          {countryCodes.length === 0 ? (
            <span className="text-muted">
              {t("countries.select.noneSelected")}
            </span>
          ) : (
            selectedCountries.map((country) => {
              // Determine if the country is a trip-based visit and if it can be removed
              const isLockedVisit = !!isTripBasedCountry?.(country.isoCode);
              const canRemove = !disabled && !isLockedVisit;

              return (
                <Chip
                  key={country.isoCode}
                  removable={canRemove}
                  onRemove={() =>
                    canRemove &&
                    onChange(
                      countryCodes.filter((code) => code !== country.isoCode),
                    )
                  }
                >
                  {country.name}
                  {isLockedVisit ? (
                    homeCountry === country.isoCode ? (
                      <ICONS.home className="inline ms-1" />
                    ) : (
                      <ICONS.tripAbroad className="inline ms-1" />
                    )
                  ) : null}
                </Chip>
              );
            })
          )}
          {!disabled && (
            <ActionButton
              type="button"
              variant="secondary"
              onClick={onOpen}
              disabled={disabled}
            >
              {<ICONS.edit className="inline" />} {t("common:actions.edit")}
            </ActionButton>
          )}
        </div>
      </FormField>
      {isOpen &&
        ReactDOM.createPortal(
          <CountrySelectModal
            isOpen={isOpen}
            selected={countryCodes}
            options={countries}
            onClose={onClose}
            onChange={handleModalChange}
          />,
          document.body,
        )}
    </>
  );
}
