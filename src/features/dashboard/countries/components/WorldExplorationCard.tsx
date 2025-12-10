import { Card } from "@components";
import { percent } from "@utils/number";

interface WorldExplorationCardProps {
  visited: number;
  total: number;
  loading?: boolean;
  onShowAllCountries?: () => void;
}

export function WorldExplorationCard({
  visited,
  total,
  loading = false,
  onShowAllCountries,
}: WorldExplorationCardProps) {
  return (
    <Card
      className="flex flex-col items-center mb-8 bg-surface shadow-lg p-6 cursor-pointer"
      loading={loading}
      skeletonLines={3}
      onClick={onShowAllCountries}
      title="Show all countries"
      aria-label="Show all countries"
    >
      {!loading && (
        <>
          <div className="text-2xl font-semibold mb-2">World Exploration</div>
          <div className="text-5xl font-bold text-primary mb-2">
            {visited} / {total}
          </div>
          <div className="text-lg text-gray-500 dark:text-gray-400">
            {percent(visited, total)} of countries visited
          </div>
          <div className="w-full mt-4">
            <div className="h-3 bg-surface rounded-full overflow-hidden">
              <div
                className="h-3 bg-primary rounded-full transition-all"
                style={{
                  width: `${(visited / total) * 100}%`,
                }}
              />
            </div>
          </div>          
        </>
      )}
    </Card>
  );
}
