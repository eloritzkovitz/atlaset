import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ActionButton } from "@components";
import type { Country } from "@features/countries";
import { useKeyHandler } from "@hooks/useKeyHandler";
import "./ResultMessage.css";

interface ResultMessageProps {
  result: boolean | null;
  currentCountry: Country;
  nextFlag: () => void;
  answerLabel?: string;
}

export function ResultMessage({
  result,
  currentCountry,
  nextFlag,
  answerLabel,
}: ResultMessageProps) {
  const [animate, setAnimate] = useState(false);

  // Trigger animation on result change
  useEffect(() => {
    if (result !== null) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 700);
      return () => clearTimeout(timeout);
    }
  }, [result]);

  // Handle "Enter" key to go to the next flag if result is not null
  useKeyHandler(
    () => {
      if (result !== null) nextFlag();
    },
    ["Enter"],
    result !== null
  );

  return (
    <div
      className="my-4 text-lg flex flex-col items-center"
      style={{ minHeight: 120 }}
    >
      <div
        className={`mb-2 flex items-center gap-2 ${animate ? "scale-up" : ""}`}
        style={{ minHeight: 40, minWidth: 260, justifyContent: "center" }}
      >
        {result === null ? (
          <span className="invisible">&nbsp;</span>
        ) : result ? (
          <>
            <FaCheckCircle className="text-success text-2xl animate-bounce" />
            <span className="text-success font-bold">Correct!</span>
          </>
        ) : (
          <>
            <FaTimesCircle className="text-danger text-2xl animate-shake" />
            <span className="text-danger font-bold">
              Wrong! It was <b>{answerLabel ?? currentCountry.name}</b>
            </span>
          </>
        )}
      </div>
      <div
        className="flex justify-center gap-4 mb-2 mt-4"
        style={{ minHeight: 48 }}
      >
        {result !== null && (
          <ActionButton
            onClick={nextFlag}
            variant="primary"
            aria-label="Next"
            rounded
          >
            Next Flag
          </ActionButton>
        )}
      </div>
    </div>
  );
}
