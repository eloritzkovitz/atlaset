import { FaPenToSquare } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { SelectedCountriesList } from "./SelectedCountriesList";

interface CountriesSectionProps {
  selectedCountries: { isoCode: string; name: string }[];
  onEdit: () => void;
  onRemove: (isoCode: string) => void;
}

export function CountriesSection({
  selectedCountries,
  onEdit,
  onRemove,
}: CountriesSectionProps) {
  const { t } = useTranslation("trips");
  
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold">{t("modal.form.countriesTitle")}</span>
        <button
          type="button"
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-input-hover text-sm font-medium"
          onClick={onEdit}
          aria-label={
            selectedCountries.length > 0
              ? t("modal.editCountries")
              : t("modal.selectCountries")
          }
        >
          <FaPenToSquare className="me-1" />
          {selectedCountries.length > 0
            ? t("modal.actions.edit")
            : t("modal.actions.add")}
        </button>
      </div>
      <SelectedCountriesList
        selectedCountries={selectedCountries}
        onRemove={onRemove}
      />
    </div>
  );
}
