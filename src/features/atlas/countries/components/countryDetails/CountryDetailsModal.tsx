import { useMemo, useRef } from "react";
import { Modal } from "@components";
import { useMapView } from "@contexts/MapViewContext";
import { useUI } from "@contexts/UIContext";
import {
  CountryDetailsPanel,
  getCountryRelations,
  useCountryData,
  type Country,
} from "@features/countries";
import { useHomeCountry } from "@features/user";
import { useVisitedCountries } from "@features/visits";
import { useKeyHandler } from "@hooks";
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
          <CountryDetailsPanel
            country={country}
            currencies={currencies}
            categorizedVisits={categorizedVisits}
            hasRelationsTab={!!hasRelationsTab}
            resetTabOnClose={true}
            isOpen={!!isOpen}
            className="max-h-[515px]"
          />
        </div>
      </Modal>
    </div>
  );
}
