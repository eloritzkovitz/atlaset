import { useState } from "react";
import { FaHouse } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { DirectionalIcon } from "@components";
import {
  CountrySelectModal,
  CountryWithFlag,
  useCountryData,
} from "@features/countries";
import { useHomeCountry } from "@features/user";
import { SettingsCard } from "../SettingsCard";

export function HomeCountrySelect() {
  const { countries } = useCountryData();
  const { homeCountry, setHomeCountry } = useHomeCountry();
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation("settings");

  // Find the currently selected country object
  const selectedCountry = countries.find((c) => c.isoCode === homeCountry);

  return (
    <SettingsCard title={t("account.homeCountry.title")} icon={<FaHouse />}>
      <button
        type="button"
        className="settings-select-btn bg-input hover:bg-input-hover flex items-center gap-3 px-3 py-2 my-2 rounded-lg transition w-full"
        onClick={() => setModalOpen(true)}
        aria-label={t("account.homeCountry.selectAria")}
      >
        {selectedCountry ? (
          <CountryWithFlag
            isoCode={selectedCountry.isoCode}
            name={selectedCountry.name}
          />
        ) : (
          <span className="opacity-50">{t("account.homeCountry.none")}</span>
        )}
        <DirectionalIcon direction="next" className="ms-auto text-muted" />
      </button>
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
    </SettingsCard>
  );
}
