import { useTranslation } from "react-i18next";
import { DirectionalIcon } from "../../media/icons/DirectionalIcon";

export interface Crumb {
  label: string;
  labelKey?: string;
  key?: string | null;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
  onCrumbClick: (key: string) => void;
}

/** Renders breadcrumbs navigation. */
export function Breadcrumbs({ crumbs, onCrumbClick }: BreadcrumbsProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-full overflow-x-auto px-1 sm:px-0 mb-6 scrollbar-hide select-none">
      <div className="inline-flex items-center gap-2 whitespace-nowrap font-bold">
        {crumbs.map((crumb, idx, arr) => {
          const isLast = idx === arr.length - 1;
          const hasAction = crumb.key && !isLast;
          const content =
            crumb.label ?? (crumb.labelKey ? t(crumb.labelKey) : "");

          return (
            <span key={idx} className="flex items-center">
              {hasAction ? (
                <button
                  className="text-gray-300 hover:text-info-hover !font-bold"
                  onClick={() => onCrumbClick(crumb.key!)}
                >
                  {content}
                </button>
              ) : (
                <span
                  className={isLast ? "text-gray-500" : "text-gray-400"}
                  aria-current={isLast ? "page" : undefined}
                >
                  {content}
                </span>
              )}

              {!isLast && (
                <DirectionalIcon
                  direction="next"
                  className="text-sm text-gray-400 ms-2"
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
