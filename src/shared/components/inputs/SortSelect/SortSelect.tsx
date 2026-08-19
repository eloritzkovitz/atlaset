import { useRef } from "react";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useClickOutside, useMenuPosition, useModalAnimation } from "@hooks";
import type { Option, OptionGroup, SortDirection, SortValue } from "@types";
import { getDirectionOptions } from "./directionOptions";
import { ActionButton } from "../Button/ActionButton";
import { OptionItem } from "../DropdownSelectInput/OptionItem";
import { SectionHeader } from "../../display/SectionHeader";
import { Separator } from "../../layout/Separator";
import { Menu } from "../../navigation/Menu/Menu";

export interface SortSelectProps<K extends string> {
  value: SortValue<K>;
  onChange: (value: SortValue<K>) => void;
  keyGroup: OptionGroup<K> | Option<K>[];
  showLabel?: boolean;
}

export function SortSelect<K extends string>({
  value,
  onChange,
  keyGroup,
  showLabel = false,
}: SortSelectProps<K>) {
  const { isOpen, closing, setIsOpen, closeModal } = useModalAnimation();
  const { t } = useTranslation("common");

  const btnRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const dirGroup: OptionGroup<SortDirection> = {
    label: t("components.sort.direction", "Direction"),
    options: getDirectionOptions(t) as Option<SortDirection>[],
  };

  const normalizedKeyGroup: OptionGroup<K> = Array.isArray(keyGroup)
    ? {
        label: t("components.sort.title", "Sort"),
        options: keyGroup,
      }
    : {
        ...keyGroup,
        label: keyGroup.label ?? t("components.sort.title", "Sort"),
      };

  const [sortKey, sortDirection] = value.split("-") as [K, SortDirection];

  const selectedKeyOption = normalizedKeyGroup.options.find(
    (o) => o.value === sortKey,
  );

  const selectedDirOption = dirGroup.options.find(
    (o) => o.value === sortDirection,
  );

  const menuStyle = useMenuPosition(
    isOpen,
    btnRef,
    menuRef,
    35,
    "right",
    "adjacent",
    false,
  );

  useClickOutside([btnRef, menuRef], closeModal, isOpen);

  const renderOptionGroup = <V extends string>(
    group: OptionGroup<V>,
    selected: V,
    handleChange: (v: V) => void,
    isDirection = false,
  ) => (
    <>
      <SectionHeader title={group.label} className="ms-1 -my-4" />

      {group.options.map((opt: Option<V>) => (
        <div key={opt.value}>
          <OptionItem
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
            renderOption={(o: Option<V>) => (
              <span className="flex items-center gap-2">
                {isDirection ? (
                  o.icon ? (
                    <o.icon />
                  ) : null
                ) : o.value === selected ? (
                  <ICONS.selected className="text-green-500" />
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
  );

  return (
    <div className="relative ms-2 flex items-center">
      <div ref={btnRef}>
        <ActionButton
          ariaLabel={t("common:sort.title", "Sort")}
          title={
            selectedKeyOption && selectedDirOption
              ? t("common:sort.tooltip", "Sort by: {{key}} ({{dir}})", {
                  key: selectedKeyOption.label,
                  dir: selectedDirOption.label,
                })
              : t("common:sort.title", "Sort")
          }
          icon={
            selectedDirOption?.icon ? (
              <selectedDirOption.icon size={18} />
            ) : (
              <PiArrowsDownUpBold size={18} />
            )
          }
          variant="sort"
          onClick={() => setIsOpen((v) => !v)}
          className="focus-visible:ring-2 focus-visible:ring-ring-focus"
          rounded
        />
      </div>

      {showLabel && (
        <span className="ms-2 text-sm text-muted">
          {selectedKeyOption?.label}
        </span>
      )}

      {(isOpen || closing) && (
        <Menu open={isOpen} style={menuStyle} containerRef={menuRef}>
          <div className="-mt-2">
            {renderOptionGroup(normalizedKeyGroup, sortKey, (newKey) =>
              onChange(`${newKey}-${sortDirection}` as SortValue<K>),
            )}
          </div>

          <Separator className="mt-2" />

          {renderOptionGroup(
            dirGroup,
            sortDirection,
            (newDir) => onChange(`${sortKey}-${newDir}` as SortValue<K>),
            true,
          )}
        </Menu>
      )}
    </div>
  );
}
