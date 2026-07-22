import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SearchInput, EmptyListMessage } from "@components";
import { useLanguage } from "@features/settings";

interface DashboardListGridProps<T> {
  items: T[];
  getCode: (item: T) => string;
  getName: (item: T) => string;
  toLink?: (item: T) => string;
  headerActions?: React.ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function DashboardListGrid<T>({
  items,
  getCode,
  getName,
  toLink,
  headerActions,
  searchPlaceholder,
  emptyMessage,
}: DashboardListGridProps<T>) {
  const [search, setSearch] = useState("");
  const { isRtl } = useLanguage();

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return items.filter((it) => {
      const code = getCode(it) || "";
      const name = getName(it) || "";
      return name.toLowerCase().includes(q) || code.toLowerCase().includes(q);
    });
  }, [items, search, getCode, getName]);

  return (
    <>
      {headerActions}
      <div className="flex justify-between items-center mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder ?? "Search by name or code"}
        />
      </div>

      <ul className="divide-y divide-input bg-surface-alt rounded shadow mt-4">
        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyListMessage message={emptyMessage ?? "No items found."} />
          </div>
        ) : (
          filtered.map((item) => {
            const code = getCode(item);
            const name = getName(item);
            const link = toLink ? toLink(item) : undefined;
            const content = (
              <div
                className={`grid ${isRtl ? "grid-cols-[1fr_100px]" : "grid-cols-[100px_1fr]"} items-center p-4 hover:bg-surface-hover transition rounded focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                {isRtl ? (
                  <>
                    <span className="text-right">{name}</span>
                    <span className="font-semibold text-lg ps-14">{code}</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-lg pe-4">{code}</span>
                    <span className="text-left">{name}</span>
                  </>
                )}
              </div>
            );

            return (
              <li key={code}>
                {link ? (
                  <Link to={link} className="block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })
        )}
      </ul>
    </>
  );
}
