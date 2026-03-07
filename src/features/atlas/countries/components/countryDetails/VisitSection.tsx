import { useState } from "react";
import { CollapsibleHeader, Chip } from "@components";
import type { Visit } from "@features/visits";

interface VisitSectionProps {
  icon: React.ReactNode;
  title: string;
  visits: Visit[];
  onVisitClick?: (tripId: string) => void;
}

export function VisitSection({
  icon,
  title,
  visits,
  onVisitClick,
}: VisitSectionProps) {
  const [expanded, setExpanded] = useState(visits.length > 0);

  return (
    <CollapsibleHeader
      icon={icon}
      label={title}
      expanded={expanded}
      onToggle={() => setExpanded((e) => !e)}
    >
      <ul className="pl-0">
        {visits.map((visit, i) => (
          <li key={`${title}-${i}`} className="my-2">
            <Chip
              className="flex items-center gap-2 px-3 py-2 bg-surface-alt/50 cursor-pointer"
              onClick={() => visit.tripId && onVisitClick?.(visit.tripId)}
            >
              <span className="font-semibold">{visit.yearRange || "TBD"}</span>
              {visit.tripName && (
                <span className="text-muted tracking-wide select-none ml-2">
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
