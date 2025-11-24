import { FaXmark } from "react-icons/fa6";
import type { DropdownOption } from "@types";
import { flattenOptions } from "@utils/dropdown";

interface SelectedOptionsProps<T> {
  value: T[];
  options: DropdownOption<T>[];
  onRemove: (val: T) => void;
}

export function SelectedOptions<T>({
  value,
  options,
  onRemove,
}: SelectedOptionsProps<T>) {
  const flatOptions = flattenOptions(options);

  return (
    <span className="flex flex-wrap gap-1 h-8">
      {flatOptions
        .filter((opt) => value.includes(opt.value))
        .map((opt, i) => (
          <span key={i} className="selected-option">
            {opt.label}
            <button
              type="button"
              className="ml-1 text-blue-500 dark:text-gray-200 hover:text-gray-400 focus:outline-none"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(opt.value);
              }}
              aria-label={`Remove ${opt.label}`}
            >
              <FaXmark className="w-3 h-3" />
            </button>
          </span>
        ))}
    </span>
  );
}
