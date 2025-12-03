import { SearchInput } from "@components";
import { CountrySortSelect } from "./CountrySortSelect";

interface CountriesSearchSortBarProps {
  search: string;
  setSearch: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  count: number;
  visitedOnly?: boolean;
};

export function CountriesSearchSortBar({
  search,
  setSearch,
  sortBy,
  setSortBy,
  count,
  visitedOnly,
}: CountriesSearchSortBarProps) {
  return (
    <div>
      <div className="flex items-stretch pb-0 mt-1">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search countries..."
          className="flex-1 h-10"
        />
        <CountrySortSelect
          value={sortBy}
          onChange={(v: string) => setSortBy(v)}
          visitedOnly={visitedOnly}
        />
      </div>
      <div className="text-s text-left text-gray-500 font-semibold mb-2 mt-2 select-none">
        Showing {count} countries
      </div>
    </div>
  );
}
