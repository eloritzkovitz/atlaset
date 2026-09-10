interface ImageThumbnailProps {
  src: string;
  alt: string;
  onClick: () => void;
  loading?: "eager" | "lazy";
}

export function ImageThumbnail({
  src,
  alt,
  onClick,
  loading = "lazy",
}: ImageThumbnailProps) {
  return (
    <button
      type="button"
      className="h-full w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
      aria-label={alt}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading={loading}
      />
    </button>
  );
}
