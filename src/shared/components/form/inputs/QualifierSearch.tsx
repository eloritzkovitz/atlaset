import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SearchInput } from "./SearchInput";

interface QualifierSearchProps {
  value: string;
  onChange: (v: string) => void;
  qualifiers?: string[];
  modifiers?: string[];
  clearable?: boolean;
  placeholder?: string;
  className?: string;
  lockedPrefix?: string | undefined;
}

// Escape special regex characters in qualifiers to safely build the regex pattern
function escapeRegex(s: string) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function QualifierSearch({
  value,
  onChange,
  qualifiers,
  modifiers,
  clearable = true,
  placeholder,
  className,
  lockedPrefix,
}: QualifierSearchProps) {
  const provided = qualifiers ?? [];
  const providedModifiers = modifiers ?? [];

  const qAlt = provided.length ? provided.map(escapeRegex).join("|") : null;
  const mAlt = providedModifiers.length
    ? providedModifiers.map(escapeRegex).join("|")
    : null;

  const hasQ = Boolean(qAlt);
  const hasM = Boolean(mAlt);

  let pattern: string;
  if (hasQ && hasM) {
    pattern = `\\b(?:(${qAlt})|(${mAlt})):`;
  } else if (hasQ) {
    pattern = `\\b(${qAlt}):`;
  } else if (hasM) {
    pattern = `\\b(${mAlt}):`;
  } else {
    pattern = `\\b([A-Za-z0-9_-]+):`;
  }

  const regex = new RegExp(pattern, "ig");

  // Build the overlay content by finding qualifiers in the input and highlighting them
  const buildOverlay = (text: string | undefined) => {
    if (!text) return undefined;
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > lastIndex) {
        nodes.push(
          <span key={`t-${lastIndex}`}>{text.slice(lastIndex, m.index)}</span>,
        );
      }
      // Determine whether the match is a qualifier or a modifier-only
      let isQualifier = true;
      if (hasQ && hasM) {
        isQualifier = !!m[1];
      } else if (hasQ) {
        isQualifier = true;
      } else if (hasM) {
        isQualifier = false;
      }

      const highlightClass = isQualifier
        ? "bg-primary/50 rounded z-10"
        : "bg-primary-active/50 rounded z-10";

      nodes.push(
        <span key={`h-${m.index}`} className={highlightClass}>
          {m[0]}
        </span>,
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length)
      nodes.push(<span key={`t-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    return <span className="whitespace-pre">{nodes}</span>;
  };

  // If a lockedPrefix is provided, show/edit only the part after the locked prefix
  const prefix = lockedPrefix ? `${lockedPrefix}:` : undefined;
  let displayValue = value;
  if (prefix) {
    if (value.toLowerCase().startsWith(prefix.toLowerCase())) {
      displayValue = value.slice(prefix.length).trimStart();
    } else {
      // ensure the stored value contains the prefix
      displayValue = "";
    }
  }

  // Detect a locked suffix like "true" at the start of the editable portion
  let lockedSuffix: string | undefined;
  let editableAfter = displayValue;
  if (displayValue) {
    const m = displayValue.match(/^\s*(true|false)\b/i);
    if (m) {
      lockedSuffix = m[1];
      editableAfter = displayValue.slice(m[0].length).trimStart();
    }
  }

  const overlayForDisplay = !prefix ? (
    buildOverlay(displayValue)
  ) : (
    <div className="w-full whitespace-pre">
      <span className="bg-primary/50 rounded z-10">
        {prefix}
        {lockedSuffix ? lockedSuffix : ""}
      </span>
      <span className="ml-1">{buildOverlay(editableAfter)}</span>
    </div>
  );

  // caret handling: focus and set caret at start of editable area when a locked prefix/suffix is active
  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevLockedRef = useRef<string | undefined>(undefined);

  // Measure width of the locked token so we can apply exact spacing
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [lockedWidth, setLockedWidth] = useState<number>(0);
  useLayoutEffect(() => {
    const measure = () => {
      setLockedWidth(measureRef.current ? measureRef.current.offsetWidth : 0);
    };
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [prefix, lockedSuffix]);

  // When the locked prefix changes from unset to set, or changes to a different value, focus the input and move caret to start of editable area
  useEffect(() => {
    const becameLocked =
      (prevLockedRef.current === undefined && prefix) ||
      (prevLockedRef.current !== prefix && prefix !== undefined);
    if (prefix && (becameLocked || prevLockedRef.current !== prefix)) {
      const el = inputRef.current;
      if (el) {
        el.focus();
        try {
          el.setSelectionRange(0, 0);
        } catch {
          // ignore if the input is not focused or selection range cannot be set
        }
      }
    }
    prevLockedRef.current = prefix;
  }, [prefix]);

  return (
    <>
      <SearchInput
        ref={inputRef}
        value={editableAfter}
        onChange={(v) => {
          const raw = v;
          if (prefix) {
            const combined =
              `${prefix} ${lockedSuffix ? lockedSuffix + " " : ""}${raw}`.trim();
            onChange(combined);
          } else {
            onChange(raw);
          }
        }}
        placeholder={placeholder}
        className={className}
        overlayContent={overlayForDisplay}
        style={{
          paddingLeft: prefix ? `${15 + lockedWidth + 8}px` : undefined,
        }}
        showClear={Boolean(value) && clearable}
        onClear={() => onChange("")}
      />

      {prefix ? (
        <div
          ref={measureRef}
          aria-hidden
          style={{
            position: "absolute",
            left: -9999,
            top: 0,
            visibility: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          <div className="inline-flex items-center px-3 py-2 rounded-l-full bg-input/50 border-2 border-surface-hover text-sm">
            {prefix}
            {lockedSuffix ? <span className="ml-1">{lockedSuffix}</span> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
