import { useTranslation } from "react-i18next";
import { Tooltip } from "@components";
import { ICONS } from "@constants/icons";

interface TripIndicatorsProps {
  favorite?: boolean;
  sharedWithMe?: boolean;
}

export function TripIndicators({
  favorite = false,
  sharedWithMe = false,
}: TripIndicatorsProps) {
  const { t } = useTranslation("trips");

  if (!favorite && !sharedWithMe) {
    return null;
  }

  return (
    <span className="inline-flex items-center">
      {favorite && (
        <Tooltip content={t("indicators.favorite", "Favorite")}>
          <span className="inline-flex">
            <ICONS.favorite className="h-5 w-5 text-danger" />
          </span>
        </Tooltip>
      )}

      {sharedWithMe && (
        <Tooltip content={t("indicators.sharedWithMe", "Shared with me")}>
          <span className="ms-2 inline-flex">
            <ICONS.friends className="h-5 w-5 text-success" />
          </span>
        </Tooltip>
      )}
    </span>
  );
}
