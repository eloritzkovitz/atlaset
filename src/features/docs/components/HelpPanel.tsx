import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AppLinks, Panel, Separator } from "@components";
import { ICONS } from "@constants/icons";
import { useAccessibility } from "@features/settings";
import { DocSearchResults } from "./DocSearchResults";

interface HelpPanelProps {
  open: boolean;
  onClose: () => void;
}

export function HelpPanel({ open, onClose }: HelpPanelProps) {
  const { animationsEnabled } = useAccessibility();
  const { t } = useTranslation("common");

  return (
    <Panel
      show={open}
      onHide={onClose}
      position="right"
      title={
        <>
          <ICONS.help className="me-2" /> {t("help.title")}
        </>
      }
      className="!z-[10050]"
      showSeparator={false}
      animationsEnabled={animationsEnabled}
    >
      <div className="flex flex-col h-full">
        <div className="mb-3">
          <DocSearchResults placeholder={t("help.searchPlaceholder")} />
          <Separator className="my-4" />
        </div>
        <div className="text-sm text-muted">
          {t("help.needHelp")}
          <Link to="/docs" className="ms-1 hover:!text-info">
            {t("help.documentation")}
          </Link>
          .
        </div>
        <AppLinks
          className="mt-4 text-sm font-semibold items-start"
          showDocs={false}
        />
      </div>
    </Panel>
  );
}
