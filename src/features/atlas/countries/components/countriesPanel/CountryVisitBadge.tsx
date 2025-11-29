interface CountryVisitBadgeProps {
  revisit: boolean;
  count: number;
  direction: "asc" | "desc" | null;
}

export function CountryVisitBadge({
  revisit,
  count,
  direction,
}: CountryVisitBadgeProps) {
  if (direction === "desc") {
    return (
      <span className="py-0.5 text-gray-400 font-bold" title="Past visit">
        ({count})
      </span>
    );
  }
  return revisit ? (
    <span className="py-0.5 text-yellow-600 font-bold" title="Revisit">
      +1 ({count})
    </span>
  ) : (
    <span className="py-0.5 text-green-600 font-bold" title="First visit">
      NEW
    </span>
  );
}
