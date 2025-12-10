import { useRef, useState } from "react";
import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import { useKeyboardFocusRing } from "@hooks/useKeyboardFocusRing";
import { useKeyHandler } from "@hooks/useKeyHandler";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus state and keyboard focus ring
  const [isFocused, setIsFocused] = useState(false);
  const showRing = useKeyboardFocusRing();

  // Focus search input when / is pressed
  useKeyHandler(
    (e) => {
      e.preventDefault();
      inputRef.current?.focus();
    },
    ["/"],
    true
  );

  // Blur search input when Escape is pressed
  useKeyHandler(
    (e) => {
      if (document.activeElement === inputRef.current) {
        e.preventDefault();
        inputRef.current?.blur();
      }
    },
    ["Escape"],
    true
  );

  return (
    <div
      className={`relative w-full rounded-full transition-shadow ${
        isFocused && showRing ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <FaMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        ref={inputRef}        
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            inputRef.current?.blur();
          }
        }}
        placeholder={placeholder}
        title={placeholder || "Search"}
        aria-label={placeholder || "Search"}
        className={`w-full pl-10 pr-10 py-2 bg-input rounded-full border border-none text-base focus:outline-none ${className}`}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          title="Clear search"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none"
        >
          <FaXmark />
        </button>
      )}
    </div>
  );
}
