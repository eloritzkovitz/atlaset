import { useTranslation } from "react-i18next";
import { DirectionalIcon, SelectInput } from "@components";
import { ICONS } from "@constants/icons";
import {
  CountrySelectModal,
  CountryWithFlag,
  useCountryData,
} from "@features/countries";
import { useHomeCountry } from "@features/user/profile/hooks/useHomeCountry";
import { useDisclosure } from "@hooks";
import { useDateLocale } from "../hooks/useDateLocale";
import { useLanguage } from "../hooks/useLanguage";
import { languageOptions } from "../utils/languages";
import { SettingsCard } from "../../core/components/SettingsCard";

export function LanguageRegionSection() {
  const { t: tSettings } = useTranslation("settings");
  const { t } = useTranslation("common");

  const { current, change } = useLanguage();
  const langOptions = languageOptions(t);

  const [dateLocale, setDateLocale] = useDateLocale();
  const dateOptions = [
    {
      label: tSettings("account.languageRegion.dateFormat.auto"),
      value: "auto",
    },
    { label: "DD/MM/YYYY", value: "en-GB" },
    { label: "MM/DD/YYYY", value: "en-US" },
  ];

  // Handle language change
  const handleLanguageChange = async (val: string | number) => {
    const selectedLang = String(val);
    if (selectedLang !== current) {
      change(selectedLang);
    }
  };

  // Home country selection
  const { countries, countryByIsoCode } = useCountryData();
  const { homeCountry, setHomeCountry } = useHomeCountry();

  const countryModal = useDisclosure();

  // Find the currently selected country object
  const selectedCountry = homeCountry
    ? (countryByIsoCode[homeCountry] ?? null)
    : null;

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
            onChange={(v) => handleLanguageChange(v)}
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
            value={dateLocale || "auto"}
            onChange={(v) => {
              const val = v === "auto" ? null : String(v);
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
            onClick={() => countryModal.open()}
            aria-label={tSettings(
              "account.languageRegion.homeCountry.selectAria",
            )}
          >
            {selectedCountry ? (
              <CountryWithFlag country={selectedCountry} />
            ) : (
              <span className="opacity-50">
                {tSettings("account.languageRegion.homeCountry.none")}
              </span>
            )}
            <DirectionalIcon direction="next" className="ms-auto text-muted" />
          </button>
        </div>

        <CountrySelectModal
          isOpen={countryModal.isOpen}
          selected={[homeCountry]}
          options={countries}
          onChange={(newCountries) => {
            if (newCountries.length > 0) {
              setHomeCountry(newCountries[0]);
              countryModal.close();
            }
          }}
          onClose={() => countryModal.close()}
          multiple={false}
        />
      </div>
    </SettingsCard>
  );
}
