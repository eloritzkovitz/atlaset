import { useRef, useState } from "react";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { ActionButton, Menu } from "@components";
import { DropdownOptions } from "@components/form/inputs/DropdownSelectInput/DropdownOptions";
import { useKeyboardFocusRing } from "@hooks/useKeyboardFocusRing";
import { getSortOptions } from "@features/countries/utils/countrySort";

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
  const [open, setOpen] = useState(false);
  const showRing = useKeyboardFocusRing();
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get sort options
  const options = getSortOptions(visitedOnly);

  // Calculate menu position relative to the button
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setMenuStyle({
          position: "fixed",
          left: rect.left,
          top: rect.bottom + 4,
          minWidth: rect.width,
          zIndex: 1000,
        });
      }
    }, 0);
  };

  return (
    <>
      <div className="relative ml-2 flex items-center">
        <ActionButton
          ref={btnRef}
          icon={<PiArrowsDownUpBold size={24} />}
          ariaLabel="Sort countries"
          title="Sort countries"
          variant="toggle"
          onClick={open ? () => setOpen(false) : handleOpen}
          className={`bg-action text-action-header text-base h-10 w-10 rounded-lg ${
            open && showRing ? "ring-2 ring-blue-500" : ""
          }`}
          rounded
        />
      </div>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        style={menuStyle}
        containerRef={menuRef}
        className="!bg-input rounded shadow"
      >
        <DropdownOptions
          options={options}
          isSelected={() => false}
          isMulti={false}
          value={value}
          onChange={(val) => {
            if (Array.isArray(val)) {
              onChange(val[0]);
            } else {
              onChange(val);
            }
            setOpen(false);
          }}
          setOpen={setOpen}
        />
      </Menu>
    </>
  );
}
