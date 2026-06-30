import { FaArrowsRotate } from "react-icons/fa6";
import { usePwaUpdate, useUiHint } from "@hooks";

export function PwaUpdateUiHint() {
  const { needRefresh, updateServiceWorker } = usePwaUpdate();

  useUiHint(
    needRefresh
      ? {
          message: (
            <>
              A new version is available.{" "}
              <button className="underline" onClick={updateServiceWorker}>
                Update now
              </button>
            </>
          ),
          icon: <FaArrowsRotate className="text-lg" />,
        }
      : null,
    0,
    { key: "pwa-update", dismissable: true }
  );

  return null;
}
