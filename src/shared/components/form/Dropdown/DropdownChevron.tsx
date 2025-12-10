import { FaChevronDown } from "react-icons/fa6";

export function DropdownChevron() {
  return (
    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
      <FaChevronDown />
    </span>
  );
}
