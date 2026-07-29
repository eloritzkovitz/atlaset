import { forwardRef, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { DirectionalIcon, Menu, MenuButton, Separator } from "@components";
import { ICONS } from "@constants/icons";
import type { Country } from "@features/countries";
import {
  useContextMenu,
  useFloatingHover,
  useFloatingMenuPosition,
  useMenuPosition,
} from "@hooks";
import { CountryListsMenu } from "./CountryListsMenu";
import { useCountryLists } from "../../context/CountryListsContext";
import { useCountryActions } from "../../hooks/useCountryActions";

interface CountryActionsProps {
  country: Country | null;
  triggerRef: React.RefObject<HTMLElement | null>;
  onCountryInfo?: (country: Country) => void;
}

export const CountryActions = forwardRef(function CountryActions(
  { country, triggerRef, onCountryInfo }: CountryActionsProps,
  ref,
) {
  const { countryLists, openAddModal, handleUpdate } = useCountryLists();
  const { t } = useTranslation("atlas");
  const [listMenuOpen, setListMenuOpen] = useState(false);

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
    menuStyle: contextMenuStyle,
    menuRef,
    contextCoords,
    handleCloseContext,
  } = useContextMenu({
    zIndex: 1000,
    forwardedRef: ref,
    ignoreRefs: [listMenuRef, addToListRowRef],
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
    ? contextCoords.y + (addToListRowRef.current?.offsetTop ?? 120)
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
  const actionsObj = useCountryActions({
    country,
    onCountryInfo,
    onCloseMenu: handleCloseAll,
  });

  // Do not render menu if no country is selected
  if (!country) return null;

  const viewSection = [actionsObj.viewDetails, actionsObj.centerMap].filter(
    Boolean,
  );
  const trackingSection = [
    { id: "visited", ...actionsObj.toggleVisited },
    ...(actionsObj.toggleWantToVisit?.disabled
      ? []
      : [{ id: "wantToVisit", ...actionsObj.toggleWantToVisit }]),
    ...(actionsObj.markerAction
      ? [{ id: "marker", ...actionsObj.markerAction }]
      : []),
  ];
  const resourceSection = [
    actionsObj.viewDashboard,
    actionsObj.wikipedia,
  ].filter(Boolean);

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
        containerRef={menuRef as React.RefObject<HTMLDivElement>}
        disableScroll={true}
      >
        {viewSection.map((act, i) => (
          <MenuButton
            key={i}
            onClick={act.onClick}
            onMouseEnter={() => setListMenuOpen(false)}
            icon={act.icon}
            className="w-full"
          >
            {act.label}
          </MenuButton>
        ))}

        <Separator className="my-2" />

        {trackingSection.map((act) => (
          <MenuButton
            key={act.id}
            url={act.url}
            onClick={act.onClick}
            onMouseEnter={() => setListMenuOpen(false)}
            ariaLabel={act.ariaLabel}
            icon={
              <span className={`${act.disabled ? "text-muted" : ""}`}>
                {act.icon}
              </span>
            }
            className="w-full"
            disabled={act.disabled}
          >
            <span className={act.disabled ? "text-muted" : ""}>
              {act.label}
            </span>
          </MenuButton>
        ))}

        <div
          ref={addToListRowRef}
          style={{ display: "inline-block", width: "100%" }}
          onMouseEnter={() => setListMenuOpen(true)}
          onMouseLeave={() => setListMenuOpen(false)}
        >
          <MenuButton
            {...listButtonHoverHandlers}
            icon={<ICONS.countryLists />}
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

        {resourceSection.map((act, i) => (
          <MenuButton
            key={i}
            onClick={act.onClick}
            onMouseEnter={() => setListMenuOpen(false)}
            url={act.url}
            ariaLabel={act.ariaLabel}
            icon={act.icon}
            className="w-full"
          >
            {act.label}
          </MenuButton>
        ))}
      </Menu>
    </>
  );
});
