import { ActionButton } from "@components";
import type { Country } from "@features/countries";
import { useKeyHandler } from "@hooks/useKeyHandler";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

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

  // If there's no result yet, don't render anything
  if (result === null) return null;

  return (
    <div className="my-4 text-lg flex flex-col items-center">
      <div
        className={`mb-2 flex items-center gap-2 ${animate ? "scale-up" : ""}`}
      >
        {result ? (
          <FaCheckCircle className="text-success text-2xl animate-bounce" />
        ) : (
          <FaTimesCircle className="text-danger text-2xl animate-shake" />
        )}
        {result ? (
          <span className="text-success font-bold">Correct!</span>
        ) : (
          <span className="text-danger font-bold">
            Wrong! It was <b>{answerLabel ?? currentCountry.name}</b>
          </span>
        )}
      </div>
      <div className="flex justify-center gap-4 mb-2 mt-4">
        <ActionButton
          onClick={nextFlag}
          variant="primary"
          aria-label="Next"
          rounded
        >
          Next Flag
        </ActionButton>
      </div>
    </div>
  );
}
