import { ActionButton } from "@components";

export function GuessForm({
  guess,
  setGuess,
  handleGuess,
  skipFlag,
  disabled,
}: {
  guess: string;
  setGuess: (g: string) => void;
  handleGuess: (e: React.FormEvent) => void;
  skipFlag: () => void;
  disabled: boolean;
}) {
  return (
    <form onSubmit={handleGuess}>
      <input
        type="text"
        placeholder="Enter country name"
        aria-label="Country name"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        className="px-4 py-2 text-lg bg-input rounded-full border border-none focus:outline-none focus:ring-none w-4/5 mb-4"
        disabled={disabled}
      />
      <div className="flex justify-center gap-4 mb-2">
        <ActionButton
          type="submit"
          aria-label="Submit guess"
          className="bg-primary text-white hover:bg-primary-hover px-6 py-2 text-base rounded-full font-bold"
          disabled={disabled}          
        >
          Guess
        </ActionButton>
        <ActionButton
          type="button"
          aria-label="Skip flag"
          onClick={skipFlag}
          className="px-6 py-2 text-base rounded-full font-bold bg-input text-muted hover:bg-input-hover"
          disabled={disabled}          
        >
          Skip
        </ActionButton>
      </div>
    </form>
  );
}