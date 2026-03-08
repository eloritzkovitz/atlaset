import { useState, useRef, useMemo, useEffect } from "react";
import { Modal } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import { useUI } from "@contexts/UIContext";
import {
  CountryDetailsContent,
  getCountryRelations,
  useCountryData,
  type Country,
} from "@features/countries";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { useKeyHandler } from "@hooks";
import { CountryVisitsContent } from "./CountryVisitsContent";
import { CountryDetailsHeader } from "./CountryDetailsHeader";
import {
  CountryDetailsTabs,
  type CountryDetailsTab,
} from "./CountryDetailsTabs";
import { CountryRelationsContent } from "./CountryRelationsContent";

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
  const [activeTab, setActiveTab] = useState<CountryDetailsTab>("overview");

  // Reset tab to overview when modal closes
  useEffect(() => {
    if (!isOpen) setActiveTab("overview");
  }, [isOpen]);
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

  // Determine if the country has relations for showing the dependencies tab
  const hasRelationsTab = country
    ? getCountryRelations(country.isoCode).hasRelations
    : false;

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
            country={{ isoCode: country.isoCode, name: country.name }}
            isVisited={isVisited}
            isHome={homeCountry === country.isoCode}
            centerOnCountry={centerOnCountry}
            onClose={onClose}
          />
          <CountryDetailsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            showDependenciesTab={hasRelationsTab}
          />
          <div className="relative flex-1 max-h-[510px] overflow-y-auto mt-4 -mx-2">
            <div key={activeTab} className={"transition-opacity duration-300 px-4"}>
              {activeTab === "overview" ? (
                <CountryDetailsContent
                  country={country}
                  currencies={currencies}
                />
              ) : activeTab === "visits" ? (
                <CountryVisitsContent visits={categorizedVisits} />
              ) : hasRelationsTab ? (
                <CountryRelationsContent country={country} />
              ) : null}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
