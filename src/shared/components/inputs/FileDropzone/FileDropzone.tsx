import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";

interface FileDropzoneProps {
  accept: string;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
  hint?: string;
}

/** Renders a file dropzone component. */
export function FileDropzone({
  accept,
  disabled = false,
  onFiles,
  hint,
}: FileDropzoneProps) {
  const { t } = useTranslation("common");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = (): void => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    onFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);

    if (!disabled) {
      onFiles(Array.from(event.dataTransfer.files));
    }
  };

  return (
    <div
      className={`mt-5 rounded-lg border-2 border-dashed p-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/40 sm:p-8 ${
        isDragging
          ? " bg-muted text-text"
          : " bg-input border-action text-muted hover:bg-input-hover"
      } ${disabled ? "cursor-wait opacity-70" : "cursor-pointer"}`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={openFilePicker}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFilePicker();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) {
          setIsDragging(true);
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (event.currentTarget === event.target) {
          setIsDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        disabled={disabled}
        className="sr-only"
        onChange={handleUpload}
      />

      <ICONS.upload className="mx-auto h-7 w-7 text-text" aria-hidden="true" />
      <p className="mt-3 font-medium text-text">
        {disabled
          ? t("components.fileDropzone.uploading", "Uploading...")
          : t(
              "components.fileDropzone.dropFiles",
              "Drop files here or click to browse",
            )}
      </p>
      {hint && <p className="mt-3 text-xs">{hint}</p>}
    </div>
  );
}
