import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalActions, ModalHeader, TabControl } from "@components";
import { ICONS } from "@constants/icons";
import {
  CountrySelectModal,
  getCountryByIsoCode,
  useCountryData,
} from "@features/countries";
import { useDisclosure } from "@hooks";
import { CategorySelectModal } from "./selects/CategorySelectModal";
import { DestinationSelectModal } from "./selects/DestinationSelectModal";
import { TagSelectModal } from "./selects/TagSelectModal";
import { TripDestinationsTab } from "./tabs/destinations/TripDestinationsTab";
import { TripDetailsTab } from "./tabs/details/TripDetailsTab";
import { TripItineraryTab } from "./tabs/itinerary/TripItineraryTab";
import { TripOverviewTab } from "./tabs/overview/TripOverviewTab";
import { TripPeopleTab } from "./tabs/people/TripPeopleTab";
import { TripPhotosTab } from "./tabs/photos/TripPhotosTab";
import { getTripModalTabs, type TripTab } from "./tripModalTabs";
import { useTripFilters } from "../../core/hooks/useTripFilters";
import type { Trip, TripCategory, TripTag } from "../../core/types";
import { getAutoTripStatus } from "../../core/utils/trips";
import { useTripPeople } from "../../sharing/hooks/useTripPeople";
import type { TripOverrides, TripShares } from "../../sharing/types";
import { getTripOverrides } from "../../sharing/utils/tripOverrides";
import "./TripModal.css";

export type TripModalMode = "add" | "edit" | "custom";

interface TripModalProps {
  isOpen: boolean;
  trip: Trip | null;
  mode: TripModalMode;
  overrides?: TripOverrides;
  onChange: (trip: Trip) => void;
  onSave: (trip: Trip, shares: TripShares) => Promise<void>;
  onSaveOverrides?: (overrides: TripOverrides) => Promise<void>;
  onClose: () => void;
}

