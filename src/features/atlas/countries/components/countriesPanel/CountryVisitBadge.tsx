import { Tooltip } from "@components";

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
      <Tooltip content="Past visit" position="top">
        <span className="py-0.5 text-muted font-bold">({count})</span>
      </Tooltip>
    );
  }
  return revisit ? (
    <Tooltip content="Revisit" position="top">
      <span className="py-0.5 text-warning font-bold">+1 ({count})</span>
    </Tooltip>
  ) : (
    <Tooltip content="First visit" position="top">
      <span className="py-0.5 text-success font-bold">NEW</span>
    </Tooltip>
  );
}
