import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "../inputs/Button/ActionButton";

export function AuthButtons() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

  return (
    <div className="flex justify-end gap-2">
      <ActionButton
        variant="secondary"
        className="min-w-[100px] !rounded-full"
        onClick={() => navigate("/login")}
      >
        {t("login.signinButton", "Log in")}
      </ActionButton>
      <ActionButton
        variant="primary"
        className="min-w-[100px] !rounded-full"
        onClick={() => navigate("/signup")}
      >
        {t("login.signupButton", "Sign up")}
      </ActionButton>
    </div>
  );
}
