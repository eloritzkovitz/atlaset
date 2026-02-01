import { useState } from "react";
import { SearchInput, MenuButton } from "@components";
import { useDocSearch } from "../hooks/useDocSearch";

interface DocSearchResultsProps {
  placeholder?: string;
  emptyContent?: React.ReactNode;
}

export function DocSearchResults({
  placeholder,
  emptyContent,
}: DocSearchResultsProps) {
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
                <li key={doc.file} className="w-full max-w-lg">
                  <MenuButton
                    icon={doc.icon}
                    className="w-full mb-1"
                    onClick={() =>
                      (window.location.href = `/documentation/${doc.file.replace(/\.md$/, "")}`)
                    }
                  >
                    {doc.label}
                  </MenuButton>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-muted px-2">No results found.</div>
          )}
        </div>
      ) : (
        emptyContent || null
      )}
    </>
  );
}
