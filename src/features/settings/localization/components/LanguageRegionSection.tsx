import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DirectionalIcon, SelectInput } from "@components";
import { ICONS } from "@constants/icons";
import {
  CountrySelectModal,
  CountryWithFlag,
  useCountryData,
} from "@features/countries";
import { useHomeCountry } from "@features/user/profile/hooks/useHomeCountry";
import { useDateLocale } from "../hooks/useDateLocale";
import { useLanguage } from "../hooks/useLanguage";
import { languageOptions } from "../utils/languages";
import { SettingsCard } from "../../common/components/SettingsCard";

export function LanguageRegionSection() {
  const { t: tSettings } = useTranslation("settings");
  const { t } = useTranslation("common");

  // Language selection
  const { current, change } = useLanguage();
  const langOptions = languageOptions(t);

  // Handle language change from select input
  const handleChange = async (val: string | number) => {
    change(String(val));
  };

  // Date locale selection
  const [dateLocale, setDateLocale] = useDateLocale();
  const dateOptions = [
    { label: tSettings("account.languageRegion.dateFormat.auto"), value: "" },
    { label: "DD/MM/YYYY", value: "en-GB" },
    { label: "MM/DD/YYYY", value: "en-US" },
  ];

  // Home country selection
  const { countries } = useCountryData();
  const { homeCountry, setHomeCountry } = useHomeCountry();
  const [modalOpen, setModalOpen] = useState(false);

  // Find the currently selected country object
  const selectedCountry = countries.find((c) => c.isoCode === homeCountry);

  return (
    <SettingsCard
      title={tSettings("account.languageRegion.title")}
      icon={<ICONS.countries />}
    >
      <div className="w-full space-y-4">
        <div>
          <label className="font-medium mb-2 block">
            {tSettings("account.languageRegion.language.title")}
          </label>
          <SelectInput
            value={current}
            onChange={(v) => handleChange(v)}
            options={langOptions}
            placeholder={tSettings("account.language.selectAria")}
            className="my-0"
          />
        </div>
        <div>
          <label className="font-medium mb-2 block">
            {tSettings("account.languageRegion.dateFormat.title")}
          </label>
          <SelectInput
            value={dateLocale ?? ""}
            onChange={(v) => {
              const val = v === "" ? null : String(v);
              setDateLocale(val);
            }}
            options={dateOptions}
            placeholder={tSettings(
              "account.languageRegion.dateFormat.selectAria",
            )}
            className="my-0"
          />
        </div>
        <div>
          <label className="font-medium mb-2 block">
            {tSettings("account.languageRegion.homeCountry.title")}
          </label>
          <button
            type="button"
            className="settings-select-btn bg-input hover:bg-input-hover flex items-center gap-3 px-3 py-2 rounded-lg transition w-full"
            onClick={() => setModalOpen(true)}
            aria-label={tSettings(
              "account.languageRegion.homeCountry.selectAria",
            )}
          >
            {selectedCountry ? (
              <CountryWithFlag
                isoCode={selectedCountry.isoCode}
                name={selectedCountry.name}
              />
            ) : (
              <span className="opacity-50">
                {tSettings("account.languageRegion.homeCountry.none")}
              </span>
            )}
            <DirectionalIcon direction="next" className="ms-auto text-muted" />
          </button>
        </div>

        <CountrySelectModal
          isOpen={modalOpen}
          selected={[homeCountry]}
          options={countries}
          onChange={(newCountries) => {
            if (newCountries.length > 0) {
              setHomeCountry(newCountries[0]);
              setModalOpen(false);
            }
          }}
          onClose={() => setModalOpen(false)}
          multiple={false}
        />
      </div>
    </SettingsCard>
  );
}
