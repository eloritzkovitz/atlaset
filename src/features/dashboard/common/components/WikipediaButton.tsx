import { useTranslation } from "react-i18next";
import { FaWikipediaW } from "react-icons/fa6";
import { ActionButton } from "@components";
import { useLanguage } from "@features/settings";
import { getWikipediaUrl } from "@utils";

interface WikipediaButtonProps {
  searchTerm?: string;
  url?: string;
  className?: string;
}

export function WikipediaButton({
  searchTerm,
  url,
  className = "",
}: WikipediaButtonProps) {
  const { current: lang } = useLanguage();
  const { t } = useTranslation("common");

  // Determine the target URL for the Wikipedia button, prioritizing the provided URL prop
  const targetUrl =
    url || (searchTerm ? getWikipediaUrl(searchTerm, lang) : null);

  // If no valid target URL is available, do not render
  if (!targetUrl) return null;

  return (
    <ActionButton
      url={targetUrl}
      icon={<FaWikipediaW />}
      ariaLabel={t("actions.wikipedia")}
      title={t("actions.wikipedia")}
      titlePosition="bottom"
      className={className}
      rounded
    />
  );
}
