import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SearchInput, EmptyListMessage } from "@components";

interface DashboardListGridProps<T> {
  items: T[];
  getCode: (item: T) => string;
  getName: (item: T) => string;
  toLink?: (item: T) => string;
  headers?: { codeLabel?: string; nameLabel?: string };
  headerActions?: React.ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function DashboardListGrid<T>({
  items,
  getCode,
  getName,
  toLink,
  headers,
  headerActions,
  searchPlaceholder = "Search by name or code",
  emptyMessage = "No items found.",
}: DashboardListGridProps<T>) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter(
      (it) =>
        (getName(it) || "").toLowerCase().includes(q) ||
        (getCode(it) || "").toLowerCase().includes(q),
    );
  }, [items, search, getCode, getName]);

  return (
    <>
      {headerActions}
      <div className="flex justify-between items-center mb-4">
        <SearchInput
          id="search-input"
          name="search-input"
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="bg-surface-alt rounded-xl shadow mt-4 overflow-hidden">
        {headers && (
          <div className="flex justify-between items-center px-4 py-4 border-b border-input text-xs uppercase text-muted font-semibold tracking-wider rtl:flex-row-reverse">
            <span className="text-start">{headers.codeLabel}</span>
            <span className="text-end">{headers.nameLabel}</span>
          </div>
        )}

        <ul className="divide-y divide-input">
          {filtered.length === 0 ? (
            <div className="p-4">
              <EmptyListMessage message={emptyMessage} />
            </div>
          ) : (
            filtered.map((item) => {
              const code = getCode(item);
              const link = toLink?.(item);

              const inner = (
                <div className="flex justify-between items-center p-4 hover:bg-surface-hover transition focus:outline-none focus:ring-2 focus:ring-primary rtl:flex-row-reverse">
                  <span className="font-semibold text-lg">{code}</span>
                  <span className="text-end font-mono text-muted">
                    {getName(item)}
                  </span>
                </div>
              );

              return (
                <li key={code}>
                  {link ? (
                    <Link to={link} className="block">
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </>
  );
}
