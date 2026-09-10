import type { Trip } from "@features/trips/core/types";
import type { UserProfile } from "@features/user/profile";
import { CategoriesSection } from "./CategoriesSection";
import { ParticipantsSection } from "./ParticipantsSection";
import { TagsSection } from "./TagsSection";

interface TripDetailsTabProps {
  trip: Trip;
  selectedParticipantProfiles: UserProfile[];
  onChange: (trip: Trip) => void;
  onEditParticipants: () => void;
  onEditCategories: () => void;
  onEditTags: () => void;
}

/** Renders the details tab for a trip. */
export function TripDetailsTab({
  trip,
  selectedParticipantProfiles,
  onChange,
  onEditParticipants,
  onEditCategories,
  onEditTags,
}: TripDetailsTabProps) {
  return (
    <div className="flex flex-col gap-3"> 
      <ParticipantsSection
        selectedParticipants={selectedParticipantProfiles}
        onEdit={onEditParticipants}
        onRemove={(uid) =>
          onChange({
            ...trip,
            participants: (trip.participants || []).filter(
              (participant) => participant !== uid,
            ),
          })
        }
      />

      <CategoriesSection
        selectedCategories={trip.categories || []}
        onEdit={onEditCategories}
        onRemove={(category) =>
          onChange({
            ...trip,
            categories: (trip.categories || []).filter(
              (item) => item !== category,
            ),
          })
        }
      />

      <TagsSection
        selectedTags={trip.tags || []}
        onEdit={onEditTags}
        onRemove={(tag) =>
          onChange({
            ...trip,
            tags: (trip.tags || []).filter((item) => item !== tag),
          })
        }
      />
    </div>
  );
}
