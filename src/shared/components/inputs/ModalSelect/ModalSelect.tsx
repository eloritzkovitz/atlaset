import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  Checkbox,
  EmptyListMessage,
  Modal,
  ModalHeader,
  SearchInput,
} from "@components";
import { filterBySearch } from "@utils/filter";

interface ModalSelectProps<T> {
  isOpen: boolean;
  title: React.ReactNode;
  items: T[];
  selectedValues: string[];
  onChange: (newSelectedValues: string[]) => void;
  onClose: () => void;
  getItemValue: (item: T) => string;
  getItemSearchLabel: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterItem?: (items: T[], searchQuery: string) => T[];
  renderSearch?: (props: {
    value: string;
    onChange: (val: string) => void;
  }) => React.ReactNode;
  emptyMessage?: string;
  multiple?: boolean;
  disabled?: boolean;
  isItemDisabled?: (item: T) => boolean;
}

export function ModalSelect<T>({
  isOpen,
  title,
  items,
  selectedValues,
  onChange,
  onClose,
  getItemValue,
  getItemSearchLabel,
  renderItem,
  searchValue,
  onSearchChange,
  filterItem,
  renderSearch,
  emptyMessage,
  multiple = true,
  disabled = false,
  isItemDisabled,
}: ModalSelectProps<T>) {
  const { t } = useTranslation("common");
  const [internalSearch, setInternalSearch] = useState("");

  // Determine whether to use controlled (parent) or uncontrolled (internal) search values
  const currentSearchValue =
    searchValue !== undefined ? searchValue : internalSearch;
  const handleSearchChange = onSearchChange || setInternalSearch;

  // Reset search string when modal toggles open
  useEffect(() => {
    if (isOpen) {
      handleSearchChange("");
    }
  }, [isOpen, handleSearchChange]);

  // Process items based on search - either via parent-provided filter or internal filtering
  const processedItems = (() => {
    if (filterItem) {
      return filterItem(items, currentSearchValue);
    }
    if (searchValue !== undefined) {
      return items;
    }
    return filterBySearch(items, currentSearchValue, getItemSearchLabel);
  })();

  // Sort alphabetically
  const sortedItems = [...processedItems].sort((a, b) =>
    getItemSearchLabel(a).localeCompare(getItemSearchLabel(b)),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="modal shadow-lg w-[500px] max-h-[80vh] flex flex-col"
      draggable
    >
      <ModalHeader title={title} />

      <div className="flex flex-col h-full px-4 gap-4 pb-4">
        {renderSearch ? (
          renderSearch({
            value: currentSearchValue,
            onChange: handleSearchChange,
          })
        ) : (
          <SearchInput
            value={currentSearchValue}
            onChange={handleSearchChange}
            placeholder={t("search.placeholder")}
          />
        )}

        <div className="bg-input h-64 max-h-[50vh] overflow-y-auto rounded px-2 py-1">
          {sortedItems.length === 0 ? (
            <EmptyListMessage message={emptyMessage || t("search.noResults")} />
          ) : (
            sortedItems.map((item) => {
              const value = getItemValue(item);
              const checked = selectedValues.includes(value);
              const isThisItemDisabled = disabled || !!isItemDisabled?.(item);

              return (
                <label
                  key={value}
                  className={`flex items-center mb-2 select-none ${
                    isThisItemDisabled
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "cursor-pointer hover:text-dropdown-hover"
                  }`}
                >
                  <Checkbox
                    checked={checked}
                    disabled={isThisItemDisabled}
                    onChange={(isChecked) => {
                      if (multiple) {
                        const newSelected = isChecked
                          ? [...selectedValues, value]
                          : selectedValues.filter((v) => v !== value);
                        onChange(newSelected);
                      } else {
                        onChange(isChecked ? [value] : []);
                      }
                    }}
                  />
                  <span className="w-3" />
                  {renderItem(item)}
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
