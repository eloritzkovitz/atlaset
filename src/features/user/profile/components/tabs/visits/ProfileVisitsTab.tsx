import { useTranslation } from "react-i18next";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  ActionButton,
  Card,
  EmptyListMessage,
  TabControl,
  type TabControlItem,
} from "@components";
import { CountryFlagGrid } from "@features/countries";
import { useAuth } from "@features/user/auth";
import { useQueryParam } from "@hooks";
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

  const [activeTab, setActiveTab] = useQueryParam<VisitsTab>("tab", "visited");

  const visitedCountryCodes = getAllVisitedCountryCodes(profileUser);
  const wantToVisitCountryCodes = profileUser.wantToVisitCountryCodes ?? [];

  const countryCodes =
    activeTab === "visited" ? visitedCountryCodes : wantToVisitCountryCodes;

  const isOwnProfile = currentUser?.uid === profileUser.uid;

  const tabs: TabControlItem<VisitsTab>[] = [
    {
      value: "visited",
      label: `${t("profile.visits.tabs.visited", "Visited")} (${visitedCountryCodes.length})`,
    },
    {
      value: "wantToVisit",
      label: `${t("profile.visits.tabs.wantToVisit", "Want to visit")} (${wantToVisitCountryCodes.length})`,
    },
  ];

  const handleCompare = () => {
    navigate(`/users/${profileUser.username}/visits/compare`);
  };

  return (
    <Card className="mt-6">
      <div className="flex items-center justify-between pb-2 mb-4">
        <div className="flex gap-2">
          <TabControl
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
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
