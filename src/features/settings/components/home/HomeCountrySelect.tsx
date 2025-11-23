import { useState } from "react";
import { FaHome, FaChevronDown } from "react-icons/fa";
import { CollapsibleHeader } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountrySelectModal, CountryWithFlag } from "@features/countries";
import { useHomeCountry } from "@features/settings";

export function HomeCountrySelect() {
  const { countries } = useCountryData();
  const { homeCountry, setHomeCountry } = useHomeCountry();
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // Find the currently selected country object

  const selectedCountry = countries.find((c) => c.isoCode === homeCountry);

  return (
    <div className="settings-group">
      <CollapsibleHeader
        icon={<FaHome />}
        label="Home Country"
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
      />
      {expanded && (
        <button
          type="button"
          className="settings-select-btn flex items-center gap-3 px-3 py-2 rounded border bg-gray-200 dark:bg-gray-600 text-dark hover:bg-gray-300 dark:hover:bg-gray-500 transition"
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
          <FaChevronDown className="ml-auto text-gray-400" />
        </button>
      )}
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
    </div>
  );
}
