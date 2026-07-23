import { ActionButton, InputBox } from "@components";
import { useRef, useEffect } from "react";
import { useKeyHandler } from "@hooks";
import { useTranslation } from "react-i18next";

interface GuessFormProps {
  guess: string;
  setGuess: (g: string) => void;
  handleGuess: (e: React.FormEvent) => void;
  skipFlag: () => void;
  handleForfeit?: () => void;
  disabled: boolean;
  placeholder?: string;
  forfeitButton?: React.ReactNode;
}

export function GuessForm({
  guess,
  setGuess,
  handleGuess,
  skipFlag,
  handleForfeit,
  disabled,
  placeholder = "Enter country name",
}: GuessFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("quizzes");

  // Autofocus on mount and when enabled changes
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Refocus input on '/' key
  useKeyHandler(
    () => {
      if (inputRef.current) inputRef.current.focus();
    },
    ["/"],
    { enabled: !disabled },
  );

  return (
    <form onSubmit={handleGuess}>
      <div className="flex justify-center gap-4 mb-2 items-center">
        <InputBox
          ref={inputRef}
          id="guess-input"
          name="guess-input"
          type="text"
          placeholder={t("play.placeholder", placeholder)}
          aria-label={t("play.placeholder", placeholder)}
          value={guess}
          onChange={(e: { target: { value: string } }) =>
            setGuess(e.target.value)
          }
          className="w-xl mb-4 text-lg rounded-full"
          disabled={disabled}
        />
      </div>
      <div className="flex justify-center gap-4 mb-2 items-center">
        <ActionButton
          type="submit"
          variant="primary"
          aria-label={t("play.form.submit", "Submit guess")}
          disabled={disabled}
          className="!text-2xl"
          rounded
        >
          {t("play.form.guess", "Guess")}
        </ActionButton>
        <ActionButton
          type="button"
          variant="secondary"
          aria-label={t("play.form.skip", "Skip flag")}
          onClick={skipFlag}
          disabled={disabled}
          className="!text-2xl"
          rounded
        >
          {t("play.form.skip", "Skip")}
        </ActionButton>
        <ActionButton
          type="button"
          variant="secondary"
          aria-label={t("play.form.forfeit", "Forfeit")}
          onClick={handleForfeit}
          className="px-4 py-2  !bg-danger/70 !text-2xl hover:!bg-danger-hover transition"
          rounded
        >
          {t("play.form.forfeit", "Forfeit")}
        </ActionButton>
      </div>
    </form>
  );
}
