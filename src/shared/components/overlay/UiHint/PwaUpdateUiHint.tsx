import { useTranslation } from "react-i18next";
import { FaArrowsRotate } from "react-icons/fa6";
import { usePwaUpdate, useUiHint } from "@hooks";

export function PwaUpdateUiHint() {
  const { needRefresh, updateServiceWorker } = usePwaUpdate();
  const { t } = useTranslation("common");

  useUiHint(
    needRefresh
      ? {
          message: (
            <>
              {t("pwa.updateAvailable", "A new version is available.")}
              {""}
              <button className="underline" onClick={updateServiceWorker}>
                {t("pwa.updateNow", "Update now")}
              </button>
            </>
          ),
          icon: <FaArrowsRotate className="text-lg" />,
        }
      : null,
    0,
    { key: "pwa-update", dismissable: true },
  );

  return null;
}
