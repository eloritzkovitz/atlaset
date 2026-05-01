import { FaXmark } from "react-icons/fa6";
import { useUIHintContext } from "@contexts/UIHintContext";
import { useLanguage } from "@features/settings";

export function UIHintContainer() {
  const { hints, removeHint } = useUIHintContext();
  const { isRtl } = useLanguage();

  const topHints = hints.filter((hint) => hint.position !== "bottom");
  const bottomHints = hints.filter((hint) => hint.position === "bottom");

  // Render hints based on their position
  function renderHintList(hintList: typeof hints, positionClass: string) {
    if (hintList.length === 0) return null;
    return (
      <div
        className={`fixed ${positionClass} start-1/2 ${isRtl ? "translate-x-1/2" : "-translate-x-1/2"} z-[1000] flex flex-col gap-2 pointer-events-none`}
      >
        {hintList.map((hint) => (
          <div
            key={hint.id}
            className="px-6 py-3 rounded-xl shadow-lg text-base bg-gray-800/95 text-gray-100 pointer-events-auto flex items-center"
            style={{
              ...hint.style,
              minWidth: 200,
              maxWidth: 600,
            }}
          >
            <span className="flex items-center gap-2 flex-1">
              {hint.icon && <span className="text-lg">{hint.icon}</span>}
              {hint.content}
            </span>
            {hint.dismissable && (
              <button
                className="ms-3 text-muted hover:text-muted-hover pointer-events-auto"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                }}
                onClick={() => removeHint(hint.id)}
                aria-label="Dismiss"
              >
                <FaXmark />
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {renderHintList(topHints, "top-6")}
      {renderHintList(bottomHints, "bottom-6")}
    </>
  );
}
