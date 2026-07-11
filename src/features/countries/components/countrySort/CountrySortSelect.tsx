import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SortSelect } from "@components";
import type { SortValue } from "@types";
import { getCountrySortOptions } from "../../utils/countrySort";

interface CountrySortSelectProps {
  value: SortValue<string>;
  onChange: (value: SortValue<string>) => void;
  visitedOnly?: boolean;
  showLabel?: boolean;
}

export function CountrySortSelect({
  value,
  onChange,
  visitedOnly,
  showLabel = false,
}: CountrySortSelectProps) {
  const { t } = useTranslation("atlas");

  const options = useMemo(
    () => getCountrySortOptions(!!visitedOnly, t),
    [visitedOnly, t],
  );

  // Extract key and direction groups
  const keyGroup = options[0] ?? { options: [] };
  const emptyGroup = { options: [] };

  return (
    <SortSelect
      value={value as SortValue<string>}
      onChange={onChange}
      keyGroup={keyGroup ?? emptyGroup}
      showLabel={showLabel}
    />
  );
}
