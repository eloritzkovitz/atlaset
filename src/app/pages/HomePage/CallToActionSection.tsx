import { ActionButton } from "@components";
import { useTranslation } from "react-i18next";

export function CallToActionSection() {
  const { t } = useTranslation("home");

  return (
    <section
      className="w-full relative flex flex-col items-center justify-center py-20 px-0"
      style={{
        backgroundImage: "url(/assets/action.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white drop-shadow-sm">
          {t("callToAction.title")}
        </h2>
        <ActionButton
          variant="primary"
          className="px-8 py-3 text-lg font-semibold rounded-xl shadow-md w-full md:w-auto"
          onClick={() => (window.location.href = "/signup")}
        >
          {t("callToAction.button")}
        </ActionButton>
      </div>
    </section>
  );
}
