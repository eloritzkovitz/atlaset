import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionButton,
  Modal,
  PanelHeader,
  SearchInput,
  Separator,
} from "@components";
import { ICONS } from "@constants/icons";
import { mapLanguages, useLanguage } from "@features/settings";
import { LanguageMenuList } from "./LanguageMenuList";

interface LanguagePickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguagePicker({ isOpen, onClose }: LanguagePickerProps) {
  const { t } = useTranslation("common");
  const { current, change } = useLanguage();
  const [query, setQuery] = useState("");

  // Prepare the list of languages with localized names
  const languages = useMemo(() => mapLanguages(t), [t]);

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
        <div className="max-h-64 overflow-auto mt-2">
          <LanguageMenuList languages={filtered} onSelect={handleSelect} />
        </div>
      </div>
    </Modal>
  );
}
