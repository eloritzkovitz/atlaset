import { useTranslation } from "react-i18next";
import { Menu, MenuButton, Separator } from "@components";
import { ICONS } from "@constants/icons";
import type { CountryList } from "@features/countries";

interface CountryListsMenuProps {
  countryLists: CountryList[];
  selectedIsoCode: string;
  open: boolean;
  menuStyle: React.CSSProperties;
  menuRef: React.RefObject<HTMLDivElement | null>;
  hoverHandlers: React.HTMLAttributes<HTMLDivElement>;
  onAddCountryToList: (listId: string) => void;
  onCreateNewList: () => void;
  onClose: () => void;
}

export function CountryListsMenu({
  countryLists,
  selectedIsoCode,
  open,
  menuStyle,
  menuRef,
  hoverHandlers,
  onAddCountryToList,
  onCreateNewList,
  onClose,
}: CountryListsMenuProps) {
  const { t } = useTranslation();

  return (
    <Menu
      open={open}
      style={menuStyle}
      containerRef={menuRef}
      onClose={onClose}
    >
      <div {...hoverHandlers} className="p-1">
        {countryLists.map((list: CountryList) => {
          const isAlreadyAdded = list.countryCodes.includes(selectedIsoCode);

          return (
            <div
              key={list.id}
              onPointerDown={(e) => {
                if (isAlreadyAdded) return;
                e.preventDefault();
                e.stopPropagation();
                onAddCountryToList(list.id);
                onClose();
              }}
            >
              <MenuButton
                icon={
                  isAlreadyAdded ? (
                    <ICONS.selected className="me-2" />
                  ) : (
                    <ICONS.add className="me-2" />
                  )
                }
                disabled={isAlreadyAdded}
                className={`w-full text-sm text-left truncate justify-start ${
                  isAlreadyAdded ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {list.name}
              </MenuButton>
            </div>
          );
        })}

        {countryLists.length > 0 && <Separator className="my-1" />}

        <div
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCreateNewList();
            onClose();
          }}
        >
          <MenuButton
            icon={<ICONS.createList className="me-2" />}
            className="w-full text-sm text-left truncate justify-start font-medium"
          >
            {t("countries.actions.newList", "New list")}
          </MenuButton>
        </div>
      </div>
    </Menu>
  );
}
