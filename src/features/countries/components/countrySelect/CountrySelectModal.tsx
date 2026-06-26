import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { QualifierSearch, SelectionListModal } from "@components";
import { ICONS } from "@constants/icons";
import { useVisitedCountries } from "@features/visits";
import { filterBySearch } from "@utils/filter";
import { parseQualifierSearch } from "@utils/search";
import { CountryWithFlag } from "../countryFlag/CountryWithFlag";
import { SUPPORTED_MODIFIERS } from "../../constants/modifierConfig";
import { SUPPORTED_QUALIFIERS } from "../../constants/qualifierConfig";
import type { Country } from "../../types";
import { applyQualifierSearch } from "../../utils/countryFilters";
import { buildSearchString } from "../../utils/countrySearch";

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
  const { visitedCountryCodes, wantToVisitCountryCodes } =
    useVisitedCountries();

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  // Filter options by search
  const parsed = parseQualifierSearch(search);
  const filteredOptions = ((): Country[] => {
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
  })();

  return (
    <SelectionListModal<Country>
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
          placeholder={t("common:search.placeholder")}
        />
      )}
      renderItem={(country) => (
        <CountryWithFlag
          isoCode={country.isoCode}
          name={country.name}
          className="me-2"
        />
      )}
    />
  );
}
