import { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("atlas");
  
  const options = useMemo(
    () => getCountrySortOptions(!!visitedOnly, t),
    [visitedOnly, t],
  );

  // Extract key and direction groups
  const keyGroup = options[0] ?? { label: "", options: [] };
  const emptyGroup = { label: "", options: [] };

  return (
    <SortSelect
      value={value}
      onChange={onChange}
      keyGroup={keyGroup ?? emptyGroup}
      showLabel={showLabel}
    />
  );
}
