import { useState } from "react";
import { FaHouse, FaChevronRight } from "react-icons/fa6";
import { Checkbox, CollapsibleHeader } from "@components";
import { useCountryData } from "@contexts/CountryDataContext";
import { CountrySelectModal, CountryWithFlag } from "@features/countries";
import { useHomeCountry } from "@features/settings";

export function HomeCountrySelect() {
  const { countries } = useCountryData();
  const { homeCountry, setHomeCountry, colorHomeCountry, setColorHomeCountry } =
    useHomeCountry();
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);

  // Find the currently selected country object
  const selectedCountry = countries.find((c) => c.isoCode === homeCountry);

  return (
    <div className="settings-group">
      <CollapsibleHeader
        icon={<FaHouse />}
        label="Home Country"
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
      />
      {expanded && (
        <button
          type="button"
          className="settings-select-btn bg-input hover:bg-input-hover flex items-center gap-3 px-3 py-2 my-4 rounded-lg transition"
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
      )}      
      <Checkbox
        checked={!!colorHomeCountry}
        onChange={setColorHomeCountry}
        label="Color home country on map"
      />
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
