import { ActionButton } from "@components";
import type { Country } from "@features/countries";
import { useKeyHandler } from "@hooks/useKeyHandler";

export function ResultMessage({
  result,
  currentCountry,
  nextFlag,
  answerLabel,
}: {
  result: boolean | null;
  currentCountry: Country;
  nextFlag: () => void;
  answerLabel?: string;
}) {
  // Handle "Enter" key to go to the next flag if result is not null
  useKeyHandler(
    () => {
      if (result !== null) nextFlag();
    },
    ["Enter"],
    result !== null
  );

  // Don't render anything if result is null
  if (result === null) return null;
  
  return (
    <div className="my-4 text-lg">
      {result ? (
        <span className="text-success">Correct! 🎉</span>
      ) : (
        <span className="text-danger">
          Wrong! It was <b>{answerLabel ?? currentCountry.name}</b>
        </span>
      )}
      <div className="flex justify-center gap-4 mb-2 mt-4">
        <ActionButton
          onClick={nextFlag}
          className="px-6 py-2 text-base rounded font-bold bg-primary hover:bg-primary-hover"
          aria-label="Next"
        >
          Next Flag
        </ActionButton>
      </div>
    </div>
  );
}
