import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type IconType } from "react-icons";
import { Card, PieLegendCard } from "@components";
import { useScreenSize } from "@hooks";

const PieChart = lazy(() => import("@components/display/PieChart/PieChart"));

export interface PieDataItem {
  key: string;
  name: string;
  value: number;
  color: string;
}

interface TripPieChartCardProps {
  title: string;
  subtitle: string;
  icon: IconType;
  iconClass?: string;
  data: PieDataItem[];
}

export function TripPieChartCard({
  title,
  subtitle,
  icon,
  iconClass,
  data,
}: TripPieChartCardProps) {
  const { isLaptop } = useScreenSize();
  const { t } = useTranslation();

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data],
  );

  return (
    <Card icon={icon} iconClass={iconClass} title={title} subtitle={subtitle}>
      <div className="flex w-full flex-1 flex-col items-center justify-center p-2 pt-4">
        <div className="flex w-full flex-col items-center justify-evenly gap-6 sm:flex-row sm:gap-4">
          {/* Pie Chart Wrapper */}
          <div
            className={`relative flex aspect-square w-full max-w-[180px] items-center justify-center ${isLaptop ? "max-w-[160px]" : "max-w-[300px]"} `}
          >
            <Suspense
              fallback={
                <div className="text-muted text-sm">
                  {t("statistics.loading", { defaultValue: "Loading data..." })}
                </div>
              }
            >
              <PieChart
                labels={data.map((d) => d.name)}
                data={data.map((d) => d.value)}
                colors={data.map((d) => d.color)}
                hoveredIdx={hoveredIdx}
                setHoveredIdx={setHoveredIdx}
                size={isLaptop ? 200 : 300}
              />
            </Suspense>
          </div>

          {/* Vertical Legend */}
          <div className="flex w-full flex-col justify-center gap-2.5 sm:w-auto">
            {data.map((d, idx) => (
              <PieLegendCard
                key={d.key}
                label={d.name}
                color={d.color}
                percentage={total ? (d.value / total) * 100 : 0}
                isActive={hoveredIdx === idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                direction="horizontal"
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
