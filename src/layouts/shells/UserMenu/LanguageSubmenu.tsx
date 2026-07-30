import { useTranslation } from "react-i18next";
import {
  LanguageMenuList,
  mapLanguages,
  useLanguage,
} from "@features/settings";
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
      <UserSubmenuHeader
        title={t("navigation.menu.language")}
        onBack={onBack}
      />

      <div className="max-h-64 overflow-auto p-1">
        <LanguageMenuList languages={languages} onSelect={handleSelect} />
      </div>
    </>
  );
}
