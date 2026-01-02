import { type JSX } from "react";
import {
  FaBinoculars,
  FaHatWizard,
  FaCompass,
  FaLeaf,
  FaUmbrellaBeach,
  FaStopwatch,
} from "react-icons/fa6";
import { ActionButton, Card } from "@components";
import { useKeyHandler } from "@hooks";
import type { Difficulty, GameMode } from "../../types";

interface QuizSettingsProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  onStart: () => void;
  onCancel?: () => void;
}

const LEVELS: {
  key: Exclude<Difficulty, null>;
  label: string;
  icon: JSX.Element;
  description: string;
  color: string;
}[] = [
  {
    key: "easy",
    label: "Easy",
    icon: <FaLeaf className="mr-2" />,
    description: "Familiar countries you likely know.",
    color: "bg-success/50 hover:bg-success-hover/50",
  },
  {
    key: "medium",
    label: "Medium",
    icon: <FaCompass className="mr-2" />,
    description: "A mix of common and less-known countries.",
    color: "bg-warning/40 hover:bg-warning-hover/40",
  },
  {
    key: "hard",
    label: "Hard",
    icon: <FaBinoculars className="mr-2" />,
    description: "Challenging countries that will test your knowledge!",
    color: "bg-warning/70 hover:bg-warning-hover/70",
  },
  {
    key: "expert",
    label: "Expert",
    icon: <FaHatWizard className="mr-2" />,
    description: "Obscure countries and dependencies, only for true experts!",
    color: "!bg-danger/50 hover:!bg-danger-hover/50",
  },
];

const modeDescriptions = {
  sandbox: "No timer, practice freely.",
  timed: "Race against the clock!",
};

export function QuizSettings({
  difficulty,
  setDifficulty,
  gameMode,
  setGameMode,
  onStart,
  onCancel,
}: QuizSettingsProps) {
  // Arrow key navigation
  useKeyHandler(
    (e) => {
      if (!document.activeElement || document.activeElement === document.body) {
        const currentIdx = LEVELS.findIndex(
          (l) => l.key === (difficulty ?? "easy")
        );
        if (e.key === "ArrowRight") {
          setDifficulty(LEVELS[(currentIdx + 1) % LEVELS.length].key);
        } else if (e.key === "ArrowLeft") {
          setDifficulty(
            LEVELS[(currentIdx - 1 + LEVELS.length) % LEVELS.length].key
          );
        }
      }
    },
    ["ArrowLeft", "ArrowRight"],
    true
  );

  const selected = LEVELS.find((l) => l.key === difficulty);

  return (
    <Card className="max-w-xl w-full p-8 rounded-xl shadow-lg text-center font-sans">
      <h2 className="text-xl font-bold mb-6">Select Difficulty</h2>
      <div className="flex justify-center gap-4 mb-4">
        {LEVELS.map((level) => (
          <ActionButton
            key={level.key}
            variant={difficulty === level.key ? "primary" : "secondary"}
            className={`px-4 py-2 font-semibold border ${
              difficulty === level.key ? `${level.color}` : ""
            }`}
            onClick={() => setDifficulty(level.key)}
          >
            {level.icon}
            {level.label}
          </ActionButton>
        ))}
      </div>
      <div className="mb-6 text-muted text-base min-h-[1.5em]">
        {selected
          ? selected.description
          : "Select a difficulty to see details."}
      </div>
      <h2 className="text-xl font-bold mb-6">Select Game Mode</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="flex justify-center gap-4 mb-2">
          <ActionButton
            type="button"
            variant={gameMode === "sandbox" ? "primary" : "secondary"}
            className="flex flex-col items-center px-4 py-2 font-semibold border"
            onClick={() => setGameMode("sandbox")}
          >
            <FaUmbrellaBeach className="text-xl mb-1" />
            Sandbox
          </ActionButton>
          <ActionButton
            type="button"
            variant={gameMode === "timed" ? "primary" : "secondary"}
            className="flex flex-col items-center px-4 py-2 font-semibold border"
            onClick={() => setGameMode("timed")}
          >
            <FaStopwatch className="text-xl mb-1" />
            Timed
          </ActionButton>
        </div>
        <div className="mb-4 text-muted text-base min-h-[1.5em]">
          {modeDescriptions[gameMode]}
        </div>
      </div>
      <div className="mt-4">
        <ActionButton
          variant="primary"
          className="w-full px-4 py-2 font-bold mb-2"
          onClick={onStart}
          disabled={!difficulty}
        >
          Start Quiz
        </ActionButton>
      </div>
      {onCancel && (
        <ActionButton
          variant="custom"
          className="w-full px-4 py-2 font-bold bg-input rounded-lg hover:bg-input-hover"
          onClick={onCancel}
        >
          Cancel
        </ActionButton>
      )}
    </Card>
  );
}
