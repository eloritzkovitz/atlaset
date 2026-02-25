import { FaPenToSquare } from "react-icons/fa6";
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
  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold">Countries</span>
        <button
          type="button"
          className="flex items-center gap-1 px-2 py-1 rounded hover:bg-input-hover text-sm font-medium"
          onClick={onEdit}
          aria-label={
            selectedCountries.length > 0 ? "Edit Countries" : "Select Countries"
          }
        >
          <FaPenToSquare className="mr-1" />
          {selectedCountries.length > 0 ? "Edit" : "Add"}
        </button>
      </div>
      <SelectedCountriesList
        selectedCountries={selectedCountries}
        onRemove={onRemove}
      />
    </div>
  );
}
