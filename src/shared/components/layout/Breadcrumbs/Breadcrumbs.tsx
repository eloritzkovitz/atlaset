export interface Crumb {
  label: string;
  key?: string | null;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
  onCrumbClick: (key: string) => void;
}

export function Breadcrumbs({ crumbs, onCrumbClick }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {crumbs.map((crumb, idx, arr) => {
        const isLast = idx === arr.length - 1;
        return (
          <span key={idx} className="flex items-center">
            {crumb.key && !isLast ? (
              <button
                className="text-gray-300 hover:underline font-bold"
                onClick={() => onCrumbClick(crumb.key!)}
              >
                {crumb.label}
              </button>
            ) : (
              <span
                className={`font-bold ${
                  isLast ? "text-gray-500" : "text-gray-400"
                }`}
                aria-current={isLast ? "page" : undefined}
              >
                {crumb.label}
              </span>
            )}
            {idx < arr.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
