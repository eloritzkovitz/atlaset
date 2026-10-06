import { useEffect, useMemo, useRef, useState } from "react";
import { useUI } from "@app/contexts/UIContext";
import { Modal, Sheet, type OverlayProps } from "@components";
import { useCenterOnCountry } from "@features/atlas/map/hooks/useCenterOnCountry";
import { useCalendarNavigation } from "@features/calendar";
import {
  CountryDetailsPanel,
  useCountryData,
  type Country,
} from "@features/countries";
import { useAccessibility } from "@features/settings/accessibility";
import { useCountryTracking } from "@features/visits";
import { useKeyHandler, useScreenSize } from "@hooks";
import { CountryDetailsHeader } from "./CountryDetailsHeader";

interface CountryDetailsModalProps extends OverlayProps {
  country: Country | null;
}

export function CountryDetailsModal({
  country,
  isOpen,
  onClose,
}: CountryDetailsModalProps) {
  const { singleKeyShortcutsEnabled } = useAccessibility();
  const { openTripInCalendar } = useCalendarNavigation();
  const { countryByIsoCode, currencies } = useCountryData();
  const centerOnCountry = useCenterOnCountry();
  const { showCalendar } = useUI();
  const { isMobile } = useScreenSize();

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
    const country = countryByIsoCode[isoCode];
    if (country) setCurrentCountry(country);
  };

  // Do not render if no country is selected
  if (!currentCountry) return null;

  const content = (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <CountryDetailsHeader country={currentCountry} onClose={onClose} />
      <CountryDetailsPanel
        country={currentCountry}
        currencies={currencies}
        categorizedVisits={categorizedVisits}
        resetTabOnClose={true}
        isOpen={!!isOpen}
        onSelectCountry={handleSelectCountry}
        onTripClick={openTripInCalendar}
        className="min-h-0 flex-1"
      />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet
        isOpen={isOpen}
        onClose={onClose}
        disableClose={showCalendar}
        className="h-[92dvh]"
      >
        {content}
      </Sheet>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center select-none">
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="h-[88vh] w-full max-w-lg relative flex flex-col overflow-hidden shadow-lg sm:max-w-xl md:w-[640px] md:max-w-2xl"
        containerRef={modalRef}
        disableClose={showCalendar}
        draggable
      >
        {content}
      </Modal>
    </div>
  );
}
