import { useMemo } from "react";
import { SearchInput } from "./SearchInput";
import { buildSearchRegex, escapeRegex, tokenizeSearch } from "./utils";

interface QualifierSearchProps {
  value: string;
  onChange: (value: string) => void;
  qualifiers?: string[];
  modifiers?: string[];
  clearable?: boolean;
  placeholder?: string;
  className?: string;
}

const EMPTY_STRINGS: string[] = [];

/** Renders a search input with support for qualifiers and modifiers. */
export function QualifierSearch({
  value,
  onChange,
  qualifiers,
  modifiers,
  clearable = true,
  placeholder,
  className,
}: QualifierSearchProps) {
  const providedQualifiers = qualifiers ?? EMPTY_STRINGS;
  const providedModifiers = modifiers ?? EMPTY_STRINGS;

  const hasQualifiers = providedQualifiers.length > 0;
  const hasModifiers = providedModifiers.length > 0;

  const qualifierAlternatives = useMemo(
    () =>
      hasQualifiers ? providedQualifiers.map(escapeRegex).join("|") : null,
    [hasQualifiers, providedQualifiers],
  );

  const modifierAlternatives = useMemo(
    () => (hasModifiers ? providedModifiers.map(escapeRegex).join("|") : null),
    [hasModifiers, providedModifiers],
  );

  const regex = useMemo(
    () => buildSearchRegex(qualifierAlternatives, modifierAlternatives),
    [qualifierAlternatives, modifierAlternatives],
  );

  const overlayContent = useMemo(() => {
    if (!value) {
      return undefined;
    }

    const tokens = tokenizeSearch(value, regex, hasQualifiers, hasModifiers);

    return (
      <span className="whitespace-pre">
        {tokens.map((token, index) => {
          if (token.type === "text") {
            return <span key={`text-${index}`}>{token.text}</span>;
          }

          const highlightClass =
            token.type === "qualifier"
              ? "bg-primary/50 rounded"
              : "bg-primary-active/50 rounded";

          return (
            <span key={`${token.type}-${index}`} className={highlightClass}>
              {token.text}
            </span>
          );
        })}
      </span>
    );
  }, [value, regex, hasQualifiers, hasModifiers]);

  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      overlayContent={overlayContent}
      showClear={clearable && value.length > 0}
      onClear={() => onChange("")}
    />
  );
}
