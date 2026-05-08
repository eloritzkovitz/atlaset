import { useCallback, useMemo, useState } from "react";
// selected icon centralized in ICONS
import { useTranslation } from "react-i18next";
import {
  Modal,
  SearchInput,
  Separator,
  ActionButton,
  PanelHeader,
} from "@components";
import { ICONS } from "@constants/icons";
import { useLanguage } from "@features/settings";
import { LANGUAGES } from "@constants/languages";

interface LanguagePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguagePicker({ isOpen, onClose }: LanguagePickerProps) {
  const { t } = useTranslation("common");
  const { current, change } = useLanguage();
  const [query, setQuery] = useState("");

  // Use centralized LANGUAGES list and enrich with localized strings
  const languages = useMemo(() => {
    return LANGUAGES.slice()
      .sort((a, b) => (a.priority || 999) - (b.priority || 999))
      .map((l) => ({
        code: l.code,
        native: l.nativeName,
        localized: t(`languages.${l.code}`),
      }));
  }, [t]);

  // Filter languages based on search query
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (l) =>
        l.code.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        (l.localized && l.localized.toLowerCase().includes(q)),
    );
  }, [query, languages]);

  // Handle language selection
  const handleSelect = useCallback(
    (code: string) => {
      if (code === current) return onClose();
      change(code);
      onClose();
    },
    [change, current, onClose],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      position="center"
      className="min-w-[360px] max-w-lg"
    >
      <PanelHeader
        title={
          <>
            <ICONS.language />
            {t("menu.language")}
          </>
        }
        showSeparator
      >
        <ActionButton
          onClick={onClose}
          ariaLabel={t("actions.close")}
          title={t("actions.close")}
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      </PanelHeader>
      <div className="p-4">
        <SearchInput
          className="w-full"
          placeholder={t("common:actions.search")}
          value={query}
          onChange={setQuery}
        />
        <Separator />
        <div className="max-h-64 overflow-auto">
          {filtered.map((l) => (
            <button
              key={l.code}
              className={`w-full text-left py-2 px-3 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between ${
                l.code === current ? "font-semibold" : ""
              }`}
              onClick={() => handleSelect(l.code)}
            >
              <div>
                <div>{l.native}</div>
                <div className="text-sm text-slate-500">{l.localized}</div>
              </div>
              {l.code === current && (
                <ICONS.selected className="text-green-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}
