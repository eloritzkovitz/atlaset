interface TripsByMonthTableRowProps {
  month: any;
  color: string;
  totalTripsForMonth: number;
}

export function TripsByMonthTableRow({
  month,
  color,
  totalTripsForMonth,
}: TripsByMonthTableRowProps) {
  return (
    <tr className="border-t border-gray-800">
      <td className="py-1 flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ background: color }}
        />
        {month.name}
      </td>
      <td className="py-1">{month.local}</td>
      <td className="py-1">{month.abroad}</td>
      <td className="py-1">{month.total}</td>
      <td className="py-1">
        {totalTripsForMonth > 0
          ? `${((month.total / totalTripsForMonth) * 100).toFixed(1)}%`
          : "0%"}
      </td>
    </tr>
  );
}
