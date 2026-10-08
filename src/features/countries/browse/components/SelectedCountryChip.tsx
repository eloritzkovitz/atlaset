import { Chip } from "@components";
import { ICONS } from "@constants/icons";
import { CountryWithFlag } from "../../flags/components/CountryWithFlag";
import type { Country } from "../../types";

interface SelectedCountryChipProps {
  country: Country;
  homeCountry?: string | null;
  isLockedVisit: boolean;
  canRemove: boolean;
  onRemove: () => void;
}

export function SelectedCountryChip({
  country,
  homeCountry,
  isLockedVisit,
  canRemove,
  onRemove,
}: SelectedCountryChipProps) {
  return (
    <Chip removable={canRemove} onRemove={onRemove}>
      <CountryWithFlag country={country} />
      {isLockedVisit &&
        (homeCountry === country.isoCode ? (
          <ICONS.home className="inline ms-1" />
        ) : (
          <ICONS.tripAbroad className="inline ms-1" />
        ))}
    </Chip>
  );
}
