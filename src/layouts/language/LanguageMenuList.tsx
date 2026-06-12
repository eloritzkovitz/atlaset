import { useTranslation } from "react-i18next";
import { MenuButton } from "@components";
import { ICONS } from "@constants/icons";
import { mapLanguages, useLanguage } from "@features/settings";

interface LanguageMenuListProps {
  languages: ReturnType<typeof mapLanguages>;
  onSelect: (code: string) => void;
}

export function LanguageMenuList({
  languages,
  onSelect,
}: LanguageMenuListProps) {
  const { t } = useTranslation("common");
  const { current } = useLanguage();

  return (
    <>
      {languages.map((l) => (
        <MenuButton
          key={l.code}
          icon={null}
          onClick={() => onSelect(l.code)}
          ariaLabel={t("menu.language.selectAria")}
          className={`w-full text-start py-2 px-3 flex items-center justify-between ${
            l.code === current ? "font-semibold" : ""
          }`}
        >
          <div className="flex-1">
            <div>{l.native}</div>
            <div className="text-sm text-muted/60">{l.localized}</div>
          </div>
          {l.code === current && <ICONS.selected className="text-success" />}
        </MenuButton>
      ))}
    </>
  );
}
