import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { useKeyHandler, useSwipeNavigation } from "@hooks";
import { DirectionalIcon } from "../icons/DirectionalIcon";
import { ActionButton } from "../../inputs/Button/ActionButton";
import { Modal } from "../../overlay/Modal/Modal";

export interface ImageViewerImage {
  src: string;
  alt?: string;
}

interface ImageViewerProps {
  images: ImageViewerImage[];
  currentIndex: number | null;
  onNavigate: (index: number) => void;
  onClose: () => void;
}

export function ImageViewer({
  images,
  currentIndex,
  onNavigate,
  onClose,
}: ImageViewerProps) {
  const { i18n, t } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const selectedImage =
    currentIndex === null ? undefined : images[currentIndex];
  const isOpen = selectedImage !== undefined;

  const handlePrev = (): void => {
    if (currentIndex !== null && currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = (): void => {
    if (currentIndex !== null && currentIndex < images.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const { handleTouchStart, handleTouchEnd } = useSwipeNavigation(
    handlePrev,
    handleNext,
    isRTL,
  );

  useKeyHandler(
    (event) => {
      if (event.key === "ArrowLeft") {
        isRTL ? handleNext() : handlePrev();
      }

      if (event.key === "ArrowRight") {
        isRTL ? handlePrev() : handleNext();
      }

      if (event.key === "Escape") {
        onClose();
      }
    },
    ["ArrowLeft", "ArrowRight", "Escape"],
    { enabled: isOpen },
  );

  if (!isOpen || currentIndex === null) {
    return null;
  }

  const previousButton = (
    <ActionButton
      ariaLabel={t("actions.previous", "Previous")}
      disabled={currentIndex === 0}
      variant="custom"
      rounded
      className={`absolute top-1/2 z-10 h-12 w-12 -translate-y-1/2 p-0 text-2xl text-white hover:bg-white/10 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-35 sm:h-16 sm:w-16 sm:text-3xl ${isRTL ? "right-3 sm:right-6" : "left-3 sm:left-6"}`}
      onClick={handlePrev}
    >
      <DirectionalIcon direction="prev" size="1.5rem" />
    </ActionButton>
  );

  const nextButton = (
    <ActionButton
      ariaLabel={t("actions.next", "Next")}
      disabled={currentIndex === images.length - 1}
      variant="custom"
      rounded
      className={`absolute top-1/2 z-10 h-12 w-12 -translate-y-1/2 p-0 text-2xl text-white hover:bg-white/10 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-35 sm:h-16 sm:w-16 sm:text-3xl ${isRTL ? "left-3 sm:left-6" : "right-3 sm:right-6"}`}
      onClick={handleNext}
    >
      <DirectionalIcon direction="next" size="1.5rem" />
    </ActionButton>
  );

  return (
    <Modal
      isOpen
      onClose={onClose}
      disableClose
      backdropZIndex={11000}
      containerZIndex={11001}
      className="!pointer-events-auto !fixed !inset-0 !h-full !w-full !max-w-none !rounded-none !bg-transparent !p-0 !shadow-none"
    >
      <div
        className="relative flex h-full w-full items-center justify-center bg-black/75"
        dir={isRTL ? "rtl" : "ltr"}
        onClick={(event) => event.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ActionButton
          ariaLabel={t("actions.close", "Close")}
          rounded
          icon={<ICONS.close aria-hidden="true" />}
          className="absolute end-3 top-3 z-10 h-10 w-10 text-2xl text-white hover:bg-white/10 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:end-6 sm:top-6 sm:text-3xl"
          onClick={onClose}
        />

        <div className="flex h-full w-full items-center justify-center px-14 py-16 sm:px-24 sm:py-20">
          <img
            src={selectedImage.src}
            alt={selectedImage.alt ?? t("media.image", "Image")}
            className="max-h-[80vh] max-w-[90vw] object-contain"
          />
        </div>

        {images.length > 1 && (
          <>
            {previousButton}
            {nextButton}
          </>
        )}

        <span className="absolute bottom-4 start-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white sm:bottom-6">
          {currentIndex + 1}/{images.length}
        </span>
      </div>
    </Modal>
  );
}
