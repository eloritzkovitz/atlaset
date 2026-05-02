import { useTranslation } from "react-i18next";
import { SelectInput } from "@components";
import { ICONS } from "@constants/icons";
import { SettingsCard } from "../SettingsCard";
import { useLanguage } from "../../hooks/useLanguage";

const LANG_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "en", labelKey: "label.en" },
  { value: "he", labelKey: "label.he" },
];

export function LanguageSelect() {
  const { t } = useTranslation("settings");
  const { current, change } = useLanguage();

  const options = LANG_OPTIONS.map((opt) => ({
    value: opt.value,
    label: t(`account.language.${opt.labelKey}`),
  }));

  const handleChange = async (val: string | number) => {
    await change(String(val));
  };

  return (
    <SettingsCard
      title={t("account.language.title")}
      icon={<ICONS.language className="text-xl" />}
    >
      <SelectInput
        value={current}
        onChange={(v) => handleChange(v)}
        options={options}
        placeholder={t("account.language.selectAria")}
        className="my-0"
      />
    </SettingsCard>
  );
}
