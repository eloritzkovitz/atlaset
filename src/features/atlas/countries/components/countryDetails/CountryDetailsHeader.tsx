import { ActionButton, ModalHeader } from "@components";
import {
  CountryWithFlag,
  VisitedStatusIndicator,
  type Country,
} from "@features/countries";
import { useCountryActions } from "../../hooks/useCountryActions";

interface CountryDetailsHeaderProps {
  country: Country;
  onClose: () => void;
}

export function CountryDetailsHeader({
  country,
  onClose,
}: CountryDetailsHeaderProps) {
  const actionsObj = useCountryActions({
    country,
  });

  const displayedActions = [
    actionsObj.toggleWantToVisit,
    actionsObj.exploreCountry,
    actionsObj.wikipedia,
  ].filter((action) => Boolean(action) && !action?.disabled);

  return (
    <ModalHeader
      title={
        <span className="flex items-center gap-2 break-words max-w-[16vw]">
          <CountryWithFlag country={country} className="font-bold text-lg" />
          <span className="text-muted text-sm">({country.isoCode})</span>
          <VisitedStatusIndicator
            country={country}
            onClick={actionsObj.toggleVisited?.onClick}
            className="cursor-pointer hover:opacity-80"
          />
        </span>
      }
      onClose={onClose}
    >
      <div className="flex gap-2">
        {displayedActions.map((action, idx) => (
          <ActionButton
            key={idx}
            url={action.url}
            onClick={action.onClick}
            ariaLabel={action.ariaLabel}
            title={action.label}
            icon={action.icon}
            rounded
          />
        ))}
      </div>
    </ModalHeader>
  );
}
