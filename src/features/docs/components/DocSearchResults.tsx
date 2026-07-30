import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchInput, MenuButton, EmptyListMessage } from "@components";
import { useTranslation } from "react-i18next";
import { useDocSearch } from "../hooks/useDocSearch";

interface DocSearchResultsProps {
  placeholder?: string;
  emptyContent?: React.ReactNode;
}

export function DocSearchResults({
  placeholder,
  emptyContent,
}: DocSearchResultsProps) {
  const { t } = useTranslation("common");
  const [search, setSearch] = useState("");
  const { searchResults } = useDocSearch(search);

  return (
    <>
      <SearchInput
        className="w-full"
        placeholder={placeholder || "Search documentation..."}
        value={search}
        onChange={setSearch}
      />
      {search.trim().length > 0 ? (
        <div className="w-full mt-2">
          {searchResults.length > 0 ? (
            <ul className="flex flex-col gap-2 items-center">
              {searchResults.map((doc) => (
                <li key={doc.file} className="w-full">
                  <MenuButton
                    icon={<doc.icon />}
                    className="w-full block text-xl mb-1"
                  >
                    <Link to={doc.url} className="w-full block font-semibold">
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
      ) : (
        emptyContent || null
      )}
    </>
  );
}
