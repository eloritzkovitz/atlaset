import { FaWikipediaW } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { ActionButton } from "@components";
import { getWikipediaUrl } from "@features/countries";
import { useLanguage } from "@features/settings";

interface WikipediaButtonProps {
  countryName: string;
  className?: string;
}

export function WikipediaButton({
  countryName,
  className = "",
}: WikipediaButtonProps) {
  const { t } = useTranslation("atlas");
  const { current: lang } = useLanguage();

  const wikipediaUrl = getWikipediaUrl(countryName, lang);
  const label = t("countries.actions.wikipedia", "Wikipedia");

  return (
    <ActionButton
      url={wikipediaUrl}
      icon={<FaWikipediaW />}
      ariaLabel={label}
      title={label}
      titlePosition="bottom"
      className={className}
      rounded
    />
  );
}
