import { useState, useMemo } from "react";
import { FaFloppyDisk, FaSuitcaseRolling, FaXmark } from "react-icons/fa6";
import {
  ActionButton,
  Checkbox,
  DateSelect,
  DropdownSelectInput,
  FormField,
  InputBox,
  Modal,
  ModalActions,
  NumberInput,
  PanelHeader,
} from "@components";
import { CountriesSection } from "./CountriesSection";
import { useUserFriends } from "@features/user";
import { useFriendProfiles } from "@features/user/friends/hooks/useFriendProfiles";
import {
  CountrySelectModal,
  getCountryByIsoCode,
  useCountryData,
  type Country,
} from "@features/countries";
import { useTripFilters } from "../../hooks/useTripFilters";
import type { Trip, TripCategory } from "../../types";
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
  const { categoryOptions, tagOptions } = useTripFilters();

  // Tentative state (no dates)
  const [isTentative, setIsTentative] = useState(false);

  // Friends/participants logic
  const { friends } = useUserFriends();
  const friendUids = useMemo(() => friends.map((f) => f.uid), [friends]);
  const { profiles: friendProfiles } = useFriendProfiles(friendUids);
  const participantOptions = useMemo(
    () =>
      friendProfiles.map((profile) => ({
        value: profile.uid,
        label: profile.displayName || profile.username || profile.uid,
        profile,
      })),
    [friendProfiles],
  );

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
        draggable
      >
        <PanelHeader
          title={
            <>
              <FaSuitcaseRolling />
              {isEditing ? "Edit Trip" : "Add Trip"}
            </>
          }
          showSeparator={true}
        >
          <ActionButton
            onClick={onClose}
            ariaLabel="Close"
            title="Close"
            icon={<FaXmark className="text-2xl" />}
            rounded
          />
        </PanelHeader>
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
              <FormField label="Participants">
                <DropdownSelectInput
                  value={trip.participants || []}
                  onChange={(v) =>
                    onChange({
                      ...trip,
                      participants: Array.isArray(v)
                        ? (v as string[])
                        : v
                          ? [v as string]
                          : [],
                    })
                  }
                  options={participantOptions}
                  placeholder="Select participants"
                  isMulti
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
              <CountriesSection
                selectedCountries={selectedCountries
                  .filter((c): c is Country => c !== null)
                  .map(({ isoCode, name }) => ({ isoCode, name }))}
                onEdit={() => setCountryModalOpen(true)}
                onRemove={(isoCode) =>
                  onChange({
                    ...trip,
                    countryCodes: trip.countryCodes.filter(
                      (code) => code !== isoCode,
                    ),
                  })
                }
              />
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
