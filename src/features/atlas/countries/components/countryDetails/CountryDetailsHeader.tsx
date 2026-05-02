import { FaWikipediaW } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PanelHeader, ActionButton } from "@components";
import { ICONS } from "@constants/icons";
import { CountryWithFlag, type Country } from "@features/countries";
import { VisitedStatusIndicator } from "@features/countries/components/countryDetails/VisitedStatusIndicator";

interface CountryDetailsHeaderProps {
  country: Country;
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
  const navigate = useNavigate();
  const { t } = useTranslation("atlas");
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
          <VisitedStatusIndicator visited={isVisited} isHome={isHome} />
        </span>
      }
      showSeparator
    >
      <div className="flex gap-2">
        {centerOnCountry && (
          <ActionButton
            onClick={() => centerOnCountry(country.isoCode)}
            ariaLabel={t("countries.details.header.centerMapAria")}
            title={t("countries.details.header.centerMap")}
            icon={<ICONS.center />}
            rounded
          />
        )}
        <ActionButton
          onClick={() => {
            onClose();
            navigate(
              `/dashboard/countries/${country.region}/${country.subregion}/${country.isoCode}`,
            );
          }}
          ariaLabel={t("countries.details.header.viewFullAria")}
          title={t("countries.details.header.viewFull")}
          icon={<ICONS.exploration />}
          rounded
        />
        <ActionButton
          onClick={() =>
            window.open(
              `https://en.wikipedia.org/wiki/${country.name.replace(/ /g, "_")}`,
              "_blank",
              "noopener,noreferrer",
            )
          }
          ariaLabel={t("countries.details.header.wikipediaAria")}
          title={t("countries.details.header.wikipedia")}
          icon={<FaWikipediaW />}
          rounded
        />
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
