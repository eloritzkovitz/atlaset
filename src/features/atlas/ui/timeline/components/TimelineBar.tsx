import { useTimeline } from "@contexts/TimelineContext";

export function TimelineBar() {
  const { years, selectedYear, setSelectedYear } = useTimeline();
  const selectedIdx = years.indexOf(selectedYear);
  const total = years.length;
  const maxVisible = 5;
  const center = Math.floor(maxVisible / 2);

  // Determine start and end indices for slicing
  let start = selectedIdx - center;
  let end = selectedIdx + center + 1;

  // Calculate how much padding is needed on each side
  let padStart = 0;
  let padEnd = 0;
  if (start < 0) {
    padStart = -start;
    start = 0;
  }
  if (end > total) {
    padEnd = end - total;
    end = total;
  }

  const visibleYears = years.slice(start, end);

  // Pad with nulls for empty spaces
  const paddedYears = [
    ...Array(padStart).fill(null),
    ...visibleYears,
    ...Array(padEnd).fill(null),
  ];

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 flex items-center gap-2">
      {/* Timeline line */}
      <div
        className="absolute left-0 right-0 top-1/2 h-1 bg-gray-300 opacity-20 rounded -z-10"
        style={{ transform: "translateY(-50%)" }}
      />

      {/* Year markers */}
      <div className="flex justify-center gap-4">
        {paddedYears.map((year, idx) =>
          year === null ? (
            <span key={idx} style={{ minWidth: 40 }} />
          ) : (
            <button
              key={year}
              className={`
                flex flex-col items-center group focus:outline-none
              `}
              style={{ minWidth: 40 }}
              onClick={() => setSelectedYear(year)}
              aria-label={`Select year ${year}`}
            >
              <span
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition
                  ${
                    year === selectedYear
                      ? "text-white scale-110"
                      : "text-gray-700"
                  }
                `}
              >
                <span
                  className={year === selectedYear ? "font-bold" : "text-xs"}
                >
                  {year}
                </span>
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
}
