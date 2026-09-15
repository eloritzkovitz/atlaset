import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalActions,
  ModalHeader,
  TabControl,
  type TabControlItem,
} from "@components";
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
import { useTripFilters } from "../../core/hooks/useTripFilters";
import type { Trip, TripCategory, TripTag } from "../../core/types";
import { getAutoTripStatus } from "../../core/utils/trips";
import { useTripPeople } from "../../sharing/hooks/useTripPeople";
import type { TripShares } from "../../sharing/types";
import "./TripModal.css";

type TripTab =
  | "overview"
  | "destinations"
  | "itinerary"
  | "details"
  | "people"
  | "photos";

interface TripModalProps {
  isOpen: boolean;
  trip: Trip | null;
  onChange: (trip: Trip) => void;
  onSave: (trip: Trip, shares: TripShares) => Promise<void>;
  onClose: () => void;
  isEditing: boolean;
}

/** Renders the add/edit trip modal. */
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
  const { categoryOptions, tagOptions } = useTripFilters();

  const countryModal = useDisclosure(false);
  const destinationModal = useDisclosure(false);
  const categoryModal = useDisclosure(false);
  const tagModal = useDisclosure(false);

  const [activeTab, setActiveTab] = useState<TripTab>("overview");

  const [isTentative, setIsTentative] = useState(
    !!(isEditing && trip && getAutoTripStatus(trip) === "planned"),
  );

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

  const formattedCategoryOptions = categoryOptions.map((option) => ({
    value: option.value as TripCategory,
    label: option.label,
  }));

  const formattedTagOptions = tagOptions.map((option) => ({
    value: option.value as TripTag,
    label: option.label,
  }));

  if (!trip) {
    return null;
  }

  const currentTrip = trip;

  const selectedCountries = trip.countryCodes
    .map((isoCode) => getCountryByIsoCode(isoCode, { countries }))
    .filter(Boolean);

  const tabs: TabControlItem<TripTab>[] = [
    {
      value: "overview",
      label: t("sections.overview"),
    },
    {
      value: "destinations",
      label: t("sections.destinations"),
    },
    {
      value: "itinerary",
      label: t("sections.itinerary"),
    },
    {
      value: "details",
      label: t("sections.details"),
    },
    {
      value: "people",
      label: t("sections.people"),
    },
    {
      value: "photos",
      label: t("sections.photos"),
    },
  ];

  const isValid =
    !!trip.name.trim() &&
    trip.countryCodes.length > 0 &&
    (isTentative || (!!trip.startDate && !!trip.endDate));

  const isModalOpen =
    countryModal.isOpen ||
    destinationModal.isOpen ||
    categoryModal.isOpen ||
    tagModal.isOpen;

  async function handleSubmit() {
    if (!isValid) {
      return;
    }

    await onSave(currentTrip, tripShares);
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
              {isEditing ? t("editor.titleEdit") : t("editor.titleAdd")}
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
                  trip={trip}
                  isTentative={isTentative}
                  onChange={onChange}
                  onTentativeChange={setIsTentative}
                />
              )}

              {activeTab === "destinations" && (
                <TripDestinationsTab
                  trip={trip}
                  selectedCountries={selectedCountries}
                  onEditCountries={countryModal.open}
                  onEditLocations={destinationModal.open}
                  onChange={onChange}
                />
              )}

              {activeTab === "itinerary" && (
                <TripItineraryTab trip={trip} onChange={onChange} />
              )}

              {activeTab === "details" && (
                <TripDetailsTab
                  trip={trip}
                  onChange={onChange}
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
                <TripPhotosTab trip={trip} onChange={onChange} />
              )}
            </div>
          </div>

          <div className="w-full flex justify-end px-6 pb-4 shrink-0">
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
                  ? t("editor.actions.saveChanges")
                  : t("editor.actions.addTrip")
              }
              disabled={!isValid}
            />
          </div>
        </form>
      </Modal>

      <CountrySelectModal
        isOpen={countryModal.isOpen}
        selected={trip.countryCodes}
        options={countries}
        onClose={countryModal.close}
        onChange={(countryCodes) => {
          onChange({
            ...trip,
            countryCodes,
          });
        }}
      />

      <DestinationSelectModal
        isOpen={destinationModal.isOpen}
        selected={trip.locationIds ?? []}
        countryCodes={trip.countryCodes}
        onChange={(locationIds) => {
          onChange({
            ...trip,
            locationIds,
          });
        }}
        onClose={destinationModal.close}
      />

      <CategorySelectModal
        isOpen={categoryModal.isOpen}
        selected={trip.categories || []}
        options={formattedCategoryOptions}
        onClose={categoryModal.close}
        onChange={(categories) => {
          onChange({
            ...trip,
            categories: categories as TripCategory[],
          });
        }}
      />

      <TagSelectModal
        isOpen={tagModal.isOpen}
        selected={trip.tags || []}
        options={formattedTagOptions}
        onClose={tagModal.close}
        onChange={(tags) => {
          onChange({
            ...trip,
            tags: tags as TripTag[],
          });
        }}
      />
    </>
  );
}
