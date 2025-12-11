import { useKeyboardFocusRing } from "@hooks/useKeyboardFocusRing";
import { useState } from "react";
import { PiArrowsDownUpBold } from "react-icons/pi";

interface CountrySortSelectProps {
  value: string;
  onChange: (value: string) => void;
  visitedOnly?: boolean;
}

export function CountrySortSelect({
  value,
  onChange,
  visitedOnly,
}: CountrySortSelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const showRing = useKeyboardFocusRing();

  return (
    <div
      className={`relative ml-2 flex items-stretch rounded transition-shadow ${
        isFocused && showRing ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 text-gray-700 focus:outline-none dark:bg-gray-500 dark:text-gray-200"
        aria-label="Sort countries"
        title="Sort countries"
      >
        <option value="name-asc">Name (ascending)</option>
        <option value="name-desc">Name (descending)</option>
        <option value="iso-asc">ISO 3166 code (ascending)</option>
        <option value="iso-desc">ISO 3166 code (descending)</option>
        {visitedOnly && (
          <>
            <option value="firstVisit-asc">First visit time (ascending)</option>
            <option value="firstVisit-desc">
              First visit time (descending)
            </option>
            <option value="lastVisit-asc">Last visit time (ascending)</option>
            <option value="lastVisit-desc">Last visit time (descending)</option>
          </>
        )}
      </select>
      <span
        className="bg-input text-action-header text-base flex items-center justify-center h-10 w-10 rounded-lg relative z-10 focus:outline-none"
        aria-hidden="true"
      >
        <PiArrowsDownUpBold size="24" />
      </span>
    </div>
  );
}
