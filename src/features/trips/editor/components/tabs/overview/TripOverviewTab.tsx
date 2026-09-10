import { useTranslation } from "react-i18next";
import {
  Checkbox,
  DateSelect,
  FormField,
  InputBox,
  NumberInput,
} from "@components";
import type { Trip } from "@features/trips/core/types";

interface TripOverviewTabProps {
  trip: Trip;
  isTentative: boolean;
  onChange: (trip: Trip) => void;
  onTentativeChange: (tentative: boolean) => void;
}

/** Renders the overview tab for a trip. */
export function TripOverviewTab({
  trip,
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

      {/* Notes */}
      <FormField label={t("fields.notes")}>
        <InputBox
          id="trip-notes"
          name="trip-notes"
          as="textarea"
          className="w-full min-h-48 resize-none"
          value={trip.notes ?? ""}
          onChange={(e: { target: { value: string } }) =>
            onChange({
              ...trip,
              notes: e.target.value,
            })
          }
          placeholder={t("editor.overview.notesPlaceholder")}
        />
      </FormField>
    </div>
  );
}
