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
  // Get action configurations based on country and context
  const actionsObj = useCountryActions({
    country,
  });

  const displayedActions = [
    actionsObj.centerMap,
    actionsObj.viewDashboard,
    actionsObj.wikipedia,
  ].filter(Boolean);

  return (
    <ModalHeader
      title={
        <span className="flex items-center gap-2 break-words max-w-[16vw]">
          <CountryWithFlag
            isoCode={country.isoCode}
            name={country.name}
            className="font-bold text-lg"
          />
          <span className="text-muted text-sm">({country.isoCode})</span>
          <VisitedStatusIndicator country={country} />
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
