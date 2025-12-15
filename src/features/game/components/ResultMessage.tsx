import { ActionButton } from "@components";
import { useKeyHandler } from "@hooks/useKeyHandler";
import type { Country } from "@types";

export function ResultMessage({
  result,
  currentCountry,
  nextFlag,
}: {
  result: boolean | null;
  currentCountry: Country;
  nextFlag: () => void;
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
          Wrong! It was <b>{currentCountry.name}</b>
        </span>
      )}
      <div className="flex justify-center gap-4 mb-2 mt-4">
        <ActionButton
          onClick={nextFlag}
          className="px-6 py-2 text-base rounded font-bold bg-primary hover:bg-primary-hover"
          aria-label="Next Flag"
        >
          Next Flag
        </ActionButton>
      </div>
    </div>
  );
}
