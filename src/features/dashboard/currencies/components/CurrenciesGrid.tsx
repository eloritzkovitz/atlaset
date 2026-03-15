import React, { useState } from "react";
import { EmptyListMessage, SearchInput } from "@components";
import { type Currency } from "@features/countries";
import { Link } from "react-router-dom";

interface CurrenciesGridProps {
  currencies: Currency[];
}

export const CurrenciesGrid: React.FC<CurrenciesGridProps> = ({
  currencies,
}) => {
  const [search, setSearch] = useState("");
  const filtered = currencies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="max-w-6xl mx-auto p-4">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by name or code"
      />
      <ul className="divide-y divide-input bg-surface-alt rounded shadow mt-4">
        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyListMessage message="Currency not found." />
          </div>
        ) : (
          filtered.map((currency) => (
            <li key={currency.code}>
              <Link
                to={`/dashboard/currencies/${currency.code}`}
                className="flex items-center p-4 hover:bg-surface-hover transition rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <span className="font-semibold text-lg mr-2">
                  {currency.code}
                </span>
                <span>{currency.name}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
};
