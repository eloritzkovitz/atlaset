import { useState } from "react";
import { FaSuitcaseRolling, FaGlobe, FaFloppyDisk } from "react-icons/fa6";
import {
  Checkbox,
  DateSelect,
  DropdownSelectInput,
  FormField,
  InputBox,
  Modal,
  ModalActions,
  NumberInput,
  SelectInput,
} from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountrySelectModal, getCountryByIsoCode, type Country } from "@features/countries";
import type { Trip, TripCategory, TripStatus } from "@types";
import { SelectedCountriesList } from "./SelectedCountriesList";
import { useTripFilters } from "../../hooks/useTripFilters";
import "./TripModal.css";

interface TripModalProps {
  isOpen: boolean;
  trip: Trip | null;
  onChange: (trip: Trip) => void;
  onSave: (trip: Trip) => Promise<void>;
  onClose: () => void;
  isEditing: boolean;
}

export function TripModal({
  isOpen,
  trip,
  onChange,
  onSave,
  onClose,
  isEditing,
}: TripModalProps) {
  const { countries } = useCountryData();
  const [countryModalOpen, setCountryModalOpen] = useState(false);

  // Dropdown options
  const { categoryOptions, statusOptions, tagOptions } = useTripFilters();

  // Tentative state (no dates)
  const [isTentative, setIsTentative] = useState(false);

  // If no trip is provided, don't render anything
  if (!trip) return null;

  // Get the selected country objects
  const selectedCountries = trip.countryCodes
    .map((isoCode) => getCountryByIsoCode(isoCode, { countries }))
    .filter(Boolean);

  // Form validation
  const isValid =
    !!trip.name.trim() &&
    trip.countryCodes.length > 0 &&
    (isTentative || (!!trip.startDate && !!trip.endDate));

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-[900px] max-h-[92vh] flex flex-col shadow"
        disableClose={countryModalOpen}
      >
        <form
          className="flex flex-col w-full h-full"
          onSubmit={(e) => {
            e.preventDefault();
            if (!isValid) return;
            onSave(trip);
          }}
        >
          <div className="flex flex-row w-full flex-1">
            {/* Left: Form fields */}
            <div className="p-4 min-w-0 flex flex-col gap-2 basis-[60%]">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaSuitcaseRolling />
                {isEditing ? "Edit Trip" : "Add Trip"}
              </h2>
              <FormField label="Name">
                <InputBox
                  value={trip.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange({ ...trip, name: e.target.value })
                  }
                  required
                />
              </FormField>
              <FormField label="Start Date" disabled={isTentative}>
                <DateSelect
                  value={trip.startDate ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newStart = e.target.value;
                    let newEnd = trip.endDate;
                    if (!newEnd || newEnd < newStart) {
                      newEnd = newStart;
                    }
                    onChange({ ...trip, startDate: newStart, endDate: newEnd });
                  }}
                  disabled={isTentative}
                  required={!isTentative}
                />
              </FormField>
              <FormField label="End Date" disabled={isTentative}>
                <DateSelect
                  value={trip.endDate ?? ""}
                  min={trip.startDate || undefined}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange({ ...trip, endDate: e.target.value })
                  }
                  disabled={isTentative}
                  required={!isTentative}
                />
              </FormField>
              <FormField label="">
                <Checkbox
                  label="Tentative Dates"
                  checked={isTentative}
                  onChange={(tentative) => {
                    setIsTentative(tentative);
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
              <FormField label="Countries">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 rounded hover:bg-input-hover font-medium"
                  onClick={() => setCountryModalOpen(true)}
                >
                  <FaGlobe />
                  {selectedCountries.length > 0
                    ? `Edit Countries (${selectedCountries.length})`
                    : "Select Countries"}
                </button>
              </FormField>
              <FormField label="Full Days" disabled={isTentative}>
                <NumberInput
                  label=""
                  value={trip.fullDays ?? 1}
                  min={1}
                  onChange={(val) =>
                    onChange({ ...trip, fullDays: Math.max(1, val) })
                  }
                  disabled={isTentative}
                />
              </FormField>
              <FormField label="Categories">
                <DropdownSelectInput
                  value={trip.categories || []}
                  onChange={(v) =>
                    onChange({
                      ...trip,
                      categories: Array.isArray(v)
                        ? (v as TripCategory[])
                        : v
                        ? [v as TripCategory]
                        : [],
                    })
                  }
                  options={categoryOptions}
                  placeholder="Select categories"
                  isMulti
                />
              </FormField>
              <FormField label="Status">
                <SelectInput
                  value={trip.status || ""}
                  onChange={(v) =>
                    onChange({
                      ...trip,
                      status: v as TripStatus,
                    })
                  }
                  options={statusOptions}
                  label={""}
                />
              </FormField>
              <FormField label="Tags">
                <DropdownSelectInput
                  value={trip.tags || []}
                  onChange={(v) =>
                    onChange({
                      ...trip,
                      tags: Array.isArray(v) ? v : v ? [v] : [],
                    })
                  }
                  options={tagOptions}
                  placeholder="Add tags"
                  isMulti
                />
              </FormField>
            </div>
            {/* Right: Selected Countries & Notes */}
            <div className="flex flex-col min-w-0 p-4 gap-2 basis-[40%]">
              <div className="flex-1 min-h-0 overflow-auto">
                <SelectedCountriesList
                  selectedCountries={selectedCountries
                    .filter((c): c is Country => c !== null)
                    .map(({ isoCode, name }) => ({ isoCode, name }))}
                  onRemove={(isoCode) =>
                    onChange({
                      ...trip,
                      countryCodes: trip.countryCodes.filter(
                        (code) => code !== isoCode
                      ),
                    })
                  }
                />
              </div>
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="font-semibold mb-2">Notes</div>
                <InputBox
                  as="textarea"
                  className="w-full flex-1 min-h-0 resize-none"
                  value={trip.notes}
                  onChange={(e: { target: { value: string } }) =>
                    onChange({ ...trip, notes: e.target.value })
                  }
                  placeholder="Add notes about this trip..."
                />
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="w-full flex justify-end px-6 pb-4">
            <ModalActions
              onCancel={onClose}
              submitIcon={
                isEditing ? (
                  <FaFloppyDisk className="inline" />
                ) : (
                  <FaSuitcaseRolling className="inline" />
                )
              }
              submitLabel={isEditing ? "Save Changes" : "Add Trip"}
              disabled={!isValid}
            />
          </div>
        </form>
      </Modal>
      <CountrySelectModal
        isOpen={countryModalOpen}
        selected={trip.countryCodes}
        options={countries}
        onClose={() => setCountryModalOpen(false)}
        onChange={(newCodes) => {
          onChange({ ...trip, countryCodes: newCodes });
        }}
      />
    </>
  );
}
