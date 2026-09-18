import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { TripGoogleMap } from "../components/TripsGoogleMap";
import { TripPhotoGallery } from "../../photos/components/TripPhotoGallery";
import { CategoriesList } from "../../core/components/CategoriesList";
import { TagsList } from "../../core/components/TagsList";
import { useTrips } from "../../core/context/TripsContext";
import { useTripNavigation } from "../../core/hooks/useTripNavigation";
import { TripModal } from "../../editor/components/TripModal";
import { useTripEditor } from "../../editor/hooks/useTripEditor";
import { useTripLocations } from "../../locations/hooks/useTripLocations";
import { useTripPermissions } from "../../sharing/hooks/useTripPermissions";

export default function TripDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const returnPath =
    typeof location.state?.from === "string" ? location.state.from : "/trips";

  const { trips, loading, sharedTripIds, duplicateTrip } = useTrips();
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
    mode: editorMode,
    overrides,
    setTrip,
    handleEdit,
    handleCustomize,
    handleSave,
    handleSaveOverrides,
    onClose,
  } = useTripEditor();

  const { canEdit, isParticipant } = useTripPermissions(trip);

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
          title={t("pageTitle", "Trips")}
          onBack={() => navigate(returnPath)}
        />

        <div className="mx-auto space-y-6">
          <TripHeader
            trip={trip}
            onEdit={() => handleEdit(trip)}
            onCustomize={() => handleCustomize(trip)}
            onDuplicate={() => duplicateTrip(trip)}
            canEdit={canEdit}
            canCustomize={isParticipant}
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

          <TripDestinationsCard
            locations={locations}
            loading={locationsLoading}
          />

          {/* Google My Map */}
          {trip.googleMapsUrl && <TripGoogleMap url={trip.googleMapsUrl} />}

          <TripPhotoGallery
            tripId={trip.id}
            photos={trip.photos ?? []}
            photoAlbumUrl={trip.photoAlbumUrl}
            readOnly
          />

          {/* Details */}
          <Card title={t("sections.details", "Details")}>
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
                message={t("editor.details.notes.none", "No notes available.")}
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
          mode={editorMode}
          overrides={overrides}
          onChange={setTrip}
          onSave={handleSave}
          onSaveOverrides={handleSaveOverrides}
          onClose={onClose}
        />
      )}
    </>
  );
}
