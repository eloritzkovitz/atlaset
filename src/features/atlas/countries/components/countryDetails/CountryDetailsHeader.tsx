import { useTranslation } from "react-i18next";
import { PanelHeader, ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import {
  CountryWithFlag,
  VisitedStatusIndicator,
  type Country,
} from "@features/countries";
import { useCountryActions } from "../../hooks/useCountryActions";

interface CountryDetailsHeaderProps {
  country: Country;
  isVisited: boolean;
  isHome: boolean;
  isUpcoming?: boolean;
  onClose: () => void;
}

export function CountryDetailsHeader({
  country,
  isVisited,
  isHome,
  isUpcoming = false,
  onClose,
}: CountryDetailsHeaderProps) {
  const { t } = useTranslation("atlas");

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
    <PanelHeader
      title={
        <span className="flex items-center gap-2 break-words max-w-[16vw]">
          <CountryWithFlag
            isoCode={country.isoCode}
            name={country.name}
            className="font-bold text-lg"
          />
          <span className="text-muted text-sm">({country.isoCode})</span>
          <VisitedStatusIndicator
            visited={isVisited}
            isHome={isHome}
            isUpcoming={isUpcoming}
          />
        </span>
      }
      showSeparator
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

        <ActionButton
          onClick={onClose}
          ariaLabel={t("common:actions.close")}
          title={t("common:actions.close")}
          icon={<ICONS.close className="text-2xl" />}
          rounded
        />
      </div>
    </PanelHeader>
  );
}
