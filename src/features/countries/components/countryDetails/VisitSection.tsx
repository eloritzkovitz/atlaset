import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CollapsibleHeader, Chip } from "@components";
import type { Visit } from "@features/visits";

interface VisitSectionProps {
  icon: React.ReactNode;
  title: ReactNode;
  count?: number;
  visits: Visit[];
  onVisitClick?: (tripId: string) => void;
}

export function VisitSection({
  icon,
  title,
  count,
  visits,
  onVisitClick,
}: VisitSectionProps) {
  const { t } = useTranslation("countries");
  const [expanded, setExpanded] = useState(visits.length > 0);
  const titleText = typeof title === "string" ? title : "visits";

  return (
    <CollapsibleHeader
      icon={icon}
      label={title}
      count={count}
      expanded={expanded}
      onToggle={() => setExpanded((e) => !e)}
    >
      <ul className="ps-0">
        {[...visits].reverse().map((visit, i) => (
          <li key={`${titleText}-${i}`} className="my-2">
            <Chip
              className={`bg-surface-alt/80 flex items-center gap-2 px-3 py-2 ${onVisitClick ? "cursor-pointer" : ""}`}
              onClick={() => visit.tripId && onVisitClick?.(visit.tripId)}
            >
              <span className="font-semibold">
                {visit.yearRange || t("date.tbd")}
              </span>
              {visit.tripName && (
                <span className="text-muted tracking-wide select-none ms-2">
                  {visit.tripName}
                </span>
              )}
            </Chip>
          </li>
        ))}
      </ul>
    </CollapsibleHeader>
  );
}
