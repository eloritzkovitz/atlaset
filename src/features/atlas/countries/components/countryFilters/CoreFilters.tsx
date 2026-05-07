import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { canonicalKey } from "@utils/string";
import type { FilterOption } from "@types";
import { FaShapes } from "react-icons/fa6";
import { CollapsibleHeader, SelectInput } from "@components";
import {
  useCountryData,
  type GeoType,
  type SovereigntyStatus,
} from "@features/countries";
import type { VisitedStatus } from "@features/visits";
import { coreFiltersConfig } from "../../config/filtersConfig";

interface CoreFiltersProps {
  expanded: boolean;
  onToggle: () => void;
  selectedRegion: string;
  handleRegionChange: (region: string) => void;
  selectedSubregion: string;
  setSelectedSubregion: (subregion: string) => void;
  selectedGeoType: GeoType | "";
  setSelectedGeoType: (type: GeoType | "") => void;
  selectedSovereignty: SovereigntyStatus | "";
  setSelectedSovereignty: (status: SovereigntyStatus | "") => void;
  sovereignOnly: boolean;
  selectedVisited: VisitedStatus;
  setSelectedVisited: (visited: VisitedStatus) => void;
  visitedOnly: boolean;
  subregionOptions: string[];
  geoTypeOptions: GeoType[];
  sovereigntyOptions: string[];
}

export function CoreFilters({
  expanded,
  onToggle,
  selectedRegion,
  handleRegionChange,
  selectedSubregion,
  setSelectedSubregion,
  selectedGeoType,
  setSelectedGeoType,
  selectedSovereignty,
  setSelectedSovereignty,
  sovereignOnly,
  selectedVisited,
  setSelectedVisited,
  visitedOnly,
  subregionOptions,
  geoTypeOptions,
  sovereigntyOptions,
}: CoreFiltersProps) {
  const { allRegions, subregionToRegion } = useCountryData();
  const { t } = useTranslation("countries");
  const { t: tCommon } = useTranslation("common");

  // Normalizes a string key for translation lookup
  const normalizeKey = (raw?: string) => canonicalKey(String(raw ?? ""));

  return (
    <>
      <CollapsibleHeader
        icon={<FaShapes />}
        label={t("atlas:countries.filters.core.title")}
        expanded={expanded}
        onToggle={onToggle}
      />
      {expanded && (
        <>
          {coreFiltersConfig.map((filter) => {
            const key = filter.key as string;

            const valueMap: Record<string, unknown> = {
              region: selectedRegion,
              subregion: selectedSubregion,
              geoType: selectedGeoType,
              sovereignty: selectedSovereignty,
              visited: selectedVisited,
            };

            const setterMap: Record<string, (v: string) => void> = {
              region: (v: string) => handleRegionChange(String(v)),
              subregion: (v: string) => setSelectedSubregion(String(v)),
              geoType: (v: string) =>
                setSelectedGeoType(
                  (v as unknown) === "all" ? "" : (v as GeoType),
                ),
              sovereignty: (v: string) =>
                setSelectedSovereignty(
                  (v as unknown) === "all" ? "" : (v as SovereigntyStatus),
                ),
              visited: (v: string) => setSelectedVisited(v as VisitedStatus),
            };

            const optionsSource: Record<string, unknown[]> = {
              region: allRegions,
              subregion: subregionOptions,
              geoType: geoTypeOptions,
              sovereignty: sovereigntyOptions,
            };

            const baseOptions = filter.getOptions(
              optionsSource[key] as string[],
            );

            const translateLabel = (opt: FilterOption) => {
              if (key === "region") {
                return t(`regions.${String(opt.value)}`, {
                  defaultValue: String(opt.label),
                });
              }
              if (key === "subregion") {
                const sk = String(opt.value);
                const regionKey =
                  selectedRegion || subregionToRegion.get(sk) || "";
                const normalized = normalizeKey(sk);
                return regionKey
                  ? t(`subregions.${regionKey}.${normalized}`, {
                      defaultValue: String(opt.label),
                    })
                  : String(opt.label);
              }
              if (key === "sovereignty") {
                return t(`sovereignty.${String(opt.value)}`, {
                  defaultValue: String(opt.label),
                });
              }
              return i18next.t(String(opt.label), {
                defaultValue: String(opt.label),
              });
            };
            const options = (baseOptions ?? []).map((o: FilterOption) => ({
              ...o,
              label:
                o.value === "all" ? tCommon("filter.all") : translateLabel(o),
            }));

            const disabled =
              (key === "sovereignty" && sovereignOnly) ||
              (key === "visited" && visitedOnly);
            const setValue = setterMap[key];
            const value = valueMap[key];
            const selectValue =
              value === "" || value === undefined ? "all" : String(value);

            return setValue ? (
              <SelectInput
                key={key}
                label={
                  typeof filter.label === "function"
                    ? filter.label(selectValue ?? "")
                    : i18next.t(String(filter.label), {
                        defaultValue: String(filter.label),
                      })
                }
                value={selectValue ?? "all"}
                onChange={(val) => {
                  if (disabled) return;
                  setValue(val === "all" ? "" : String(val));
                }}
                options={options ?? []}
                disabled={disabled}
              />
            ) : null;
          })}
        </>
      )}
    </>
  );
}
