import { useTranslation } from "react-i18next";
import { mapLanguages, useLanguage } from "@features/settings";
import { LanguageMenuList } from "../../language/LanguageMenuList";
import { UserSubmenuHeader } from "./UserSubmenuHeader";

interface LanguageSubmenuProps {
  onBack: () => void;
}

export function LanguageSubmenu({ onBack }: LanguageSubmenuProps) {
  const { t } = useTranslation("common");
  const { change } = useLanguage();

  const languages = mapLanguages(t);

  const handleSelect = (code: string) => {
    change(code);
  };

  return (
    <>
      <UserSubmenuHeader title={t("menu.language")} onBack={onBack} />

      <div className="max-h-64 overflow-auto">
        <LanguageMenuList languages={languages} onSelect={handleSelect} />
      </div>
    </>
  );
}
