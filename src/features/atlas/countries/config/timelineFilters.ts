export const timelineFiltersConfig = {
  year: {
    label: "atlas:countries.filters.timeline.year",
    getValue: ({ selectedYear }: { selectedYear: number }) => selectedYear,
    setValue: (
      { setSelectedYear }: { setSelectedYear: (year: number) => void },
      value: string | number,
    ) => setSelectedYear(Number(value)),
    getOptions: (years: number[]) =>
      years.map((year) => ({ value: year, label: String(year) })),
  },
  visitCount: {
    label: "atlas:countries.filters.timeline.visitCount",
    getValue: ({ minVisitCount }: { minVisitCount: number }) => minVisitCount,
    setValue: (
      { setMinVisitCount }: { setMinVisitCount: (count: number) => void },
      value: string | number,
    ) => setMinVisitCount(Number(value)),
    getOptions: (max: number) =>
      Array.from({ length: max }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
  },
};
