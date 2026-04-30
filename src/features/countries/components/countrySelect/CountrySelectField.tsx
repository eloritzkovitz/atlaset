import ReactDOM from "react-dom";
import { ActionButton, Chip, FormField } from "@components";
import { ICONS } from "@constants/icons";
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
}

export function CountrySelectField({
  label = "Countries:",
  countryCodes,
  countries,
  onChange,
  isOpen,
  onOpen,
  onClose,
  disabled,
}: CountrySelectFieldProps) {
  // Map codes to countries and sort alphabetically
  const selectedCountries = countries
    .filter((country) => countryCodes.includes(country.isoCode))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <FormField label={label}>
        <div className="flex items-center gap-2 flex-wrap">
          {countryCodes.length === 0 ? (
            <span className="text-muted">No countries selected.</span>
          ) : (
            selectedCountries.map((country) => (
              <Chip
                key={country.isoCode}
                removable={!disabled}
                onRemove={() =>
                  !disabled &&
                  onChange(
                    countryCodes.filter((code) => code !== country.isoCode),
                  )
                }
              >
                {country.name}
              </Chip>
            ))
          )}
          {!disabled && (
            <ActionButton
              type="button"
              variant="secondary"
              onClick={onOpen}
              disabled={disabled}
              icon={<ICONS.edit className="inline" />}
            >
              Edit
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
            onChange={onChange}
          />,
          document.body,
        )}
    </>
  );
}
