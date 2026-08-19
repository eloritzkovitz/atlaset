import { useTranslation } from "react-i18next";
import { StarRatingInput } from "./StarRatingInput";
import { getRatingActionOptions } from "./utils";
import { Menu } from "../../navigation/Menu/Menu";
import { MenuButton } from "../../navigation/Menu/MenuButton";

interface RateMenuProps {
  open: boolean;
  menuStyle: React.CSSProperties;
  menuRef: React.RefObject<HTMLDivElement | null>;
  hoverHandlers: React.HTMLAttributes<HTMLDivElement>;
  onRate: (value: number | undefined) => void;
  onClose: () => void;
}

export function RateMenu({
  open,
  menuStyle,
  menuRef,
  hoverHandlers,
  onRate,
  onClose,
}: RateMenuProps) {
  const { t } = useTranslation("common");
  const options = getRatingActionOptions(t);

  // Don't render the menu if it's not open
  if (!open) return null;

  return (
    <Menu
      open
      className="rate-menu w-full"
      style={menuStyle}
      containerRef={menuRef}
    >
      <div {...hoverHandlers}>
        {options.map((opt) => (
          <MenuButton
            key={String(opt.value) + "-rate"}
            onPointerDown={() => {
              onRate(opt.value);
              onClose();
            }}
            icon={
              <span className="flex items-center">
                <StarRatingInput value={opt.value} readOnly />
              </span>
            }
            className="w-full"
          >
            {opt.label}
          </MenuButton>
        ))}
      </div>
    </Menu>
  );
}
