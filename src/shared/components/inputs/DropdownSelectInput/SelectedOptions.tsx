import type { DropdownOption } from "@types";
import { flattenOptions } from "@utils/dropdown";
import { ChipList } from "../../display/Chip/ChipList";

interface SelectedOptionsProps<T> {
  value: T[];
  options: DropdownOption<T>[];
  onRemove: (val: T) => void;
  limit?: number;
}

/** Displays selected dropdown options. */
export function SelectedOptions<T>({
  value,
  options,
  onRemove,
  limit = 2,
}: SelectedOptionsProps<T>) {
  const flatOptions = flattenOptions(options);
  const selected = flatOptions.filter((opt) => value.includes(opt.value));

  return (
    <ChipList
      items={selected}
      limit={limit}
      renderItem={(opt) => opt.label}
      removable
      onRemove={(opt) => onRemove(opt.value)}
    />
  );
}
