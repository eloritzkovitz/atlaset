import type { DropdownOption } from "@types";
import { flattenOptions } from "@utils/dropdown";
import { Chip } from "../../../../components/ui/Chip/Chip";

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
          <Chip key={i} removable={true} onRemove={() => onRemove(opt.value)}>
            {opt.label}
          </Chip>
        ))}
    </span>
  );
}
