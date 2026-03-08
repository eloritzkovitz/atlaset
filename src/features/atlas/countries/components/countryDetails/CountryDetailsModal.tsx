import { useState, useRef, useMemo } from "react";
import { Modal } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import { useUI } from "@contexts/UIContext";
import {
  CountryDetailsContent,
  useCountryData,
  type Country,
} from "@features/countries";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { useKeyHandler } from "@hooks";
import { CountryVisitsContent } from "./CountryVisitsContent";
import { CountryDetailsTabs } from "./CountryDetailsTabs";
import { CountryDetailsHeader } from "./CountryDetailsHeader";

interface CountryDetailsModalProps {
  isOpen: boolean;
  country: Country | null;
  onClose: () => void;
}

export function CountryDetailsModal({
  isOpen,
  country,
  onClose,
}: CountryDetailsModalProps) {
  const { currencies } = useCountryData();
  const { homeCountry } = useHomeCountry();
  const { centerOnCountry } = useMapView();
  const { showCalendar } = useUI();

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

  // Tab state
  const [activeTab, setActiveTab] = useState<"details" | "visits">("details");
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

  // Do not render if no country is selected
  if (!country) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center select-none">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl md:w-[540px] min-h-[640px] sm:p-8 shadow-lg relative"
        containerRef={modalRef}
        disableClose={showCalendar}
      >
        <div className="relative overflow-visible flex flex-col">
          <CountryDetailsHeader
            country={{ isoCode: country.isoCode, name: country.name }}
            isVisited={isVisited}
            isHome={homeCountry === country.isoCode}
            centerOnCountry={centerOnCountry}
            onClose={onClose}
          />
          <CountryDetailsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div className="flex-1 relative">
            <div
              key={activeTab}
              className={"absolute inset-0 transition-opacity duration-300"}
            >
              {activeTab === "details" ? (
                <CountryDetailsContent
                  country={country}
                  currencies={currencies}
                />
              ) : (
                <CountryVisitsContent visits={categorizedVisits} />
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
