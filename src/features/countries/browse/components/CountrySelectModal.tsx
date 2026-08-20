import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalSelect, QualifierSearch } from "@components";
import { ICONS } from "@constants/icons";
import { useCountryTracking } from "@features/visits/hooks/useCountryTracking";
import { filterBySearch, parseQualifierSearch } from "@utils";
import { SUPPORTED_MODIFIERS } from "../constants/modifierConfig";
import { SUPPORTED_QUALIFIERS } from "../constants/qualifierConfig";
import { applyQualifierSearch } from "../utils/countryFilters";
import { buildSearchString } from "../utils/countrySearch";
import { CountryWithFlag } from "../../flags/components/CountryWithFlag";
import type { Country } from "../../types";

interface CountrySelectModalProps {
  isOpen: boolean;
  selected: string[];
  options: Country[];
  onChange: (newCountries: string[]) => void;
  onClose: () => void;
  multiple?: boolean;
  disabled?: boolean;
  isCountryDisabled?: (code: string) => boolean;
}

export function CountrySelectModal({
  isOpen,
  selected,
  options,
  onChange,
  onClose,
  multiple = true,
  disabled = false,
  isCountryDisabled,
}: CountrySelectModalProps) {
  const [search, setSearch] = useState("");
  const { t } = useTranslation(["atlas", "common"]);
  const { visitedCountryCodes, wantToVisitCountryCodes } = useCountryTracking();

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!isOpen) return [];

    const parsed = parseQualifierSearch(search);

    if (parsed) {
      return applyQualifierSearch(
        options,
        search,
        visitedCountryCodes,
        {},
        undefined,
        {},
        {},
        wantToVisitCountryCodes,
      );
    }

    return filterBySearch(options, search, (country) =>
      buildSearchString(country),
    );
  }, [isOpen, search, options, visitedCountryCodes, wantToVisitCountryCodes]);

  return (
    <ModalSelect<Country>
      isOpen={isOpen}
      title={
        <>
          <ICONS.countries />
          {t("atlas:countries.select.title")}
        </>
      }
      items={filteredOptions}
      selectedValues={selected}
      searchValue={search}
      onSearchChange={setSearch}
      getItemValue={(country) => country.isoCode}
      getItemSearchLabel={(country) => country.name}
      emptyMessage={t(
        "atlas:countries.select.noResults",
        "No countries found.",
      )}
      multiple={multiple}
      disabled={disabled}
      isItemDisabled={(country) =>
        isCountryDisabled ? isCountryDisabled(country.isoCode) : false
      }
      onChange={onChange}
      onClose={onClose}
      renderSearch={(searchProps) => (
        <QualifierSearch
          value={searchProps.value}
          onChange={searchProps.onChange}
          qualifiers={SUPPORTED_QUALIFIERS}
          modifiers={SUPPORTED_MODIFIERS}
          placeholder={t("atlas:countries.searchPlaceholder")}
        />
      )}
      renderItem={(country) => (
        <CountryWithFlag
          country={country}
          visited={visitedCountryCodes.includes(country.isoCode)}
          className="me-2"
        />
      )}
    />
  );
}
