import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import { FaUmbrellaBeach, FaStopwatch } from "react-icons/fa6";
import { ActionButton, Card } from "@components";
import { ICONS } from "@constants/icons";
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
  labelKey: string;
  icon: JSX.Element;
  descriptionKey: string;
  color: string;
}[] = [
  {
    key: "easy",
    labelKey: "lobby.settings.levels.easy.label",
    icon: <ICONS.quizEasy className="me-2" />,
    descriptionKey: "lobby.settings.levels.easy.description",
    color: "bg-success/50 hover:bg-success-hover/50",
  },
  {
    key: "medium",
    labelKey: "lobby.settings.levels.medium.label",
    icon: <ICONS.quizMedium className="me-2" />,
    descriptionKey: "lobby.settings.levels.medium.description",
    color: "bg-warning/40 hover:bg-warning-hover/40",
  },
  {
    key: "hard",
    labelKey: "lobby.settings.levels.hard.label",
    icon: <ICONS.quizHard className="me-2" />,
    descriptionKey: "lobby.settings.levels.hard.description",
    color: "bg-warning/70 hover:bg-warning-hover/70",
  },
  {
    key: "expert",
    labelKey: "lobby.settings.levels.expert.label",
    icon: <ICONS.quizExpert className="me-2" />,
    descriptionKey: "lobby.settings.levels.expert.description",
    color: "!bg-danger/50 hover:!bg-danger-hover/50",
  },
];

const modeKeys = {
  sandbox: {
    label: "lobby.settings.modes.sandbox.label",
    description: "lobby.settings.modes.sandbox.description",
  },
  timed: {
    label: "lobby.settings.modes.timed.label",
    description: "lobby.settings.modes.timed.description",
  },
} as const;

export function QuizSettings({
  difficulty,
  setDifficulty,
  gameMode,
  setGameMode,
  onStart,
  onCancel,
}: QuizSettingsProps) {
  const { t } = useTranslation("quizzes");
  // Arrow key navigation
  useKeyHandler(
    (e) => {
      if (!document.activeElement || document.activeElement === document.body) {
        const currentIdx = LEVELS.findIndex(
          (l) => l.key === (difficulty ?? "easy"),
        );
        if (e.key === "ArrowRight") {
          setDifficulty(LEVELS[(currentIdx + 1) % LEVELS.length].key);
        } else if (e.key === "ArrowLeft") {
          setDifficulty(
            LEVELS[(currentIdx - 1 + LEVELS.length) % LEVELS.length].key,
          );
        }
      }
    },
    ["ArrowLeft", "ArrowRight"],
    true,
  );

  const selected = LEVELS.find((l) => l.key === difficulty);

  return (
    <Card className="max-w-xl w-full p-8 rounded-xl shadow-lg text-center font-sans">
      <h2 className="text-xl font-bold mb-6">{t("lobby.settings.selectDifficulty", "Select Difficulty")}</h2>
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
            {t(level.labelKey, level.key)}
          </ActionButton>
        ))}
      </div>
      <div className="mb-6 text-muted text-base min-h-[1.5em]">
        {selected ? t(selected.descriptionKey) : t("lobby.settings.selectDifficultyPlaceholder", "Select a difficulty to see details.")}
      </div>
      <h2 className="text-xl font-bold mb-6">{t("lobby.settings.selectGameMode", "Select Game Mode")}</h2>
      <div className="flex flex-col items-center mb-6">
        <div className="flex justify-center gap-4 mb-2">
          <ActionButton
            type="button"
            variant={gameMode === "sandbox" ? "primary" : "secondary"}
            className="flex flex-col items-center px-4 py-2 font-semibold border"
            onClick={() => setGameMode("sandbox")}
          >
            <FaUmbrellaBeach className="text-xl mb-1" />
            {t(modeKeys.sandbox.label, "Sandbox")}
          </ActionButton>
          <ActionButton
            type="button"
            variant={gameMode === "timed" ? "primary" : "secondary"}
            className="flex flex-col items-center px-4 py-2 font-semibold border"
            onClick={() => setGameMode("timed")}
          >
            <FaStopwatch className="text-xl mb-1" />
            {t(modeKeys.timed.label, "Timed")}
          </ActionButton>
        </div>
        <div className="mb-4 text-muted text-base min-h-[1.5em]">
          {t(modeKeys[gameMode].description)}
        </div>
      </div>
      <div className="mt-4">
        <ActionButton
          variant="primary"
          className="w-full px-4 py-2 font-bold mb-2"
          onClick={onStart}
          disabled={!difficulty}
        >
          {t("lobby.settings.startQuiz", "Start Quiz")}
        </ActionButton>
      </div>
      {onCancel && (
        <ActionButton
          variant="custom"
          className="w-full px-4 py-2 font-bold bg-input rounded-lg hover:bg-input-hover"
          onClick={onCancel}
        >
          {t("lobby.settings.cancel", "Cancel")}
        </ActionButton>
      )}
    </Card>
  );
}
