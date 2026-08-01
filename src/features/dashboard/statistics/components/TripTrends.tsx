import { MonthlyTrendsSection } from "./MonthlyTrendsSection";
import { YearlyTrendsSection } from "./YearlyTrendsSection";

export function TripTrends() {
  return (
    <div className="flex flex-col gap-8">
      <YearlyTrendsSection />
      <MonthlyTrendsSection />
    </div>
  );
}
