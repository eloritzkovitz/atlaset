import { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { FloatingPortal, Menu, MenuButton } from "@components";
import { useMenuPosition } from "@hooks";
import { ActionButton } from "../../action/ActionButton";

interface ToolbarSelectButtonProps<T extends string | number> {
  value: T;
  onChange: (value: T) => void;
  options: Array<{ value: T; label: string }>;
  ariaLabel: string;
  width?: string;
}

export function ToolbarSelectButton<T extends string | number>({
  value,
  onChange,
  options,
  ariaLabel,
  width = "150px",
}: ToolbarSelectButtonProps<T>) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get the button's position for menu placement
  const menuStyle = useMenuPosition(open, btnRef, menuRef, 4, "top", false);

  // Toggle menu open state
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling to document/click-away
    setOpen((prev) => !prev);
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <ActionButton
        ref={btnRef}
        ariaLabel={ariaLabel}
        style={{ width, height: "48px", padding: 0 }}
        variant="action"
        rounded
        onClick={handleButtonClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="truncate flex-1 text-left pl-3">
          {options.find((o) => o.value === value)?.label}
        </span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <FaChevronDown />
        </span>
      </ActionButton>
      {showTooltip && btnRef.current && (
        <FloatingPortal anchorEl={btnRef.current} position="bottom" gap={0} centerX>
          <span
            className="whitespace-nowrap px-2 py-1 rounded-lg bg-black text-white text-sm shadow-lg transition-opacity duration-150 opacity-90"
            role="tooltip"
          >
            {ariaLabel}
          </span>
        </FloatingPortal>
      )}
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        style={menuStyle}
        containerRef={menuRef}
        extraRefs={[btnRef]}
        className="bg-input rounded shadow max-h-[20vh] overflow-y-auto"
      >
        <ul>
          {options.map((opt) => (
            <li key={opt.value}>
              <MenuButton
                icon={null}
                active={opt.value === value}
                onClick={() => {
                  onChange(opt.value as T);
                  setOpen(false);
                }}
                className="w-full"
              >
                {opt.label}
              </MenuButton>
            </li>
          ))}
        </ul>
      </Menu>
    </>
  );
}
