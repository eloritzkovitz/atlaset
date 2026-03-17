import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import { useUI } from "@contexts/UIContext";
import { useCountryData, type Country } from "@features/countries";
import { CountryDetailsPanel } from "@features/countries/components/countryDetails/CountryDetailsPanel";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { useKeyHandler } from "@hooks";
import { CountryDetailsHeader } from "./CountryDetailsHeader";

interface CountryDetailsModalProps {
  country: Country | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CountryDetailsModal({
  country,
  isOpen,
  onClose,
}: CountryDetailsModalProps) {
  const { countries, currencies } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const { centerOnCountry } = useMapView();
  const { showCalendar } = useUI();

  const [currentCountry, setCurrentCountry] = useState<Country | null>(country);

  // Visited status and categorized visits
  const { isCountryVisited, getCountryVisitsCategorized } =
    useVisitedCountries();
  const isVisited = country ? isCountryVisited(country.isoCode) : false;
  const categorizedVisits = useMemo(
    () =>
      country
        ? getCountryVisitsCategorized(country.isoCode)
        : { past: [], upcoming: [], tentative: [] },
    [country, getCountryVisitsCategorized],
  );

  const modalRef = useRef<HTMLDivElement>(null);

  // Center map handler
  useKeyHandler(
    (e) => {
      e.preventDefault();
      centerOnCountry(country?.isoCode || "");
    },
    ["x", "X"],
    isOpen,
  );

  // Update state when modal opens/closes or country prop changes
  useEffect(() => {
    setCurrentCountry(country);
  }, [country, isOpen]);

  // Handler to change country
  const handleSelectCountry = (isoCode: string) => {
    const found = countries.find((c) => c.isoCode === isoCode);
    if (found) setCurrentCountry(found);
  };

  // Do not render if no country is selected
  if (!currentCountry) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center select-none">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl md:w-[540px] min-h-[650px] sm:p-8 shadow-lg relative"
        containerRef={modalRef}
        disableClose={showCalendar}
      >
        <div className="relative overflow-visible flex flex-col h-full">
          <CountryDetailsHeader
            country={{
              isoCode: currentCountry.isoCode,
              name: currentCountry.name,
            }}
            isVisited={isVisited}
            isHome={homeCountry === currentCountry.isoCode}
            centerOnCountry={centerOnCountry}
            onClose={onClose}
          />
          <CountryDetailsPanel
            country={currentCountry}
            currencies={currencies}
            categorizedVisits={categorizedVisits}
            resetTabOnClose={true}
            isOpen={!!isOpen}
            onSelectCountry={handleSelectCountry}
            className="max-h-[515px]"
          />
        </div>
      </Modal>
    </div>
  );
}
