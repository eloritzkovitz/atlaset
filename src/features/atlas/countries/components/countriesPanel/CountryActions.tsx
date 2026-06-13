import { forwardRef, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { DirectionalIcon, Menu, MenuButton, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { useCountryLists } from "@contexts/CountryListsContext";
import { useMapView } from "@contexts/MapViewContext";
import type { Country } from "@features/countries";
import {
  useContextMenu,
  useFloatingHover,
  useFloatingMenuPosition,
  useMenuActions,
  useMenuPosition,
} from "@hooks";
import { CountryListsMenu } from "./CountryListsMenu";
import { useCountryActions } from "../../hooks/useCountryActions";

interface CountryActionsProps {
  country: Country | null;
  triggerRef: React.RefObject<HTMLElement | null>;
  onCountryInfo?: (country: Country) => void;
  onCloseListPanel?: () => void;
}

export const CountryActions = forwardRef(function CountryActions(
  { country, triggerRef, onCountryInfo, onCloseListPanel }: CountryActionsProps,
  ref,
) {
  const { countryLists, openAddModal, handleUpdate } = useCountryLists();
  const { centerOnCountry } = useMapView();
  const { t } = useTranslation("atlas");
  const [listMenuOpen, setListMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const listMenuRef = useRef<HTMLDivElement>(null);
  const addToListRowRef = useRef<HTMLDivElement>(null);

  // Hover handlers for the lists submenu
  const {
    hoverHandlers: listMenuHoverHandlers,
    floatingHandlers: listButtonHoverHandlers,
  } = useFloatingHover(true, 150);

  // Context menu management
  const {
    open,
    setOpen,
    menuStyle: contextMenuStyle,
    contextCoords,
    handleCloseContext,
  } = useContextMenu({
    zIndex: 1000,
    forwardedRef: ref,
    ignoreRefs: [menuRef, listMenuRef, addToListRowRef],
    onClose: () => setListMenuOpen(false),
  });
  const baseMenuStyle = useMenuPosition(
    open,
    triggerRef,
    menuRef,
    0,
    "left",
    "adjacent",
    false,
  );
  const listMenuStyle = useMenuPosition(
    listMenuOpen,
    addToListRowRef,
    listMenuRef,
    0,
    "right",
    "adjacent",
    false,
  );
  const dynamicMenuStyle: React.CSSProperties =
    contextMenuStyle.position === "fixed"
      ? contextMenuStyle
      : { ...baseMenuStyle, zIndex: 1000 };

  // Calculate list menu position with fallback to dynamic coordinates if available
  const parentMenuWidth = menuRef.current?.offsetWidth ?? 180;
  const rowTopCoordinate = addToListRowRef.current
    ? addToListRowRef.current.getBoundingClientRect().top + window.scrollY
    : typeof listMenuStyle.top === "number"
      ? listMenuStyle.top
      : 0;
  const finalCalculatedLeft = contextCoords
    ? contextCoords.x + parentMenuWidth
    : typeof listMenuStyle.left === "number"
      ? listMenuStyle.left
      : 0;
  const finalCalculatedTop = contextCoords
    ? contextCoords.y + 55
    : rowTopCoordinate;
  const { left: listMenuLeftFinal, top: listMenuTopFinal } =
    useFloatingMenuPosition(
      addToListRowRef,
      listMenuRef,
      finalCalculatedLeft,
      finalCalculatedTop,
    );

  // Unified global close handler for all menus
  const handleCloseAll = () => {
    handleCloseContext();
    setListMenuOpen(false);
  };

  // Get action configurations based on country and context
  const actions = useCountryActions({
    country: country!,
    onCloseMenu: handleCloseAll,
    onClosePanel: onCloseListPanel,
  });

  // Menu actions
  const menuActions = useMenuActions(
    {
      onCenter: () => centerOnCountry?.(country!.isoCode),
    },
    setOpen,
  );

  // Do not render menu if no country is selected
  if (!country) return null;

  // Handler to add country to a selected list
  const handleAddCountryToList = async (listId: string) => {
    const targetList = countryLists.find((l) => l.id === listId);
    if (!targetList) return;

    handleCloseAll();

    await handleUpdate({
      ...targetList,
      countryCodes: [...targetList.countryCodes, country.isoCode],
    });
  };

  // Handler to create a new list with the country from the menu option
  const handleCreateNewListFromMenu = () => {
    handleCloseAll();

    setTimeout(() => {
      openAddModal([country.isoCode]);
    }, 0);
  };

  return (
    <>
      <Menu
        open={open}
        onClose={handleCloseAll}
        className="country-actions-menu !p-2"
        style={dynamicMenuStyle}
        containerRef={menuRef}
        disableScroll={true}
      >
        <MenuButton
          onClick={() => {
            handleCloseAll();
            if (onCountryInfo) onCountryInfo(country);
          }}
          icon={<ICONS.view className="me-2" />}
          className="w-full"
          onMouseEnter={() => setListMenuOpen(false)}
        >
          {t("countries.actions.viewDetails", "View Details")}
        </MenuButton>
        <MenuButton
          onClick={menuActions.onCenter}
          icon={<ICONS.center className="me-2" />}
          className="w-full"
        >
          {t("countries.actions.centerMap", "Center Map")}
        </MenuButton>
        <Separator className="my-2" />

        <div
          ref={addToListRowRef}
          style={{ display: "inline-block", width: "100%" }}
          onMouseEnter={() => {
            setListMenuOpen(true);
          }}
          onMouseLeave={() => setListMenuOpen(false)}
        >
          <MenuButton
            {...listButtonHoverHandlers}
            icon={<ICONS.countryLists className="me-2" />}
            className="w-full flex items-center justify-between"
          >
            {t("countries.actions.addToList", "Add to List")}
            <DirectionalIcon direction="next" className="ms-auto" />
          </MenuButton>

          {listMenuOpen && (
            <CountryListsMenu
              countryLists={countryLists}
              selectedIsoCode={country.isoCode}
              open={listMenuOpen}
              menuStyle={{
                position: "fixed",
                left: listMenuLeftFinal,
                top: listMenuTopFinal,
                zIndex: 1010,
                width: 200,
              }}
              menuRef={listMenuRef}
              hoverHandlers={listMenuHoverHandlers}
              onAddCountryToList={handleAddCountryToList}
              onCreateNewList={handleCreateNewListFromMenu}
              onClose={handleCloseAll}
            />
          )}
        </div>
        <Separator className="my-2" />

        {actions
          .filter((action) => action.id !== "center-map")
          .map((action) => (
            <MenuButton
              key={action.id}
              onClick={() => {
                action.onClick();
                handleCloseAll();
              }}
              onMouseEnter={() => setListMenuOpen(false)}
              icon={
                <span className="me-2 inline-flex items-center">
                  {action.icon}
                </span>
              }
              className="w-full"
            >
              {action.label}
            </MenuButton>
          ))}
      </Menu>
    </>
  );
});
