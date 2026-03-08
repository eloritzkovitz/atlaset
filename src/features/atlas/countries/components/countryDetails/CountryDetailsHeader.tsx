import { FaWikipediaW } from "react-icons/fa6";
import { PanelHeader, ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import { CountryWithFlag } from "@features/countries";
import { VisitedStatusIndicator } from "@features/countries/components/countryDetails/VisitedStatusIndicator";

interface CountryDetailsHeaderProps {
  country: {
    isoCode: string;
    name: string;
  };
  isVisited: boolean;
  isHome: boolean;
  centerOnCountry?: (isoCode: string) => void;
  onClose: () => void;
}

export function CountryDetailsHeader({
  country,
  isVisited,
  isHome,
  centerOnCountry,
  onClose,
}: CountryDetailsHeaderProps) {
  return (
    <PanelHeader
      title={
        <span className="flex items-center gap-2 break-words max-w-[15vw]">
          <CountryWithFlag
            isoCode={country.isoCode}
            name={country.name}
            className="font-bold text-lg"
          />
          <span className="text-muted text-sm">({country.isoCode})</span>
          <VisitedStatusIndicator visited={isVisited} isHome={isHome} />
        </span>
      }
      showSeparator
    >
      <div className="flex gap-2">
        {centerOnCountry && (
          <ActionButton
            onClick={() => centerOnCountry(country.isoCode)}
            ariaLabel="Center map on country"
            title="Center map"
            icon={<ICONS.center />}
            rounded
          />
        )}
        <ActionButton
          onClick={() =>
            window.open(
              `https://en.wikipedia.org/wiki/${country.name.replace(/ /g, "_")}`,
              "_blank",
              "noopener,noreferrer",
            )
          }
          ariaLabel="Open Wikipedia article"
          title="Wikipedia"
          icon={<FaWikipediaW />}
          rounded
        />
        <ActionButton
          onClick={onClose}
          ariaLabel="Close country details"
          title="Close"
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      </div>
    </PanelHeader>
  );
}
