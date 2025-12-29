import { ActionButton, InputBox } from "@components";

interface GuessFormProps {
  guess: string;
  setGuess: (g: string) => void;
  handleGuess: (e: React.FormEvent) => void;
  skipFlag: () => void;
  disabled: boolean;
  placeholder?: string;
}

export function GuessForm({
  guess,
  setGuess,
  handleGuess,
  skipFlag,
  disabled,
  placeholder = "Enter country name",
}: GuessFormProps) {
  return (
    <form onSubmit={handleGuess}>
      <InputBox
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        value={guess}
        onChange={(e: { target: { value: string } }) =>
          setGuess(e.target.value)
        }
        className="mb-4 text-lg rounded-full"
        disabled={disabled}
      />
      <div className="flex justify-center gap-4 mb-2">
        <ActionButton
          type="submit"
          variant="primary"
          aria-label="Submit guess"
          disabled={disabled}
          rounded
        >
          Guess
        </ActionButton>
        <ActionButton
          type="button"
          variant="secondary"
          aria-label="Skip flag"
          onClick={skipFlag}
          disabled={disabled}
          rounded
        >
          Skip
        </ActionButton>
      </div>
    </form>
  );
}
