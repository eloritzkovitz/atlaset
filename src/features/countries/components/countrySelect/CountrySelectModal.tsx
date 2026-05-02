import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  Checkbox,
  EmptyListMessage,
  Modal,
  PanelHeader,
  QualifierSearch,
} from "@components";
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
}

export function CountrySelectModal({
  isOpen,
  selected,
  options,
  onChange,
  onClose,
  multiple = true,
  disabled = false,
}: CountrySelectModalProps) {
  const [search, setSearch] = useState("");
  const { t } = useTranslation(["atlas", "common"]);

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  // Filter options by search
  const parsed = parseQualifierSearch(search);
  const { visitedCountryCodes } = useVisitedCountries();
  const filteredOptions = ((): typeof options => {
    if (parsed) {
      return applyQualifierSearch(
        options,
        search,
        visitedCountryCodes,
        {},
        undefined,
        {},
        {},
      ).sort((a, b) => a.name.localeCompare(b.name));
    }

    return [
      ...filterBySearch(options, search, (country) =>
        buildSearchString(country),
      ),
    ].sort((a, b) => a.name.localeCompare(b.name));
  })();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="modal shadow-lg w-[500px] max-h-[80vh] flex flex-col"
      draggable
    >
      <PanelHeader
        title={
          <>
            <ICONS.countries />
            {t("atlas:countries.select.title")}
          </>
        }
      >
        <ActionButton
          onClick={onClose}
          ariaLabel={t("common:actions.close")}
          title={t("common:actions.close")}
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      </PanelHeader>
      <div className="flex flex-col h-full px-4 gap-4">
        <QualifierSearch
          value={search}
          onChange={setSearch}
          qualifiers={SUPPORTED_QUALIFIERS}
          modifiers={SUPPORTED_MODIFIERS}
          placeholder={t("common:search.placeholder")}
        />
        <div className="bg-input h-64 max-h-[50vh] overflow-y-auto rounded px-2 py-1">
          {filteredOptions.length === 0 ? (
            <EmptyListMessage
              message={t(
                "atlas:countries.select.noResults",
                "No countries found.",
              )}
            />
          ) : (
            filteredOptions.map((country) => {
              const checked = selected.includes(country.isoCode);
              return (
                <label
                  key={country.isoCode}
                  className="flex items-center mb-2 cursor-pointer hover:text-dropdown-hover"
                >
                  <Checkbox
                    checked={checked}
                    disabled={disabled}
                    onChange={(checked) => {
                      if (multiple) {
                        const newSelected = checked
                          ? [...selected, country.isoCode]
                          : selected.filter((v) => v !== country.isoCode);
                        onChange(newSelected);
                      } else {
                        onChange([country.isoCode]);
                      }
                    }}
                  />
                  <span className="w-2" />
                  <CountryWithFlag
                    isoCode={country.isoCode}
                    name={country.name}
                    className="me-2"
                  />
                </label>
              );
            })
          )}
        </div>
        <div className="flex justify-end gap-2">
          <ActionButton type="button" variant="secondary" onClick={onClose}>
            {t("common:actions.cancel")}
          </ActionButton>
          <ActionButton type="button" variant="primary" onClick={onClose}>
            {t("common:actions.confirm")}
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
