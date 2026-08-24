import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Timezone } from "@features/countries/types";
import { getCurrentTimeFromOffset } from "@utils";
import { ExploreListGrid } from "../../core/components/ExploreListGrid";

interface TimezonesGridProps {
  timezones: Timezone[];
}

export const TimezonesGrid: React.FC<TimezonesGridProps> = ({ timezones }) => {
  const { t } = useTranslation("dashboard");
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ExploreListGrid
      items={timezones}
      getCode={(item) => item.code}
      getName={(item) => getCurrentTimeFromOffset(item.offsetMinutes)}
      toLink={(item) => `/explore/timezones/${encodeURIComponent(item.code)}`}
      headers={{
        codeLabel: t("timezones.columns.offset", {
          defaultValue: "UTC offset",
        }),
        nameLabel: t("timezones.columns.currentTime", {
          defaultValue: "Current time",
        }),
      }}
      searchPlaceholder={t("timezones.searchPlaceholder", {
        defaultValue: "Search by UTC offset",
      })}
      emptyMessage={t("timezones.empty", {
        defaultValue: "Timezone not found.",
      })}
    />
  );
};
