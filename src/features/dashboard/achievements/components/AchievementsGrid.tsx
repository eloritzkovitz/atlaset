import { useEffect, useState } from "react";
import { useTrips } from "@contexts/TripsContext";
import { useCountryData } from "@features/countries";
import { useVisitedCountries } from "@features/visits";
import { useHomeCountry } from "@features/user";
import { AchievementCard } from "./AchievementCard";
import { getMergedAchievements } from "../utils/achievements";
import type { Achievement, AchievementStatus } from "../../types";

export function AchievementsGrid() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const { countries } = useCountryData();
  const visited = useVisitedCountries();
  const { trips } = useTrips();
  const { homeCountry } = useHomeCountry();

  // Fetch achievements data on component mount
  useEffect(() => {
    fetch("/data/achievements.json")
      .then((res) => res.json())
      .then(setAchievements);
  }, []);

  // Tier-based backgrounds for tiered cards
  const tierBgClasses: Record<number, string> = {
    1: "bg-amber-600/30",
    2: "bg-gray-300/30",
    3: "bg-yellow-300/30",
    4: "bg-slate-200/30",
    5: "bg-cyan-200/30",
    6: "bg-purple-200/30",
  };

  // Status-based backgrounds for non-tiered cards
  const statusBgClasses: Record<AchievementStatus, string> = {
    locked: "bg-surface-alt/30",
    progress: "bg-surface-alt",
    completed: "bg-success/20",
  };

  return (
    <div className="p-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {getMergedAchievements(achievements, countries, visited, trips, homeCountry).map(
          (achievement) => {
            return (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                countries={countries}
                visited={visited}
                trips={trips}
                homeCountry={homeCountry}
                tierBgClasses={tierBgClasses}
                statusBgClasses={statusBgClasses}
              />
            );
          },
        )}
      </div>
    </div>
  );
}
