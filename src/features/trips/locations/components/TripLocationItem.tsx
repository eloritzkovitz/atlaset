import { useTranslation } from "react-i18next";
import { ActionButton, WikipediaButton } from "@components";
import { ICONS } from "@constants/icons";
import type { Location } from "@lib/locations";

interface TripLocationItemProps {
  location: Location;
  lang: string;
  selected?: boolean;
  onClick?: (location: Location) => void;
  onRemove?: (locationId: number) => void;
}

export function TripLocationItem({
  location,
  lang,
  selected = false,
  onClick,
  onRemove,
}: TripLocationItemProps) {
  const { t } = useTranslation("trips");

  return (
    <div
      className={`flex items-center justify-between rounded px-3 py-2 transition-colors bg-surface rounded-full ${
        selected ? "!bg-primary/70" : "hover:bg-primary-hover/35"
      }`}
    >
      <button
        type="button"
        onClick={() => onClick?.(location)}
        className="flex min-w-0 flex-1 items-center gap-2 text-start"
        aria-pressed={selected}
      >
        <ICONS.location
          className={`h-4 w-4 shrink-0 ${
            selected ? "text-info" : "text-muted"
          }`}
        />

        <span className={selected ? "font-medium" : ""}>{location.name}</span>
      </button>

      <div className="flex shrink-0 items-center gap-1">
        <WikipediaButton searchTerm={location.name} lang={lang} />

        {onRemove && (
          <ActionButton
            icon={<ICONS.close />}
            variant="custom"
            className="p-1"
            ariaLabel={t("editor.actions.remove")}
            onClick={() => onRemove(location.id)}
          />
        )}
      </div>
    </div>
  );
}
