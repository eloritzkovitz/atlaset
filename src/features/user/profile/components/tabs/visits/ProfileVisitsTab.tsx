import { useTranslation } from "react-i18next";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ActionButton, Card, EmptyListMessage, TabButton } from "@components";
import { CountryFlagGrid } from "@features/countries";
import { useAuth } from "@features/user/auth";
import type { UserProfile } from "../../../types";
import { getAllVisitedCountryCodes } from "../../../utils/countryTracking";

type VisitsTab = "visited" | "wantToVisit";

interface ProfileVisitsTabProps {
  profileUser: UserProfile;
}

export function ProfileVisitsTab({ profileUser }: ProfileVisitsTabProps) {
  const { t } = useTranslation("user");
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab: VisitsTab =
    searchParams.get("tab") === "wantToVisit" ? "wantToVisit" : "visited";

  const visitedCountryCodes = getAllVisitedCountryCodes(profileUser);
  const wantToVisitCountryCodes = profileUser.wantToVisitCountryCodes ?? [];

  const countryCodes =
    activeTab === "visited" ? visitedCountryCodes : wantToVisitCountryCodes;

  const isOwnProfile = currentUser?.uid === profileUser.uid;

  const handleTabChange = (tab: VisitsTab) => {
    if (tab === "visited") {
      searchParams.delete("tab");
    } else {
      searchParams.set("tab", "wantToVisit");
    }

    setSearchParams(searchParams, { replace: true });
  };

  const handleCompare = () => {
    navigate(`/users/${profileUser.username}/visits/compare`);
  };

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between pb-2 mb-4">
        <div className="flex gap-2">
          <TabButton
            active={activeTab === "visited"}
            onClick={() => handleTabChange("visited")}
          >
            {t("profile.visits.tabs.visited", "Visited")} (
            {visitedCountryCodes.length})
          </TabButton>

          <TabButton
            active={activeTab === "wantToVisit"}
            onClick={() => handleTabChange("wantToVisit")}
          >
            {t("profile.visits.tabs.wantToVisit", "Want to visit")} (
            {wantToVisitCountryCodes.length})
          </TabButton>
        </div>

        {!isOwnProfile && (
          <ActionButton
            onClick={handleCompare}
            icon={<FaArrowRightArrowLeft />}
            title={t("profile.visits.tabs.compare", "Compare")}
            rounded
          />
        )}
      </div>

      {countryCodes.length === 0 ? (
        <EmptyListMessage
          message={t("profile.visits.noCountries", "No countries yet.")}
        />
      ) : (
        <CountryFlagGrid countryCodes={countryCodes} size="64" />
      )}
    </Card>
  );
}
