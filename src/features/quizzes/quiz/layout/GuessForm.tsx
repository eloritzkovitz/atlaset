import { ActionButton, InputBox } from "@components";

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
      <div className="flex justify-center gap-4 mb-2 items-center">
        <ActionButton
          type="submit"
          variant="primary"
          aria-label="Submit guess"
          disabled={disabled}
          className="!text-2xl"
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
          className="!text-2xl"
          rounded
        >
          Skip
        </ActionButton>
        <ActionButton
          type="button"
          variant="secondary"
          aria-label="Forfeit"
          onClick={handleForfeit}
          className="px-4 py-2  !bg-danger/70 !text-2xl hover:!bg-danger-hover transition"
          rounded
        >
          Forfeit
        </ActionButton>
      </div>
    </form>
  );
}
