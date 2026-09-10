import { useTranslation } from "react-i18next";
import { FaWikipediaW } from "react-icons/fa6";
import { getWikipediaUrl } from "@utils";
import { ActionButton } from "../inputs/Button/ActionButton";

interface WikipediaButtonProps {
  searchTerm?: string;
  lang?: string;
  url?: string;
  className?: string;
}

export function WikipediaButton({
  searchTerm,
  lang,
  url,
  className = "",
}: WikipediaButtonProps) {
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
