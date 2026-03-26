import { useEffect, useState } from "react";
import {
  ActionButton,
  Autocomplete,
  Checkbox,
  EmptyListMessage,
  Modal,
  PanelHeader,
} from "@components";
import { ICONS } from "@constants/icons";
import { useVisitedCountries } from "@features/visits";
import { filterBySearch } from "@utils/filter";
import { CountryWithFlag } from "../countryFlag/CountryWithFlag";
import type { Country } from "../../types";
import { filterCountriesByProperty } from "../../utils/countryFilters";
import {
  parsePropertySearch,
  buildSearchString,
  propertySuggestionProvider,
} from "../../utils/countrySearch";

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

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  // Filter options by search
  const parsed = parsePropertySearch(search);
  const { visitedCountryCodes } = useVisitedCountries();
  const filteredOptions = ((): typeof options => {
    if (parsed) {
      const visitContext = {
        visitedIsoCodes: visitedCountryCodes,
        visitedMap: {},
        visitedYearMap: {},
      };
      return filterCountriesByProperty(
        options,
        parsed.property,
        parsed.query,
        visitContext,
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
            Select Countries
          </>
        }
      >
        <ActionButton
          onClick={onClose}
          ariaLabel="Close List Modal"
          title="Close"
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      </PanelHeader>
      <div className="flex flex-col h-full px-4 gap-4">
        <Autocomplete
          value={search}
          onChange={setSearch}
          placeholder="Search countries"
          suggestionProvider={propertySuggestionProvider}
        />
        <div className="bg-input h-64 max-h-[50vh] overflow-y-auto rounded px-2 py-1">
          {filteredOptions.length === 0 ? (
            <EmptyListMessage message="No countries found." />
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
                    className="mr-2"
                  />
                </label>
              );
            })
          )}
        </div>
        <div className="flex justify-end gap-2">
          <ActionButton type="button" variant="secondary" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton type="button" variant="primary" onClick={onClose}>
            Confirm
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}
