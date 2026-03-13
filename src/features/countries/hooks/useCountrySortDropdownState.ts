import { useMemo } from "react";
import type { OptionGroup } from "@types";
import { getCountrySortOptions } from "@features/countries/utils/countrySort";

/**
 * Manages the state for the sort dropdown in the countries panel.
 * @param value - The current sort value (e.g. "name-asc").
 * @param visitedOnly - Whether to include visit-based sort options.
 * @returns - An object containing sort state and options.
 */
export function useCountrySortDropdownState(value: string, visitedOnly?: boolean) {
  // Ensure both sortKey and sortDirection have defaults
  let sortKey = "name";
  let sortDirection = "asc";
  if (value) {
    const [key, dir] = value.split("-");
    if (key) sortKey = key;
    if (dir) sortDirection = dir;
  }

  const options = useMemo(() => getCountrySortOptions(!!visitedOnly), [visitedOnly]);
  const keyGroup: OptionGroup<string> | undefined = options.find(
    (g) => g.label === "SORT BY"
  );
  const dirGroup: OptionGroup<string> | undefined = options.find(
    (g) => g.label === "SORT DIRECTION"
  );
  const selectedKeyOption = keyGroup?.options.find(
    (opt) => opt.value === sortKey
  );
  const selectedDirOption = dirGroup?.options.find(
    (opt) => opt.value === sortDirection
  );

  return {
    sortKey,
    sortDirection,
    options,
    keyGroup,
    dirGroup,
    selectedKeyOption,
    selectedDirOption,
  };
}
