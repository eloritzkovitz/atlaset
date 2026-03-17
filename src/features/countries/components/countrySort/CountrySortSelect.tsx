import { useMemo } from "react";
import { SortSelect } from "@components";
import { getCountrySortOptions } from "../../utils/countrySort";

interface CountrySortSelectProps {
  value: string;
  onChange: (value: string) => void;
  visitedOnly?: boolean;
  showLabel?: boolean;
}

export function CountrySortSelect({
  value,
  onChange,
  visitedOnly,
  showLabel = false,
}: CountrySortSelectProps) {
  const options = useMemo(
    () => getCountrySortOptions(!!visitedOnly),
    [visitedOnly],
  );

  // Extract key and direction groups
  const keyGroup = options.find((g) => g.label === "SORT BY");
  const dirGroup = options.find((g) => g.label === "SORT DIRECTION");

  // Fallback to empty group if undefined
  const emptyGroup = { label: "", options: [] };

  return (
    <SortSelect
      value={value}
      onChange={onChange}
      keyGroup={keyGroup ?? emptyGroup}
      dirGroup={dirGroup ?? emptyGroup}
      showLabel={showLabel}
    />
  );
}
