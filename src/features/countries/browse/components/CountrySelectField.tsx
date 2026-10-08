import { useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { FieldHeader, ItemCount, type OverlayProps } from "@components";
import { useHomeCountry } from "@features/user/profile";
import { CountrySelectModal } from "./CountrySelectModal";
import { SelectedCountryChip } from "./SelectedCountryChip";
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

      onChange(Array.from(new Set([...incomingCodes, ...lockedCodes])));
    },
    [selectedIsoCodes, isTripBasedCountry, onChange],
  );

  return (
    <>
      <div className="mb-4">
        <FieldHeader
          label={
            <>
              {labelText}
              {selectedIsoCodes.length > 0 && (
                <ItemCount count={selectedIsoCodes.length} />
              )}
            </>
          }
          onEdit={disabled ? undefined : onOpen}
          editLabel={t("common:actions.edit")}
          required={required}
        />

        <div className="grid grid-cols-[120px_1fr] gap-2">
          <div />

          <div className="max-h-120 overflow-y-auto">
            {selectedIsoCodes.length === 0 ? (
              <span className="text-muted">
                {t("countries.select.noneSelected")}
              </span>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {selectedCountries.map((country) => {
                  const isLockedVisit = !!isTripBasedCountry?.(country.isoCode);
                  const canRemove = !disabled && !isLockedVisit;

                  return (
                    <SelectedCountryChip
                      key={country.isoCode}
                      country={country}
                      homeCountry={homeCountry}
                      isLockedVisit={isLockedVisit}
                      canRemove={canRemove}
                      onRemove={() =>
                        onChange(
                          selectedIsoCodes.filter(
                            (code) => code !== country.isoCode,
                          ),
                        )
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

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
