import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  Checkbox,
  DateSelect,
  FormField,
  InputBox,
  Modal,
  ModalActions,
  NumberInput,
  PanelHeader,
} from "@components";
import { ICONS } from "@constants/icons";
import {
  CountrySelectModal,
  getCountryByIsoCode,
  useCountryData,
  type Country,
} from "@features/countries";
import { useFriendProfiles, useUserFriends } from "@features/user";
import { CategoriesSection } from "./CategoriesSection";
import { CategorySelectModal } from "./CategorySelectModal";
import { CountriesSection } from "./CountriesSection";
import { ParticipantSelectModal } from "./ParticipantSelectModal";
import { ParticipantsSection } from "./ParticipantsSection";
import { TagsSection } from "./TagsSection";
import { TagSelectModal } from "./TagSelectModal";
import { useTripFilters } from "../../hooks/useTripFilters";
import { getAutoTripStatus } from "../../utils/trips";
import type { Trip, TripCategory, TripTag } from "../../types";
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
  const { t } = useTranslation("trips");
  const { countries } = useCountryData();
  const { friends } = useUserFriends();
  const { categoryOptions, tagOptions } = useTripFilters();

  // Modal open states for sub-modals
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [participantModalOpen, setParticipantModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  // Tentative state
  const [isTentative, setIsTentative] = useState(
    !!(isEditing && trip && getAutoTripStatus(trip) === "planned"),
  );

  // Friends/participants logic
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

  // Derive profiles for participants already linked to the current active trip
  const selectedParticipantProfiles = useMemo(() => {
    if (!trip || !trip.participants) return [];
    return friendProfiles.filter((profile) =>
      trip.participants?.includes(profile.uid),
    );
  }, [friendProfiles, trip]);

  // Transform category filter config array structure explicitly into modal compatible pairs
  const formattedCategoryOptions = useMemo(() => {
    return categoryOptions.map((opt) => ({
      value: opt.value as TripCategory,
      label: opt.label,
    }));
  }, [categoryOptions]);

  // Transform tag filter config array structure explicitly into modal compatible pairs
  const formattedTagOptions = useMemo(() => {
    return tagOptions.map((opt) => ({
      value: opt.value as TripTag,
      label: opt.label,
    }));
  }, [tagOptions]);

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
        className="w-[900px] h-[92vh] flex flex-col shadow"
        disableClose={
          countryModalOpen ||
          participantModalOpen ||
          categoryModalOpen ||
          tagModalOpen
        }
        draggable
      >
        <PanelHeader
          title={
            <>
              <ICONS.trips />
              {isEditing ? t("modal.titleEdit") : t("modal.titleAdd")}
            </>
          }
          showSeparator={true}
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
              <FormField label={t("modal.form.name")}>
                <InputBox
                  value={trip.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange({ ...trip, name: e.target.value })
                  }
                  required
                />
              </FormField>
              <FormField
                label={t("modal.form.startDate")}
                disabled={isTentative}
              >
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
              <FormField label={t("modal.form.endDate")} disabled={isTentative}>
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
                  label={t("modal.form.tentativeDates")}
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
              <FormField
                label={t("modal.form.fullDays")}
                disabled={isTentative}
              >
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
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="font-semibold mb-2">
                  {t("modal.form.notesTitle")}
                </div>
                <InputBox
                  as="textarea"
                  className="w-full flex-1 min-h-0 resize-none"
                  value={trip.notes}
                  onChange={(e: { target: { value: string } }) =>
                    onChange({ ...trip, notes: e.target.value })
                  }
                  placeholder={t("modal.form.notesPlaceholder")}
                />
              </div>
            </div>
            {/* Right: Selectable sections */}
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
              <ParticipantsSection
                selectedParticipants={selectedParticipantProfiles}
                onEdit={() => setParticipantModalOpen(true)}
                onRemove={(uid) =>
                  onChange({
                    ...trip,
                    participants: (trip.participants || []).filter(
                      (p) => p !== uid,
                    ),
                  })
                }
              />
              <CategoriesSection
                selectedCategories={trip.categories || []}
                onEdit={() => setCategoryModalOpen(true)}
                onRemove={(category) =>
                  onChange({
                    ...trip,
                    categories: (trip.categories || []).filter(
                      (c) => c !== category,
                    ),
                  })
                }
              />
              <TagsSection
                selectedTags={trip.tags || []}
                onEdit={() => {
                  setTagModalOpen(true);
                }}
                onRemove={(tag) =>
                  onChange({
                    ...trip,
                    tags: (trip.tags || []).filter((t) => t !== tag),
                  })
                }
              />
            </div>
          </div>
          {/* Actions */}
          <div className="w-full flex justify-end px-6 pb-4">
            <ModalActions
              onCancel={onClose}
              submitIcon={
                isEditing ? (
                  <ICONS.save className="inline" />
                ) : (
                  <ICONS.add className="inline" />
                )
              }
              submitLabel={
                isEditing
                  ? t("modal.actions.saveChanges")
                  : t("modal.actions.addTrip")
              }
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
      <ParticipantSelectModal
        isOpen={participantModalOpen}
        selected={trip.participants || []}
        options={participantOptions}
        onClose={() => setParticipantModalOpen(false)}
        onChange={(newParticipants) => {
          onChange({ ...trip, participants: newParticipants });
        }}
      />
      <CategorySelectModal
        isOpen={categoryModalOpen}
        selected={trip.categories || []}
        options={formattedCategoryOptions}
        onClose={() => setCategoryModalOpen(false)}
        onChange={(newCategories) => {
          onChange({ ...trip, categories: newCategories as TripCategory[] });
        }}
      />
      <TagSelectModal
        isOpen={tagModalOpen}
        selected={trip.tags || []}
        options={formattedTagOptions}
        onClose={() => setTagModalOpen(false)}
        onChange={(newTags) => {
          onChange({ ...trip, tags: newTags as TripTag[] });
        }}
      />
    </>
  );
}
