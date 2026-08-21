import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { FaShapes } from "react-icons/fa6";
import { CollapsibleHeader, SelectInput } from "@components";
import type { GeoType, SovereigntyStatus } from "@features/countries/types";
import type { VisitedStatus } from "@features/visits/types";
import type { FilterOption } from "@types";
import { canonicalKey } from "@utils";
import { coreFiltersConfig } from "../../config/coreFilters";
import { useCountryFilters } from "../../context/CountryFiltersContext";
import type { CountryFilterKey } from "../../types";

interface CoreFiltersProps {
  expanded: boolean;
  onToggle: () => void;
  subregionOptions: string[];
  geoTypeOptions: GeoType[];
  sovereigntyOptions: string[];
  allRegions: string[];
  subregionToRegion: Map<string, string>;
}

export function CoreFilters({
  expanded,
  onToggle,
  subregionOptions,
  geoTypeOptions,
  sovereigntyOptions,
  allRegions,
  subregionToRegion,
}: CoreFiltersProps) {
  const {
    selectedRegion,
    setSelectedRegion,
    selectedSubregion,
    setSelectedSubregion,
    selectedGeoType,
    setSelectedGeoType,
    selectedSovereignty,
    setSelectedSovereignty,
    selectedVisited,
    setSelectedVisited,
    sovereignOnly,
    visitedOnly,
  } = useCountryFilters();

  const { t } = useTranslation("countries");
  const { t: tCommon } = useTranslation("common");

  const values = {
    region: selectedRegion,
    subregion: selectedSubregion,
    geoType: selectedGeoType,
    sovereignty: selectedSovereignty,
    visited: selectedVisited,
  };

  // Get the options source based on the filter key
  const getOptionsSource = (key: CountryFilterKey) => {
    switch (key) {
      case "region":
        return allRegions;
      case "subregion":
        return subregionOptions;
      case "geoType":
        return geoTypeOptions;
      case "sovereignty":
        return sovereigntyOptions;
      case "visited":
        return undefined;
      default:
        return undefined;
    }
  };

  // Set the value for a specific filter key
  const setValue = (key: CountryFilterKey, value: string) => {
    switch (key) {
      case "region":
        setSelectedRegion(value);
        setSelectedSubregion("");
        break;
      case "subregion":
        setSelectedSubregion(value);
        break;
      case "geoType":
        setSelectedGeoType(value as GeoType | "");
        break;
      case "sovereignty":
        setSelectedSovereignty(value as SovereigntyStatus | "");
        break;
      case "visited":
        setSelectedVisited(value as VisitedStatus);
        break;
    }
  };

  // Translate the label for a given filter option based on its key
  const translateLabel = (key: CountryFilterKey, option: FilterOption) => {
    const value = String(option.value);
    const label = String(option.label);

    switch (key) {
      case "region":
        return t(`regions.${value}`, { defaultValue: label });

      case "subregion": {
        const regionKey = selectedRegion || subregionToRegion.get(value) || "";

        return regionKey
          ? t(`subregions.${regionKey}.${canonicalKey(value)}`, {
              defaultValue: label,
            })
          : label;
      }

      case "sovereignty":
        return t(`sovereignty.${value}`, { defaultValue: label });

      default:
        return i18next.t(label, { defaultValue: label });
    }
  };

  return (
    <>
      <CollapsibleHeader
        icon={<FaShapes />}
        label={t("atlas:countries.filters.core.title")}
        expanded={expanded}
        onToggle={onToggle}
      />

      {expanded &&
        coreFiltersConfig.map((filter) => {
          const key = filter.key;
          const value = values[key];

          const baseOptions = filter.getOptions(getOptionsSource(key));

          const options = (baseOptions ?? []).map((option) => ({
            ...option,
            label:
              option.value === "all"
                ? tCommon("components.filter.all")
                : translateLabel(key, option),
          }));

          const disabled =
            (key === "sovereignty" && sovereignOnly) ||
            (key === "visited" && visitedOnly);

          const selectValue =
            value === "" || value === undefined ? "all" : String(value);

          return (
            <SelectInput
              key={key}
              label={
                typeof filter.label === "function"
                  ? filter.label(selectValue)
                  : i18next.t(String(filter.label), {
                      defaultValue: String(filter.label),
                    })
              }
              value={selectValue}
              onChange={(value) => {
                if (!disabled) {
                  setValue(key, value === "all" ? "" : String(value));
                }
              }}
              options={options}
              disabled={disabled}
            />
          );
        })}
    </>
  );
}
