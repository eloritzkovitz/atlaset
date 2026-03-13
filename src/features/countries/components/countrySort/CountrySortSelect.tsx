import { useRef } from "react";
import { FaCheck } from "react-icons/fa6";
import { PiArrowsDownUpBold } from "react-icons/pi";
import {
  ActionButton,
  Menu,
  OptionItem,
  SectionHeader,
  Separator,
} from "@components";
import {
  useKeyboardFocusRing,
  useMenuPosition,
  useModalAnimation,
} from "@hooks";
import type { Option, OptionGroup } from "@types";
import { useCountrySortDropdownState } from "../../hooks/useCountrySortDropdownState";

interface CountrySortSelectProps {
  value: string;
  onChange: (value: string) => void;
  visitedOnly?: boolean;
  showLabel?: boolean;
}

export function CountrySortSelect({
  value,
  onChange,
  visitedOnly,
  showLabel = false,
}: CountrySortSelectProps) {
  const { isOpen, closing, setIsOpen, closeModal } = useModalAnimation();
  const showRing = useKeyboardFocusRing();
  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sort dropdown state
  const {
    sortKey,
    sortDirection,
    keyGroup,
    dirGroup,
    selectedKeyOption,
    selectedDirOption,
  } = useCountrySortDropdownState(value, visitedOnly);

  // Menu positioning
  const menuStyle = useMenuPosition(
    isOpen,
    btnRef,
    menuRef,
    35,
    "right",
    false,
  );

  // Centralized group renderer
  const renderOptionGroup = (
    group: OptionGroup<string> | undefined,
    selected: string,
    handleChange: (v: string) => void,
    isDirection = false,
  ) =>
    group ? (
      <>
        <SectionHeader title={group.label} className="ml-1 -my-4" />
        {group.options.map((opt: Option<string>) => (
          <div key={opt.value}>
            <OptionItem
              key={opt.value}
              opt={opt}
              isSelected={(v) => v === selected}
              isMulti={false}
              value={selected}
              onChange={(v) => {
                const newVal = Array.isArray(v) ? v[0] : v;
                handleChange(newVal);
                closeModal();
              }}
              setOpen={setIsOpen}
              renderOption={(o: Option<string>) => (
                <span className="flex items-center gap-2">
                  {isDirection ? (
                    o.icon ? (
                      <o.icon />
                    ) : null
                  ) : o.value === selected ? (
                    <FaCheck />
                  ) : (
                    <span className="w-4 inline-block" />
                  )}
                  <span>{o.label}</span>
                </span>
              )}
            />
          </div>
        ))}
      </>
    ) : null;

  return (
    <div className="relative ml-2 flex items-center">
      <div ref={btnRef}>
        <ActionButton
          icon={
            selectedDirOption && selectedDirOption.icon ? (
              <selectedDirOption.icon size={18} />
            ) : (
              <PiArrowsDownUpBold size={18} />
            )
          }
          ariaLabel="Sort"
          title={
            selectedKeyOption && selectedDirOption
              ? `Sort by: ${selectedKeyOption.label} (${selectedDirOption.label})`
              : "Sort"
          }
          variant="sort"
          onClick={() => {
            setIsOpen((v) => {
              if (v) {
                closeModal();
                return false;
              } else {
                return true;
              }
            });
          }}
          className={isOpen && showRing ? "ring-2 ring-ring-focus" : ""}
          rounded
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-sm text-muted">
          {selectedKeyOption?.label}
        </span>
      )}
      {(isOpen || closing) && (
        <Menu
          open={isOpen}
          onClose={closeModal}
          style={menuStyle}
          containerRef={menuRef}
        >
          {/* Sort Key Group */}
          <div className="-mt-2">
            {renderOptionGroup(keyGroup, sortKey, (newKey) =>
              onChange(`${newKey}-${sortDirection}`),
            )}
          </div>
          <Separator className="mt-2" />
          {/* Sort Direction Group */}
          {renderOptionGroup(
            dirGroup,
            sortDirection,
            (newDir) => onChange(`${sortKey}-${newDir}`),
            true,
          )}
        </Menu>
      )}
    </div>
  );
}
