import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card } from "@components";
import { CountryFlagGrid } from "@features/countries";
import { useMemo } from "react";

interface ProfileTravelSummaryCardProps {
  username: string;
  visitedCountryCodes: string[];
  wantToVisitCountryCodes: string[];
}

export function ProfileTravelSummaryCard({
  username,
  visitedCountryCodes,
  wantToVisitCountryCodes,
}: ProfileTravelSummaryCardProps) {
  const { t } = useTranslation("user");
  const navigate = useNavigate();

  // Randomly select up to 10 countries to display as a preview
  const previewCountryCodes = useMemo(
    () => [...visitedCountryCodes].sort(() => Math.random() - 0.5).slice(0, 10),
    [visitedCountryCodes],
  );

  // Navigate to the user's visits page when the card is clicked
  const handleViewVisits = () => {
    navigate(`/users/${username}/visits`);
  };

  return (
    <Card onClick={handleViewVisits}>
      <h2 className="text-xl font-bold">
        {t("profile.travel.title", "Travel Summary")}
      </h2>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <div className="text-2xl font-bold">{visitedCountryCodes.length}</div>

          <div className="text-sm text-muted">
            {t("profile.travel.visited", "Countries visited")}
          </div>
        </div>

        <div>
          <div className="text-2xl font-bold">
            {wantToVisitCountryCodes.length}
          </div>

          <div className="text-sm text-muted">
            {t("profile.travel.wantToVisit", "Want to visit")}
          </div>
        </div>
      </div>

      {previewCountryCodes.length > 0 && (
        <div className="mt-6">
          <CountryFlagGrid countryCodes={previewCountryCodes} size="64" />
        </div>
      )}
    </Card>
  );
}
