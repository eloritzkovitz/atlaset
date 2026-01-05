import { useState } from "react";
import { FaHouse, FaChevronRight } from "react-icons/fa6";
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

  // Find the currently selected country object
  const selectedCountry = countries.find((c) => c.isoCode === homeCountry);

  return (
    <SettingsCard title="Home Country" icon={<FaHouse />}>
      <button
        type="button"
        className="settings-select-btn bg-input hover:bg-input-hover flex items-center gap-3 px-3 py-2 my-2 rounded-lg transition w-full"
        onClick={() => setModalOpen(true)}
        aria-label="Select home country"
      >
        {selectedCountry ? (
          <CountryWithFlag
            isoCode={selectedCountry.isoCode}
            name={selectedCountry.name}
          />
        ) : (
          <span className="opacity-50">No country selected</span>
        )}
        <FaChevronRight className="ml-auto text-muted" />
      </button>
      {/* Country selection modal */}
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
