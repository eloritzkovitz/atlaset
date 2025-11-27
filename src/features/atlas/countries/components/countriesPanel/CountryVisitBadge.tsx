interface CountryVisitBadgeProps {
  revisit: boolean;
  count: number;
}

export function CountryVisitBadge({ revisit, count }: CountryVisitBadgeProps) {
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
