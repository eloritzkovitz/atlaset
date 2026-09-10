import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Chip, CollapsibleHeader, DirectionalIcon } from "@components";
import type { Visit } from "@features/visits/types";

const DEFAULT_BADGE_COLOR = "bg-muted/20 text-foreground";

interface VisitSectionProps {
  icon: React.ReactNode;
  title: ReactNode;
  count?: number;
  visits: Visit[];
  badgeColorClass?: string;
  onVisitClick?: (tripId: string) => void;
}

export function VisitSection({
  icon,
  title,
  count,
  visits,
  badgeColorClass = DEFAULT_BADGE_COLOR,
  onVisitClick,
}: VisitSectionProps) {
  const { t } = useTranslation("countries");
  const [expanded, setExpanded] = useState(visits.length > 0);

  const sortedVisits = [...visits].reverse();

  return (
    <div className="px-4">
      <CollapsibleHeader
        icon={icon}
        label={title}
        count={count}
        expanded={expanded}
        onToggle={() => setExpanded((e) => !e)}
      >
        <ul className="mt-2 space-y-1.5 px-2">
          {sortedVisits.map((visit) => {
            const isClickable = Boolean(visit.tripId && onVisitClick);

            return (
              <li
                key={visit.tripId || `${visit.yearRange}-${visit.tripName}`}
                onClick={() => visit.tripId && onVisitClick?.(visit.tripId)}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  isClickable
                    ? "cursor-pointer hover:bg-surface-hover bg-input/50"
                    : "bg-input/25"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Chip
                    className={`text-xs font-semibold transition-colors hover:bg-muted/40 ${badgeColorClass}`}
                  >
                    {visit.yearRange || t("formatting.date.tbd")}
                  </Chip>

                  {visit.tripName && (
                    <span className="truncate font-medium text-muted transition-colors group-hover:text-foreground">
                      {visit.tripName}
                    </span>
                  )}
                </div>

                {isClickable && (
                  <DirectionalIcon
                    variant="chevron"
                    direction="next"
                    className="h-3 w-3 shrink-0 text-muted/50 transition-transform ltr:group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                  />
                )}
              </li>
            );
          })}
        </ul>
      </CollapsibleHeader>
    </div>
  );
}
