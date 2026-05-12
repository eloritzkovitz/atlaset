import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { EmptyListMessage, SearchInput } from "@components";
import type { Language } from "@types";
import { useLanguage } from "@features/settings";

interface LanguagesGridProps {
  languages: Language[];
}

export const LanguagesGrid: React.FC<LanguagesGridProps> = ({ languages }) => {
  const [search, setSearch] = useState("");
  const filtered = languages.filter(
    (l) =>
      (l.name ?? l.nativeName ?? l.code)
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()),
  );
  const { t } = useTranslation("dashboard");
  const { isRtl } = useLanguage();

  return (
    <section className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {t("menu.languages", { defaultValue: "Languages" })}
        </h2>
      </div>
      <div className="flex justify-between items-center mb-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t("languages.searchPlaceholder", {
            defaultValue: "Search by name or code",
          })}
        />
      </div>
      <ul className="divide-y divide-input bg-surface-alt rounded shadow mt-4">
        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyListMessage
              message={t("languages.empty", {
                defaultValue: "Language not found.",
              })}
            />
          </div>
        ) : (
          filtered.map((language) => (
            <li key={language.code}>
              <Link
                to={`/dashboard/languages/${language.code}`}
                className={`grid ${isRtl ? "grid-cols-[1fr_100px]" : "grid-cols-[100px_1fr]"} items-center p-4 hover:bg-surface-hover transition rounded focus:outline-none focus:ring-2 focus:ring-primary`}
              >
                {isRtl ? (
                  <>
                    <span className="text-right">
                      {language.name ?? language.nativeName ?? language.code}
                    </span>
                    <span className="font-semibold text-lg ps-14">
                      {language.code}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-lg pe-4">
                      {language.code}
                    </span>
                    <span className="text-left">
                      {language.name ?? language.nativeName ?? language.code}
                    </span>
                  </>
                )}
              </Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
};
