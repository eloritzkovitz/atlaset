import { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ActionButton,
  DirectionalIcon,
  MenuButton,
  Menu,
  Separator,
  RateMenu,
  ConfirmModal,
} from "@components";
import { ICONS } from "@constants/icons";
import { useUI } from "@app/contexts/UIContext";
import {
  useContextMenu,
  useDisclosure,
  useFloatingHover,
  useFloatingMenuPosition,
  useMenuActions,
  useMenuPosition,
} from "@hooks";
import { useTrips } from "../../../core/context/TripsContext";
import type { Trip } from "../../../core/types";
import {
  canMarkCancelled,
  canMarkCompleted,
  canRestore,
  hasValidStartDate,
} from "../../../core/utils/trips";

interface TripActionsProps {
  trip: Trip;
  onEdit: (t: Trip) => void;
}

export const TripActions = forwardRef(function TripActions(
  { trip, onEdit }: TripActionsProps,
  ref,
) {
  const navigate = useNavigate();

  const { t } = useTranslation("trips");
  const {
    sharedTripIds,
    markCompleted,
    markCancelled,
    restoreTrip,
    duplicateTrip,
    updateTripFavorite,
    updateTripRating,
    removeTrip,
  } = useTrips();
  const { handleViewInCalendar } = useUI();

  const rateMenu = useDisclosure();
  const confirmModal = useDisclosure();

  const btnRef = useRef<HTMLDivElement>(null);
  const rateMenuRef = useRef<HTMLDivElement>(null);

  const {
    hoverHandlers: rateMenuHoverHandlers,
    floatingHandlers: rateButtonHoverHandlers,
  } = useFloatingHover(true, 150);

  const {
    open,
    setOpen,
    menuStyle: contextMenuStyle,
    menuRef,
    contextCoords,
    handleCloseContext,
  } = useContextMenu({
    zIndex: 1000,
    forwardedRef: ref,
    ignoreRefs: [btnRef, rateMenuRef],
    onClose: () => rateMenu.close(),
  });

  const handleCloseAll = () => {
    handleCloseContext();
    rateMenu.close();
  };

  const baseMenuStyle = useMenuPosition(
    open,
    btnRef,
    menuRef,
    3,
    "left",
    "adjacent",
    false,
  );
  const rateMenuStyle = useMenuPosition(
    rateMenu.isOpen,
    menuRef,
    rateMenuRef,
    0,
    "right",
    "adjacent",
    false,
  );

  const dynamicMenuStyle: React.CSSProperties =
    contextMenuStyle.position === "fixed"
      ? contextMenuStyle
      : {
          ...baseMenuStyle,
          zIndex: 1000,
        };

  const rateMenuLeft =
    (typeof rateMenuStyle.left === "number" ? rateMenuStyle.left : 0) +
    (menuRef.current?.offsetWidth ?? 180);

  const { left: rateMenuLeftFinal, top: rateMenuTopFinal } =
    useFloatingMenuPosition(
      menuRef,
      rateMenuRef,
      contextCoords
        ? contextCoords.x + (menuRef.current?.offsetWidth ?? 180)
        : rateMenuLeft,
      contextCoords ? contextCoords.y : (rateMenuStyle.top as number),
    );

  const isShared = sharedTripIds?.has(trip.id);

  const menuActions = useMenuActions(
    {
      onEdit: () => onEdit(trip),
      onMarkCompleted: () => markCompleted(trip),
      onMarkCancelled: () => markCancelled(trip),
      onRestore: () => restoreTrip(trip),
      onDuplicate: () => duplicateTrip(trip),
      onFavorite: () => updateTripFavorite(trip, !trip.favorite),
      onDelete: () => confirmModal.open(),
    },
    setOpen,
  );

  if (isShared) {
    return (
      <ActionButton
        ariaLabel={t("actions.sharedDisabledTitle")}
        title={t("actions.sharedDisabledTitle")}
        icon={<ICONS.more />}
        rounded
        disabled
      />
    );
  }

  return (
    <>
      <div ref={btnRef}>
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            handleCloseAll();
            setOpen((v) => !v);
          }}
          ariaLabel={t("actions.moreActions")}
          title={t("actions.moreActions")}
          icon={<ICONS.more />}
          rounded
        />
      </div>

      <Menu
        open={open}
        className="trips-actions-menu !p-2"
        style={dynamicMenuStyle}
        containerRef={menuRef as React.RefObject<HTMLDivElement>}
        disableScroll
      >
        <MenuButton
          onClick={() => {
            handleCloseAll();
            navigate(`/trips/${trip.id}`);
          }}
          icon={<ICONS.view />}
          className="w-full"
        >
          {t("actions.viewTrip")}
        </MenuButton>

        {trip.photoAlbumUrl && (
          <MenuButton
            onClick={() => {
              window.open(trip.photoAlbumUrl, "_blank", "noopener,noreferrer");
              handleCloseAll();
            }}
            icon={<ICONS.photoAlbum />}
            className="w-full"
          >
            {t("actions.viewPhotoAlbum")}
          </MenuButton>
        )}

        {hasValidStartDate(trip) && (
          <MenuButton
            onClick={() => {
              handleCloseAll();
              handleViewInCalendar?.(trip);
            }}
            icon={<ICONS.calendar />}
            className="w-full"
          >
            {t("actions.viewInCalendar")}
          </MenuButton>
        )}

        <Separator className="my-2" />

        <MenuButton
          onClick={() => {
            menuActions.onEdit?.();
            handleCloseAll();
          }}
          icon={<ICONS.edit />}
          className="w-full"
        >
          {t("actions.editTrip")}
        </MenuButton>

        {canMarkCompleted(trip) && (
          <MenuButton
            onClick={() => {
              menuActions.onMarkCompleted?.();
              handleCloseAll();
            }}
            icon={<ICONS.tripCompleted />}
            className="w-full"
          >
            {t("actions.markCompleted", "Mark Completed")}
          </MenuButton>
        )}

        {canMarkCancelled(trip) && (
          <MenuButton
            onClick={() => {
              markCancelled(trip);
              handleCloseAll();
            }}
            icon={<ICONS.tripCancelled />}
            className="w-full"
          >
            {t("actions.markCancelled", "Mark Cancelled")}
          </MenuButton>
        )}

        {canRestore(trip) && (
          <MenuButton
            onClick={() => {
              menuActions.onRestore?.();
              handleCloseAll();
            }}
            icon={<ICONS.refresh />}
            className="w-full"
          >
            {t("actions.restoreTrip", "Restore Trip")}
          </MenuButton>
        )}

        <Separator className="my-2" />

        <MenuButton
          onClick={() => {
            menuActions.onDuplicate?.();
            handleCloseAll();
          }}
          icon={<ICONS.duplicate />}
          className="w-full"
        >
          {t("actions.duplicate")}
        </MenuButton>

        {trip.status === "completed" && (
          <>
            <MenuButton
              onClick={() => {
                menuActions.onFavorite?.();
                handleCloseAll();
              }}
              icon={
                trip.favorite ? (
                  <ICONS.unfavorite className="text-muted" />
                ) : (
                  <ICONS.favorite className="text-danger" />
                )
              }
              className="w-full"
            >
              {trip.favorite ? t("actions.unfavorite") : t("actions.favorite")}
            </MenuButton>

            <div
              style={{ display: "inline-block", width: "100%" }}
              onMouseEnter={() => rateMenu.open()}
              onMouseLeave={rateMenu.close}
            >
              <MenuButton
                {...rateButtonHoverHandlers}
                icon={<ICONS.rate className="text-yellow-400" />}
                className="w-full flex items-center justify-between"
              >
                {t("actions.rate")}
                <DirectionalIcon direction="next" className="ms-auto" />
              </MenuButton>

              {rateMenu.isOpen && (
                <RateMenu
                  open={rateMenu.isOpen}
                  menuStyle={{
                    ...rateMenuStyle,
                    left: rateMenuLeftFinal,
                    top: rateMenuTopFinal,
                    zIndex: 1000,
                    width: 280,
                  }}
                  menuRef={rateMenuRef}
                  hoverHandlers={rateMenuHoverHandlers}
                  onRate={(value) => {
                    handleCloseAll();

                    if (updateTripRating) {
                      updateTripRating(trip, value);
                    }
                  }}
                  onClose={handleCloseAll}
                />
              )}
            </div>
          </>
        )}

        <Separator className="my-2" />

        <MenuButton
          variant="danger"
          onClick={() => {
            menuActions.onDelete?.();
            handleCloseAll();
          }}
          icon={<ICONS.remove />}
          className="w-full"
        >
          {t("actions.deleteTrip")}
        </MenuButton>
      </Menu>

      {confirmModal.isOpen && !!removeTrip && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title="Delete item?"
          message={
            <span>
              Are you sure you want to delete <strong>{trip?.name}</strong>?
            </span>
          }
          onConfirm={() => {
            confirmModal.close();
            removeTrip(trip).catch((error) => {
              console.error("Error deleting trip:", error);
            });
          }}
          onCancel={confirmModal.close}
          submitLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
});
