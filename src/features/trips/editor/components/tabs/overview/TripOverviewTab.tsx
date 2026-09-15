import { useTranslation } from "react-i18next";
import {
  Checkbox,
  DateSelect,
  FormField,
  InputBox,
  NumberInput,
} from "@components";
import type { Country } from "@features/countries/types";
import type { Trip } from "@features/trips/core/types";
import { CountriesSection } from "./CountriesSection";

interface TripOverviewTabProps {
  trip: Trip;
  selectedCountries: Array<Country | null>;
  onEditCountries: () => void;
  isTentative: boolean;
  onChange: (trip: Trip) => void;
  onTentativeChange: (tentative: boolean) => void;
}

/** Renders the overview tab for a trip. */
export function TripOverviewTab({
  trip,
  selectedCountries,
  onEditCountries,
  isTentative,
  onChange,
  onTentativeChange,
}: TripOverviewTabProps) {
  const { t } = useTranslation("trips");

  return (
    <div className="flex flex-col gap-4">
      {/* Name */}
      <FormField label={t("fields.name")}>
        <InputBox
          id="trip-name"
          name="trip-name"
          type="text"
          value={trip.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({
              ...trip,
              name: e.target.value,
            })
          }
          required
        />
      </FormField>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label={t("fields.startDate")} disabled={isTentative}>
          <DateSelect
            value={trip.startDate ?? ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newStart = e.target.value;
              let newEnd = trip.endDate;

              if (!newEnd || newEnd < newStart) {
                newEnd = newStart;
              }

              onChange({
                ...trip,
                startDate: newStart,
                endDate: newEnd,
              });
            }}
            disabled={isTentative}
            required={!isTentative}
          />
        </FormField>

        <FormField label={t("fields.endDate")} disabled={isTentative}>
          <DateSelect
            value={trip.endDate ?? ""}
            min={trip.startDate || undefined}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({
                ...trip,
                endDate: e.target.value,
              })
            }
            disabled={isTentative}
            required={!isTentative}
          />
        </FormField>
      </div>

      {/* Tentative dates */}
      <FormField label="">
        <Checkbox
          label={t("editor.overview.tentativeDates")}
          checked={isTentative}
          onChange={(tentative) => {
            onTentativeChange(tentative);

            if (tentative) {
              onChange({
                ...trip,
                startDate: undefined,
                endDate: undefined,
              });
            }
          }}
        />
      </FormField>

      {/* Full days */}
      <FormField label={t("fields.fullDays")} disabled={isTentative}>
        <NumberInput
          label=""
          value={trip.fullDays ?? 1}
          min={1}
          onChange={(val) =>
            onChange({
              ...trip,
              fullDays: Math.max(1, val),
            })
          }
          disabled={isTentative}
        />
      </FormField>

      {/* Countries */}
      <CountriesSection
        selectedCountries={selectedCountries
          .filter((country): country is Country => country !== null)
          .map(({ isoCode, name }) => ({
            isoCode,
            name,
          }))}
        onEdit={onEditCountries}
        onRemove={(isoCode) =>
          onChange({
            ...trip,
            countryCodes: trip.countryCodes.filter((code) => code !== isoCode),
          })
        }
      />
    </div>
  );
}
