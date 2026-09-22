import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { EmptyListMessage, Menu, MenuButton, SearchInput } from "@components";
import { useClickOutside, useDisclosure, useMenuPosition } from "@hooks";
import { useDocSearch } from "../hooks/useDocSearch";

interface DocSearchDropdownProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

/** Renders the documentation search input and results dropdown. */
export function DocSearchDropdown({
  placeholder,
  className = "",
  inputClassName = "",
}: DocSearchDropdownProps) {
  const { t } = useTranslation("common");
  const dropdown = useDisclosure();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState("");

  const { searchResults } = useDocSearch(search);

  const hasContent = search.trim().length > 0;

  useClickOutside([wrapperRef, dropdownRef], dropdown.close, dropdown.isOpen);

  const menuStyle = useMenuPosition(
    dropdown.isOpen,
    wrapperRef,
    dropdownRef,
    42,
    "right",
    "overlay",
    hasContent,
  );

  return (
    <div ref={wrapperRef} className={`relative shrink-0 ${className}`}>
      <SearchInput
        value={search}
        onChange={setSearch}
        onClick={(event) => {
          if (event.button === 0) {
            dropdown.open();
          }
        }}
        placeholder={
          placeholder || t("help.searchPlaceholder", "Search documentation")
        }
        showClear={false}
        className={inputClassName}
      />

      {dropdown.isOpen && hasContent && (
        <Menu
          open={dropdown.isOpen}
          containerRef={dropdownRef}
          style={menuStyle}
        >
          <div className="max-h-96 overflow-y-auto p-2">
            {searchResults.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {searchResults.map((doc) => (
                  <li key={doc.file}>
                    <MenuButton
                      icon={<doc.icon />}
                      className="w-full text-start"
                    >
                      <Link
                        to={doc.url}
                        className="block w-full font-semibold"
                        onClick={dropdown.close}
                      >
                        {doc.label}
                      </Link>
                    </MenuButton>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyListMessage message={t("components.search.noResults")} />
            )}
          </div>
        </Menu>
      )}
    </div>
  );
}
