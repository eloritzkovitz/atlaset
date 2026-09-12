import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Container,
  EmptyListMessage,
  LoadingSpinner,
  PageHeader,
  SectionHeader,
} from "@components";
import { EMPTY_NUMBER_ARRAY } from "@constants/arrays";
import { usePageTitle } from "@hooks";
import { TripDestinationsCard } from "../components/TripDestinationsCard";
import { TripHeader } from "../components/TripHeader";
import { TripPhotoGallery } from "../../photos/components/TripPhotoGallery";
import { CategoriesList } from "../../core/components/CategoriesList";
import { ParticipantsList } from "../../core/components/ParticipantsList";
import { TagsList } from "../../core/components/TagsList";
import { useTrips } from "../../core/context/TripsContext";
import { useTripLocations } from "../../core/hooks/useTripLocations";
import { useTripNavigation } from "../../core/hooks/useTripNavigation";
import { TripModal } from "../../editor/components/TripModal";
import { useTripEditor } from "../../editor/hooks/useTripEditor";

export default function TripDetailsPage() {
  const navigate = useNavigate();
  const { trips, loading, sharedTripIds } = useTrips();
  const { t } = useTranslation("trips");

  const { tripId } = useParams<{ tripId: string }>();
  const trip = trips.find((trip) => trip.id === tripId);

  const { previousTrip, nextTrip } = useTripNavigation(trips, trip);

  usePageTitle(trip ? trip.name : t("pageTitle", "Trip Details"));

  const { locations, loading: locationsLoading } = useTripLocations(
    trip?.locationIds ?? EMPTY_NUMBER_ARRAY,
  );

  const {
    isOpen: isEditorOpen,
    trip: editingTrip,
    setTrip,
    handleEdit,
    handleSave,
    onClose,
  } = useTripEditor();

  if (loading) {
    return (
      <Container className="mt-12">
        <LoadingSpinner message={t("loading", "Loading trip...")} />
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container className="mt-12">
        <PageHeader
          title={t("notFound", "Trip not found")}
          fallbackPath="/trips"
        />
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-12">
        <PageHeader
          title={t("pageTitle", "My Trips")}
          onBack={() => navigate("/trips")}
        />

        <div className="mx-auto space-y-6">
          {/* Trip header */}
          <TripHeader
            trip={trip}
            onEdit={() => handleEdit(trip)}
            sharedWithMe={sharedTripIds.has(trip.id)}
            navigation={{
              previous: previousTrip
                ? {
                    label: previousTrip.name,
                    onClick: () => navigate(`/trips/${previousTrip.id}`),
                  }
                : undefined,
              next: nextTrip
                ? {
                    label: nextTrip.name,
                    onClick: () => navigate(`/trips/${nextTrip.id}`),
                  }
                : undefined,
            }}
          />

          {/* Destinations */}
          <TripDestinationsCard
            locations={locations}
            loading={locationsLoading}
          />

          {/* Photos */}
          <TripPhotoGallery
            tripId={trip.id}
            photos={trip.photos ?? []}
            photoAlbumUrl={trip.photoAlbumUrl}
            readOnly
          />

          {/* Details */}
          <Card title={t("sections.details", "Details")}>
            <SectionHeader>
              {t("fields.participants", "Participants")} (
              {trip.participants?.length ?? 0})
            </SectionHeader>
            <ParticipantsList uids={trip.participants ?? []} />

            <SectionHeader title={t("fields.categories", "Categories")} />
            <CategoriesList
              categories={trip.categories ?? []}
              limit={trip.categories?.length}
            />

            <SectionHeader title={t("fields.tags", "Tags")} />
            <TagsList tags={trip.tags ?? []} limit={trip.tags?.length} />
          </Card>

          {/* Notes */}
          <Card title={t("fields.notes", "Notes")}>
            {trip.notes ? (
              <p className="whitespace-pre-line text-muted">{trip.notes}</p>
            ) : (
              <EmptyListMessage
                message={t("editor.overview.noNotes", "No notes available.")}
              />
            )}
          </Card>
        </div>
      </Container>

      {/* Trip editor */}
      {editingTrip && (
        <TripModal
          isOpen={isEditorOpen}
          trip={editingTrip}
          onChange={setTrip}
          onSave={handleSave}
          onClose={onClose}
          isEditing
        />
      )}
    </>
  );
}
