import { useRef } from "react";
import { FaCheck } from "react-icons/fa6";
import { PiArrowsDownUpBold } from "react-icons/pi";
import {
  useKeyboardFocusRing,
  useMenuPosition,
  useModalAnimation,
} from "@hooks";
import type { Option, OptionGroup } from "@types";
import { directionOptions } from "./directionOptions";
import { ActionButton } from "../../action/ActionButton";
import { OptionItem } from "../../form/inputs/DropdownSelectInput/OptionItem";
import { SectionHeader } from "../../layout/SectionHeader";
import { Separator } from "../../layout/Separator";
import { Menu } from "../../menu/Menu";

export interface SortSelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  keyGroup: OptionGroup<T>;
  showLabel?: boolean;
}

export function SortSelect<T extends string>({
  value,
  onChange,
  keyGroup,
  showLabel = false,
}: SortSelectProps<T>) {
  const { isOpen, closing, setIsOpen, closeModal } = useModalAnimation();
  const showRing = useKeyboardFocusRing();
  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Direction group
  const dirGroup = {
    label: "Direction",
    options: directionOptions as Option<T>[],
  };

  // Parse value into key and direction
  const [sortKey, sortDirection] = value.split("-") as [T, T];
  const selectedKeyOption = keyGroup.options.find((o) => o.value === sortKey);
  const selectedDirOption = dirGroup.options.find(
    (o) => o.value === sortDirection,
  );

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
    group: OptionGroup<T> | undefined,
    selected: T,
    handleChange: (v: T) => void,
    isDirection = false,
  ) =>
    group ? (
      <>
        <SectionHeader title={group.label} className="ml-1 -my-4" />
        {group.options.map((opt: Option<T>) => (
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
              renderOption={(o: Option<T>) => (
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
          <div className="-mt-2">
            {renderOptionGroup(keyGroup, sortKey, (newKey) =>
              onChange(`${newKey}-${sortDirection}` as T),
            )}
          </div>
          <Separator className="mt-2" />
          {renderOptionGroup(
            dirGroup,
            sortDirection,
            (newDir) => onChange(`${sortKey}-${newDir}` as T),
            true,
          )}
        </Menu>
      )}
    </div>
  );
}
