import { useEffect, type KeyboardEvent } from "react";
import { useAutocomplete, usePendingFocus } from "@hooks";
import { QualifierToken } from "./QualifierToken";
import { SearchInput } from "./SearchInput";

interface AutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  suggestionProvider: (input: string) => string[];
  onSelect?: (suggestion: string, input: string) => string | void;
  placeholder?: string;
  maxSuggestions?: number;
  className?: string;
  qualifierClearable?: boolean;
}

export function Autocomplete({
  value,
  onChange,
  suggestionProvider,
  onSelect,
  placeholder,
  maxSuggestions = 6,
  className = "",
  qualifierClearable = true,
}: AutocompleteProps) {
  const { setRef: setInputRef, requestFocus, inputRef } = usePendingFocus();

  // Manage autocomplete suggestions and selection logic
  const {
    topSuggestion,
    propCandidate,
    afterColon,
    hasColon,
    handleKeyDown,
    isPrefixValid,
    commitWithPrefix,
    clearQualifier,
  } = useAutocomplete({
    value,
    onChange,
    suggestionProvider,
    onSelect: onSelect,
    postSelect: () => {
      requestFocus();
    },
    maxSuggestions,
    debounceMs: 60,
  });
  const isValidPrefix = isPrefixValid ?? false;

  // If the qualifier becomes active, ensure the new input receives focus
  useEffect(() => {
    if (hasColon && isValidPrefix) {
      requestFocus();
    }
  }, [hasColon, isValidPrefix, requestFocus]);

  const rawAfter = afterColon ?? "";
  const startsWithTrue = rawAfter.trimStart().toLowerCase().startsWith("true");
  const lockedSuffix =
    hasColon && isValidPrefix && startsWithTrue ? "true" : undefined;

  // Editable portion of the input after the colon.
  // If the suffix is locked, this will be the part after the locked suffix.
  let editableAfter: string | undefined;
  if (hasColon && isValidPrefix) {
    if (lockedSuffix) {
      const leading = rawAfter.match(/^\s*/)?.[0] ?? "";
      let start = leading.length + lockedSuffix.length;
      if (rawAfter[start] === " ") start += 1;
      editableAfter = rawAfter.slice(start);
    } else {
      editableAfter = rawAfter;
    }
  }

  // If the locked suffix is present, the user should not be able to edit it, and the input should always end with it
  const displayValue = hasColon
    ? isValidPrefix
      ? (editableAfter ?? "")
      : value
    : value;

  return (
    <div className={`relative ${className}`}>
      {hasColon && isValidPrefix ? (
        <div className="flex items-center">
          <QualifierToken
            // Prefer the committed propCandidate for the visible label so a
            // stale debounced `topSuggestion` doesn't briefly override it.
            label={(propCandidate || topSuggestion) + ":"}
            lockedSuffix={lockedSuffix}
            clearable={qualifierClearable}
            onClear={() => {
              clearQualifier();
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
          />
          <SearchInput
            ref={setInputRef}
            value={displayValue}
            onChange={(v) => {
              if (v === "") {
                if (lockedSuffix) {
                  commitWithPrefix(lockedSuffix);
                  return;
                }
                commitWithPrefix("");
                return;
              }

              if (lockedSuffix) {
                const combined = `${lockedSuffix} ${v}`.trim();
                commitWithPrefix(combined);
                return;
              }
              commitWithPrefix(v);
            }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              // Only clear qualifier when Backspace pressed at the start of an already-empty editable input.
              if (
                e.key === "Backspace" &&
                hasColon &&
                isValidPrefix &&
                qualifierClearable
              ) {
                const el = inputRef.current;
                const val = el?.value ?? "";
                const selStart = el?.selectionStart ?? null;
                if (
                  (val === "" && selStart === 0) ||
                  (val === "" && selStart === null)
                ) {
                  e.preventDefault();
                  requestFocus();
                  clearQualifier();
                  return;
                }
              }
              handleKeyDown(e);
            }}
            placeholder={undefined}
            showIcon={false}
            showClear={true}
            onClear={() => {
              if (qualifierClearable) {
                clearQualifier();
                return;
              }

              // If not clearable, just reset the after-colon part but keep the qualifier
              if (hasColon && isValidPrefix) {
                if (lockedSuffix) {
                  commitWithPrefix(lockedSuffix);
                } else {
                  commitWithPrefix("");
                }
              } else {
                onChange("");
              }
            }}
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
          />
        </div>
      ) : (
        <>
          <SearchInput
            ref={setInputRef}
            value={displayValue}
            onChange={(v) => {
              if (v === "") {
                if (hasColon && isValidPrefix) {
                  onChange("");
                } else {
                  clearQualifier();
                }
                return;
              }
              onChange(v);
            }}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              handleKeyDown(e);
            }}
            placeholder={hasColon ? undefined : placeholder}
            className={className}
            showClear={Boolean(displayValue)}
            onClear={() => onChange("")}
            style={undefined}
          />
        </>
      )}
    </div>
  );
}
