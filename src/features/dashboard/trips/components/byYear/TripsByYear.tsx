import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TRIP_TYPE_COLORS } from "../../constants/trips";
import { useTripsByYearStats } from "../../hooks/useTripsByYearStats";
import { DashboardCard } from "../../../components/DashboardCard";

export function TripsByYear() {
  const { tripsByYearData } = useTripsByYearStats();

  return (
    <DashboardCard>
      <div className="font-bold text-xl mb-4">Trips by Year</div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={tripsByYearData}>
            <XAxis dataKey="year" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="local" stackId="a" fill={TRIP_TYPE_COLORS[0]} name="Local" />
            <Bar
              dataKey="abroad"
              stackId="a"
              fill={TRIP_TYPE_COLORS[1]}
              name="Abroad"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left py-1">Year</th>
              <th className="text-left py-1">Local</th>
              <th className="text-left py-1">Abroad</th>
              <th className="text-left py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {tripsByYearData.map((yearData) => (
              <tr key={yearData.year} className="border-t border-gray-800">
                <td className="py-1">{yearData.year}</td>
                <td className="py-1">{yearData.local}</td>
                <td className="py-1">{yearData.abroad}</td>
                <td className="py-1">{yearData.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
