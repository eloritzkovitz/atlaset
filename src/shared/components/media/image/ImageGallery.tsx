import { useState, type HTMLAttributes, type ReactNode } from "react";
import { ImageThumbnail } from "./ImageThumbnail";
import { ImageViewer, type ImageViewerImage } from "./ImageViewer";

interface ImageGalleryProps {
  images: ImageViewerImage[];
  renderOverlay?: (index: number) => ReactNode;
  getItemProps?: (index: number) => HTMLAttributes<HTMLDivElement>;
}

/** Renders a gallery of images with optional overlays. */
export function ImageGallery({
  images,
  renderOverlay,
  getItemProps,
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => {
          const itemProps = getItemProps?.(index);

          return (
            <div
              key={`${image.src}-${index}`}
              {...itemProps}
              className={`group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-alt ${itemProps?.className ?? ""}`}
            >
              <ImageThumbnail
                src={image.src}
                alt={image.alt ?? "Image"}
                onClick={() => setSelectedImageIndex(index)}
              />
              {renderOverlay?.(index)}
            </div>
          );
        })}
      </div>

      <ImageViewer
        images={images}
        currentIndex={selectedImageIndex}
        onNavigate={setSelectedImageIndex}
        onClose={() => setSelectedImageIndex(null)}
      />
    </>
  );
}
