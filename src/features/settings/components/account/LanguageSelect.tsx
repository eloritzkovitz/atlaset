import { useTranslation } from "react-i18next";
import { SelectInput } from "@components";
import { ICONS } from "@constants/icons";
import { LANGUAGES } from "@constants/languages";
import { SettingsCard } from "../SettingsCard";
import { useLanguage } from "../../hooks/useLanguage";

export function LanguageSelect() {
  const { t: tSettings } = useTranslation("settings");
  const { current, change } = useLanguage();

  // Generate options for the select input based on available languages
  const options = (Array.isArray(LANGUAGES) ? LANGUAGES : []).map((l) => ({
    value: l.code,
    label: l.nativeName,
  }));

  // Handle language change from select input
  const handleChange = async (val: string | number) => {
    change(String(val));
  };

  return (
    <SettingsCard
      title={tSettings("account.language.title")}
      icon={<ICONS.language className="text-xl" />}
    >
      <SelectInput
        value={current}
        onChange={(v) => handleChange(v)}
        options={options}
        placeholder={tSettings("account.language.selectAria")}
        className="my-0"
      />
    </SettingsCard>
  );
}
