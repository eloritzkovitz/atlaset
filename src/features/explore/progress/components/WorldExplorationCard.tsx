import { useTranslation } from "react-i18next";
import { Card, ProgressBar } from "@components";
import { useAccessibility } from "@features/settings/accessibility";
import { useAnimatedNumber } from "@hooks";
import { formatPercent } from "@utils";

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
  const { animationsEnabled } = useAccessibility();
  const { t } = useTranslation("explore");

  const animatedVisited = useAnimatedNumber(animationsEnabled, visited, 640);
  const formattedPercent = formatPercent(animatedVisited, total, {
    decimals: 1,
  });
  const title = t("progress.worldTitle", "World Exploration");

  return (
    <Card
      className="flex cursor-pointer flex-col items-center p-6 transition-transform duration-200 hover:scale-101 hover:bg-primary/20 md:col-span-2"
      loading={loading}
      skeletonLines={3}
      onClick={onShowAllCountries}
      aria-label={t("countries.showAllCountries", "Show all countries")}
    >
      {!loading && (
        <>
          <div className="mb-2 text-2xl font-semibold">{title}</div>

          <div className="mb-2 text-5xl font-bold text-primary">
            <span dir="ltr">
              {animatedVisited} / {total}
            </span>
          </div>

          <div className="text-lg text-muted">
            {t(
              "progress.ofCountriesVisited",
              "{{percent}} of countries visited",
              {
                percent: formattedPercent,
              },
            )}
          </div>

          <ProgressBar
            value={animatedVisited}
            max={total}
            label={title}
            size="lg"
            className="mt-4"
            animated={animationsEnabled}
          />
        </>
      )}
    </Card>
  );
}
