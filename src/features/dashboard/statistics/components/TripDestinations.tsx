import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaFlag, FaMedal } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  Chip,
  DirectionalIcon,
  Table,
  Tooltip,
  type TableColumn,
} from "@components";
import { CountryWithFlag } from "@features/countries";
import { VISITED_COUNTRIES_TABLE_COLUMNS } from "../constants/statistics";
import { useTripsStats } from "../hooks/useTripsStats";
import type { VisitedCountryRankRow } from "../types";
import { translateColumns } from "../utils/columns";
import { getCountryRoute } from "../../navigation/utils/dashboardNavigation";

const MEDAL_CONFIG: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-amber-600",
};

export function TripDestinations() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const { visitedCountriesRanking } = useTripsStats();

  const tableData: VisitedCountryRankRow[] = useMemo(
    () =>
      visitedCountriesRanking.map((item, idx) => ({ ...item, rank: idx + 1 })),
    [visitedCountriesRanking],
  );

  const columns: TableColumn<VisitedCountryRankRow>[] = useMemo(() => {
    const renders: Record<
      string,
      (row: VisitedCountryRankRow) => React.ReactNode
    > = {
      rank: (row) => {
        const medalColor = MEDAL_CONFIG[row.rank];
        return medalColor ? (
          <div className={`flex items-center gap-1.5 font-bold ${medalColor}`}>
            <FaMedal className="w-4 h-4 drop-shadow-sm" />
            <span className="text-xs font-semibold pl-1">#{row.rank}</span>
          </div>
        ) : (
          <span className="text-muted text-xs font-semibold pl-6">
            #{row.rank}
          </span>
        );
      },
      country: (row) => (
        <CountryWithFlag
          isoCode={row.country.isoCode}
          name={row.country.name}
        />
      ),
      years: (row) => (
        <div className="flex flex-wrap gap-1.5">
          {row.years.map((year) => {
            const yearVisits = row.tripsByYear?.[year] || [];
            const tooltipText = yearVisits.map((v) => v.tripName).join("\n");

            return (
              <Tooltip key={year} content={tooltipText} position="top">
                <Chip className="bg-muted/25 text-xs font-semibold cursor-help transition-colors hover:bg-muted/40">
                  {year}
                </Chip>
              </Tooltip>
            );
          })}
        </div>
      ),
    };

    const baseColumns = translateColumns(
      VISITED_COUNTRIES_TABLE_COLUMNS,
      t,
    ).map((col) => ({
      ...col,
      render: renders[col.key as string] || col.render,
    }));

    return [
      ...baseColumns,
      {
        key: "navigation" as keyof VisitedCountryRankRow,
        label: "",
        sortable: false,
        render: () => (
          <div className="flex justify-end pr-2 text-muted/50 group-hover:text-foreground transition-all group-hover:translate-x-0.5">
            <DirectionalIcon
              variant="chevron"
              direction="next"
              className="w-3.5 h-3.5"
            />
          </div>
        ),
      },
    ];
  }, [t]);

  // Handle row click to navigate to the country details page
  const handleCountryClick = (row: VisitedCountryRankRow) => {
    const route = getCountryRoute(
      row.country.region,
      row.country.subregion,
      row.country.isoCode,
    );
    navigate(`${route}?tab=visits`);
  };

  return (
    <Table
      columns={columns}
      data={tableData}
      onRowClick={handleCountryClick}
      striped
      showExport
      exportFilename="most-visited-countries.csv"
      cardProps={{
        icon: FaFlag,
        iconClass: "text-orange-500",
        title: t("statistics.visits.title", {
          defaultValue: "Most visited countries",
        }),
        subtitle: t("statistics.visits.subtitle", {
          defaultValue: "Ranked by visit count based on completed abroad trips",
        }),
      }}
    />
  );
}
