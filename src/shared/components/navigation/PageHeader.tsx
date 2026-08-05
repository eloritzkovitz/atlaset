import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { DirectionalIcon } from "../media/icons/DirectionalIcon";

interface PageHeaderProps {
  title: string;
  fallbackPath?: string;
  onBack?: () => void;
  className?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  fallbackPath,
  onBack,
  className = "",
  action,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    // Check if the user navigated directly to this page
    const isDirectNavigation = location.key === "default";

    // If a fallback path is provided and the user navigated directly, redirect to the fallback path
    if (fallbackPath && isDirectNavigation) {
      navigate(fallbackPath, { replace: true });
      return;
    }

    navigate(-1);
  };

  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <button
        type="button"
        onClick={handleBack}
        className="flex items-center focus:outline-none"
        aria-label={t("ui.goBack")}
      >
        <span className="inline-flex items-center gap-1">
          <DirectionalIcon direction="prev" className="text-lg" />
          <h2 className="text-xl font-bold self-start">{title}</h2>
        </span>
      </button>

      {action && <div>{action}</div>}
    </div>
  );
};
