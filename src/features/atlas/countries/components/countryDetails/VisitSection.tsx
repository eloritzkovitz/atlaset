import type { Visit } from "@types";

export function VisitSection({
  title,
  visits,
  getLabel,
  emptyMessage,
}: {
  title: string;
  visits: Visit[];
  getLabel?: (visit: Visit) => React.ReactNode;
  emptyMessage?: string;
}) {
  if (!visits.length) {
    return emptyMessage ? (
      <div className="text-muted text-sm">{emptyMessage}</div>
    ) : null;
  }
  return (
    <section className="mb-4">
      <h3 className="font-semibold mb-1">{title}</h3>
      <ul className="list-disc pl-5">
        {visits.map((visit, i) => (
          <li key={`${title}-${i}`}>
            <span className="font-semibold">
              {getLabel ? getLabel(visit) : visit.yearRange || "TBD"}
            </span>
            {visit.tripName && (
              <span className="ml-2 text-muted">({visit.tripName})</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
