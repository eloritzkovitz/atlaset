import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ICONS } from "@constants/icons";
import { ActionButton } from "../../inputs/Button/ActionButton";
import { Separator } from "../../layout/Separator";

interface DialogHeaderProps {
  title: ReactNode;
  children?: ReactNode;
  className?: string;
  showSeparator?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  closeButtonClassName?: string;
}

export function DialogHeader({
  title,
  children,
  className,
  showSeparator,
  onClose,
  showCloseButton = true,
  closeButtonClassName,
}: DialogHeaderProps) {
  const { t } = useTranslation("common");

  return (
    <div>
      <div
        className={`px-4 pt-4 pb-0 flex flex-shrink-0 items-center justify-between mb-4 select-none ${className ?? ""}`}
      >
        <div className="flex items-center gap-2 h-8 text-lg font-bold">
          {title}
        </div>

        <div className="flex gap-2">
          {children}
          {showCloseButton && onClose && (
            <ActionButton
              onClick={onClose}
              ariaLabel={t("actions.close")}
              title={t("actions.close")}
              icon={<ICONS.close className="text-2xl" />}
              className={closeButtonClassName}
              rounded
            />
          )}
        </div>
      </div>
      {showSeparator && <Separator className="mt-4" />}
    </div>
  );
}
