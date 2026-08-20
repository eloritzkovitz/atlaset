import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@components";
import { useUI } from "@app/contexts/UIContext";
import { useMapView } from "@features/atlas/map/context/MapViewContext";
import { useCountryData, type Country } from "@features/countries";
import { CountryDetailsPanel } from "@features/countries/details/components/CountryDetailsPanel";
import { useAccessibility } from "@features/settings";
import { useCountryTracking } from "@features/visits";
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
  const { singleKeyShortcutsEnabled } = useAccessibility();
  const { countries, currencies } = useCountryData();
  const { centerOnCountry } = useMapView();
  const { showCalendar } = useUI();

  const [currentCountry, setCurrentCountry] = useState<Country | null>(country);

  // Get visit context functions from the visited countries hook
  const { getCountryVisitsCategorized } = useCountryTracking();
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
    { enabled: isOpen, allowSingleKeyShortcuts: singleKeyShortcutsEnabled },
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
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl md:w-[540px] h-[88vh] flex flex-col p-4 sm:p-6 md:p-8 shadow-lg relative overflow-hidden"
        containerRef={modalRef}
        disableClose={showCalendar}
        draggable
      >
        <div className="relative flex flex-col h-full min-h-0 overflow-hidden">
          <CountryDetailsHeader country={currentCountry} onClose={onClose} />
          <CountryDetailsPanel
            country={currentCountry}
            countries={countries}
            currencies={currencies}
            categorizedVisits={categorizedVisits}
            resetTabOnClose={true}
            isOpen={!!isOpen}
            onSelectCountry={handleSelectCountry}
            className="flex-1 min-h-0"
          />
        </div>
      </Modal>
    </div>
  );
}