/** Renders the add/edit/customize trip modal. */
export function TripModal({
  isOpen,
  trip,
  mode,
  overrides,
  onChange,
  onSave,
  onSaveOverrides,
  onClose,
}: TripModalProps) {
  const { t } = useTranslation("trips");
  const { countries } = useCountryData();
  const { categoryOptions, tagOptions } = useTripFilters();

  const countryModal = useDisclosure(false);
  const destinationModal = useDisclosure(false);
  const categoryModal = useDisclosure(false);
  const tagModal = useDisclosure(false);

  const [activeTab, setActiveTab] = useState<TripTab>("overview");
  const [customTrip, setCustomTrip] = useState<Trip | null>(null);
  const [isTentative, setIsTentative] = useState(false);

  const isEditing = mode === "edit";
  const isCustomizing = mode === "custom";

  // Reset the active tab to "overview" whenever the modal is opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
    }
  }, [isOpen]);

  // Update the custom trip and tentative status whenever the modal is opened or the trip changes
  useEffect(() => {
    if (!isOpen || !trip) {
      return;
    }

    const effectiveTrip = mode === "custom" ? { ...trip, ...overrides } : trip;

    setCustomTrip(mode === "custom" ? effectiveTrip : null);

    setIsTentative(
      mode !== "add" && getAutoTripStatus(effectiveTrip) === "planned",
    );
  }, [isOpen, trip, mode, overrides]);

  const {
    people,
    searchResults,
    search,
    addPerson,
    addParticipant,
    updatePermission,
    handleParticipantChange,
    removePerson,
    tripShares,
    searchLoading,
  } = useTripPeople({
    trip,
    isOpen,
    isEditing,
  });

  const selectOptions = {
    categories: categoryOptions.map((option) => ({
      value: option.value as TripCategory,
      label: option.label,
    })),
    tags: tagOptions.map((option) => ({
      value: option.value as TripTag,
      label: option.label,
    })),
  };

  const editableTrip = isCustomizing ? customTrip : trip;

  if (!trip || !editableTrip) {
    return null;
  }

  const currentTrip = trip;
  const currentEditableTrip = editableTrip;

  const selectedCountries = currentEditableTrip.countryCodes
    .map((isoCode) => getCountryByIsoCode(isoCode, { countries }))
    .filter(Boolean);

  const tabs = getTripModalTabs(mode, t);

  const isValid = isCustomizing
    ? currentEditableTrip.countryCodes.length > 0 &&
      (isTentative ||
        (!!currentEditableTrip.startDate && !!currentEditableTrip.endDate))
    : !!currentEditableTrip.name.trim() &&
      currentEditableTrip.countryCodes.length > 0 &&
      (isTentative ||
        (!!currentEditableTrip.startDate && !!currentEditableTrip.endDate));

  const isModalOpen =
    countryModal.isOpen ||
    destinationModal.isOpen ||
    categoryModal.isOpen ||
    tagModal.isOpen;

  function handleChange(nextTrip: Trip) {
    if (isCustomizing) {
      setCustomTrip(nextTrip);
      return;
    }

    onChange(nextTrip);
  }

  async function handleSubmit() {
    if (!isValid) {
      return;
    }

    if (isCustomizing) {
      if (!onSaveOverrides) {
        return;
      }

      const nextOverrides = getTripOverrides(currentTrip, currentEditableTrip);

      await onSaveOverrides(nextOverrides);
      return;
    }

    await onSave(currentEditableTrip, tripShares);
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-[900px] min-w-[900px] max-w-[900px] h-[92vh] flex flex-col"
        disableClose={isModalOpen}
        draggable
      >
        <ModalHeader
          title={
            <>
              <ICONS.trips />
              {mode === "add"
                ? t("editor.titleAdd")
                : mode === "edit"
                  ? t("editor.titleEdit")
                  : t("editor.titleCustomize")}
            </>
          }
        />

        <TabControl tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <form
          className="flex flex-col flex-1 min-h-0"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <div className="flex-1 min-h-0 overflow-y-auto w-full">
            <div className="w-full p-4">
              {activeTab === "overview" && (
                <TripOverviewTab
                  trip={currentEditableTrip}
                  selectedCountries={selectedCountries}
                  onEditCountries={countryModal.open}
                  isTentative={isTentative}
                  onChange={handleChange}
                  onTentativeChange={setIsTentative}
                />
              )}

              {activeTab === "destinations" && (
                <TripDestinationsTab
                  trip={currentEditableTrip}
                  onEditLocations={destinationModal.open}
                  onChange={handleChange}
                />
              )}

              {activeTab === "itinerary" && (
                <TripItineraryTab
                  trip={currentEditableTrip}
                  onChange={handleChange}
                />
              )}

              {activeTab === "details" && (
                <TripDetailsTab
                  trip={currentEditableTrip}
                  onChange={handleChange}
                  onEditCategories={categoryModal.open}
                  onEditTags={tagModal.open}
                />
              )}

              {activeTab === "people" && (
                <TripPeopleTab
                  people={people}
                  searchResults={searchResults}
                  onSearch={search}
                  onAdd={(profile) => addPerson(profile, onChange)}
                  onAddParticipant={(profile) =>
                    addParticipant(profile, onChange)
                  }
                  onRemove={(uid) => removePerson(uid, onChange)}
                  onPermissionChange={updatePermission}
                  onParticipantChange={(uid, participant) =>
                    handleParticipantChange(uid, participant, onChange)
                  }
                  searchLoading={searchLoading}
                />
              )}

              {activeTab === "photos" && (
                <TripPhotosTab
                  trip={currentEditableTrip}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>

          <div className="w-full flex justify-end px-6 pb-4 shrink-0">
            <ModalActions
              onCancel={onClose}
              submitIcon={
                isEditing || isCustomizing ? (
                  <ICONS.save className="inline" />
                ) : (
                  <ICONS.add className="inline" />
                )
              }
              submitLabel={
                mode === "add"
                  ? t("editor.actions.addTrip")
                  : t("editor.actions.saveChanges")
              }
              disabled={!isValid}
            />
          </div>
        </form>
      </Modal>

      <CountrySelectModal
        isOpen={countryModal.isOpen}
        selected={currentEditableTrip.countryCodes}
        options={countries}
        onClose={countryModal.close}
        onChange={(countryCodes) => {
          handleChange({
            ...currentEditableTrip,
            countryCodes,
          });
        }}
      />

      <DestinationSelectModal
        isOpen={destinationModal.isOpen}
        selected={currentEditableTrip.locationIds ?? []}
        countryCodes={currentEditableTrip.countryCodes}
        onChange={(locationIds) => {
          handleChange({
            ...currentEditableTrip,
            locationIds,
          });
        }}
        onClose={destinationModal.close}
      />

      <CategorySelectModal
        isOpen={categoryModal.isOpen}
        selected={currentEditableTrip.categories || []}
        options={selectOptions.categories}
        onClose={categoryModal.close}
        onChange={(categories) => {
          handleChange({
            ...currentEditableTrip,
            categories: categories as TripCategory[],
          });
        }}
      />

      <TagSelectModal
        isOpen={tagModal.isOpen}
        selected={currentEditableTrip.tags || []}
        options={selectOptions.tags}
        onClose={tagModal.close}
        onChange={(tags) => {
          handleChange({
            ...currentEditableTrip,
            tags: tags as TripTag[],
          });
        }}
      />
    </>
  );
}
