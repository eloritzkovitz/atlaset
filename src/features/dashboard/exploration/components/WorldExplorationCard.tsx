import { Card } from "@components";
import { useAnimatedNumber } from "@hooks";
import { percent } from "@utils/number";
import { useTranslation } from "react-i18next";

interface WorldExplorationCardProps {
  visited: number;
  total: number;
  loading?: boolean;
  onShowAllCountries?: () => void;
}

/** Renders the world exploration card. */
export function WorldExplorationCard({
  visited,
  total,
  loading = false,
  onShowAllCountries,
}: WorldExplorationCardProps) {
  const animatedVisited = useAnimatedNumber(visited, 640);
  const { t: tDashboard } = useTranslation("dashboard");

  return (
    <Card
      className="flex flex-col items-center p-6 cursor-pointer md:col-span-2 hover:bg-primary/20 hover:scale-101 transition-transform duration-200"
      loading={loading}
      skeletonLines={3}
      onClick={onShowAllCountries}
      aria-label={tDashboard("exploration.showAllCountries", "Show all countries")}
    >
      {!loading && (
        <>
          <div className="text-2xl font-semibold mb-2">{tDashboard("exploration.worldTitle", "World Exploration")}</div>
          <div className="text-5xl font-bold text-primary mb-2">
            <span dir="ltr">
              {animatedVisited} / {total}
            </span>
          </div>
          <div className="text-lg text-muted">
            {percent(animatedVisited, total)} {tDashboard("exploration.ofCountriesVisited", "of countries visited")}
          </div>
          <div className="w-full mt-4">
            <div className="h-3 bg-surface rounded-full overflow-hidden">
              <div
                className="h-3 bg-primary rounded-full transition-all"
                style={{
                  width: `${(animatedVisited / total) * 100}%`,
                }}
              />
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
