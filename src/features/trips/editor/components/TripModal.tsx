import { useMemo, useState } from "react";
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
import { useUserFriends } from "@features/user/friends/hooks/useUserFriends";
import { useFriendProfiles } from "@features/user/friends/hooks/useFriendProfiles";
import { useDisclosure } from "@hooks";
import { CategorySelectModal } from "./selects/CategorySelectModal";
import { DestinationSelectModal } from "./selects/DestinationSelectModal";
import { ParticipantSelectModal } from "./selects/ParticipantSelectModal";
import { TagSelectModal } from "./selects/TagSelectModal";
import { TripDestinationsTab } from "./tabs/destinations/TripDestinationsTab";
import { TripDetailsTab } from "./tabs/details/TripDetailsTab";
import { TripOverviewTab } from "./tabs/overview/TripOverviewTab";
import { useTripFilters } from "../../core/hooks/useTripFilters";
import type { Trip, TripCategory, TripTag } from "../../core/types";
import { getAutoTripStatus } from "../../core/utils/trips";
import "./TripModal.css";
import { TripPhotosTab } from "./tabs/photos/TripPhotosTab";

type TripTab = "overview" | "details" | "destinations" | "photos";

interface TripModalProps {
  isOpen: boolean;
  trip: Trip | null;
  onChange: (trip: Trip) => void;
  onSave: (trip: Trip) => Promise<void>;
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
  const { friends } = useUserFriends();
  const { categoryOptions, tagOptions } = useTripFilters();

  const countryModal = useDisclosure(false);
  const destinationModal = useDisclosure(false);
  const participantModal = useDisclosure(false);
  const categoryModal = useDisclosure(false);
  const tagModal = useDisclosure(false);

  const [activeTab, setActiveTab] = useState<TripTab>("overview");

  const [isTentative, setIsTentative] = useState(
    !!(isEditing && trip && getAutoTripStatus(trip) === "planned"),
  );

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

  const selectedParticipantProfiles = useMemo(() => {
    if (!trip?.participants) return [];

    return friendProfiles.filter((profile) =>
      trip.participants?.includes(profile.uid),
    );
  }, [friendProfiles, trip]);

  const formattedCategoryOptions = useMemo(
    () =>
      categoryOptions.map((opt) => ({
        value: opt.value as TripCategory,
        label: opt.label,
      })),
    [categoryOptions],
  );

  const formattedTagOptions = useMemo(
    () =>
      tagOptions.map((opt) => ({
        value: opt.value as TripTag,
        label: opt.label,
      })),
    [tagOptions],
  );

  if (!trip) return null;

  const selectedCountries = trip.countryCodes
    .map((isoCode) => getCountryByIsoCode(isoCode, { countries }))
    .filter(Boolean);

  const tabs: TabControlItem<TripTab>[] = [
    {
      value: "overview",
      label: t("sections.overview"),
    },
    {
      value: "details",
      label: t("sections.details"),
    },
    {
      value: "destinations",
      label: t("sections.destinations"),
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-[900px] min-w-[900px] max-w-[900px] h-[92vh] flex flex-col"
        disableClose={
          countryModal.isOpen ||
          destinationModal.isOpen ||
          participantModal.isOpen ||
          categoryModal.isOpen ||
          tagModal.isOpen
        }
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

        {/* Tabs */}
        <TabControl tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        <form
          className="flex flex-col flex-1 min-h-0"
          onSubmit={(e) => {
            e.preventDefault();

            if (!isValid) return;

            onSave(trip);
          }}
        >
          {/* Tab content */}
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

              {activeTab === "details" && (
                <TripDetailsTab
                  trip={trip}
                  selectedParticipantProfiles={selectedParticipantProfiles}
                  onChange={onChange}
                  onEditParticipants={participantModal.open}
                  onEditCategories={categoryModal.open}
                  onEditTags={tagModal.open}
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

              {activeTab === "photos" && (
                <TripPhotosTab trip={trip} onChange={onChange} />
              )}
            </div>
          </div>

          {/* Actions */}
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
        onChange={(newCodes) => {
          onChange({
            ...trip,
            countryCodes: newCodes,
          });
        }}
      />

      <DestinationSelectModal
        isOpen={destinationModal.isOpen}
        selected={trip.locationIds ?? []}
        countryCodes={trip.countryCodes}
        onChange={(locationIds) =>
          onChange({
            ...trip,
            locationIds,
          })
        }
        onClose={() => destinationModal.close()}
      />

      <ParticipantSelectModal
        isOpen={participantModal.isOpen}
        selected={trip.participants || []}
        options={participantOptions}
        onClose={participantModal.close}
        onChange={(newParticipants) => {
          onChange({
            ...trip,
            participants: newParticipants,
          });
        }}
      />

      <CategorySelectModal
        isOpen={categoryModal.isOpen}
        selected={trip.categories || []}
        options={formattedCategoryOptions}
        onClose={categoryModal.close}
        onChange={(newCategories) => {
          onChange({
            ...trip,
            categories: newCategories as TripCategory[],
          });
        }}
      />

      <TagSelectModal
        isOpen={tagModal.isOpen}
        selected={trip.tags || []}
        options={formattedTagOptions}
        onClose={tagModal.close}
        onChange={(newTags) => {
          onChange({
            ...trip,
            tags: newTags as TripTag[],
          });
        }}
      />
    </>
  );
}
