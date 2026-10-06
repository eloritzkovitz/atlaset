import { useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ActionButton, Chip, FormField, type OverlayProps } from "@components";
import { ICONS } from "@constants/icons";
import { useHomeCountry } from "@features/user/profile";
import { CountrySelectModal } from "./CountrySelectModal";
import type { Country, CountrySelectionProps } from "../../types";

interface CountrySelectFieldProps extends OverlayProps, CountrySelectionProps {
  countries: Country[];
  label?: string;
  onOpen: () => void;
  required?: boolean;
  isTripBasedCountry?: (countryCode: string) => boolean;
}

export function CountrySelectField({
  label,
  selectedIsoCodes,
  countries,
  onChange,
  isOpen,
  onOpen,
  onClose,
  required = false,
  disabled,
  isTripBasedCountry,
  isCountryDisabled,
}: CountrySelectFieldProps) {
  const { homeCountry } = useHomeCountry();
  const { t } = useTranslation("atlas");
  const labelText = label ?? t("countries.select.label");

  const selectedCountries = useMemo(() => {
    if (!selectedIsoCodes.length || !countries.length) return [];

    const codeSet = new Set(selectedIsoCodes);

    return countries
      .filter((country) => codeSet.has(country.isoCode))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedIsoCodes, countries]);

  const handleModalChange = useCallback(
    (incomingCodes: string[]) => {
      if (!isTripBasedCountry) {
        onChange(incomingCodes);
        return;
      }

      const lockedCodes = selectedIsoCodes.filter((code) =>
        isTripBasedCountry(code),
      );

      const mergedCodes = Array.from(
        new Set([...incomingCodes, ...lockedCodes]),
      );

      onChange(mergedCodes);
    },
    [selectedIsoCodes, isTripBasedCountry, onChange],
  );

  return (
    <>
      <FormField label={labelText} required={required} disabled={disabled}>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedIsoCodes.length === 0 ? (
            <span className="text-muted">
              {t("countries.select.noneSelected")}
            </span>
          ) : (
            selectedCountries.map((country) => {
              const isLockedVisit = !!isTripBasedCountry?.(country.isoCode);
              const canRemove = !disabled && !isLockedVisit;

              return (
                <Chip
                  key={country.isoCode}
                  removable={canRemove}
                  onRemove={() =>
                    canRemove &&
                    onChange(
                      selectedIsoCodes.filter(
                        (code) => code !== country.isoCode,
                      ),
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
              icon={<ICONS.editField />}
              title={t("common:actions.edit")}
              aria-label={t("common:actions.edit")}
              onClick={onOpen}
              rounded
            />
          )}
        </div>
      </FormField>

      {isOpen &&
        createPortal(
          <CountrySelectModal
            isOpen={isOpen}
            selectedIsoCodes={selectedIsoCodes}
            options={countries}
            onClose={onClose}
            onChange={handleModalChange}
            isCountryDisabled={isCountryDisabled}
          />,
          document.body,
        )}
    </>
  );
}
