import { Card } from "@components";
import { useScoreFlashAnimation } from "../../hooks/useScoreFlashAnimation";
import { useTimerFlashAnimation } from "../../hooks/useTimerFlashAnimation";
import "./Scoreboard.css";

interface ScoreboardProps {
  questionNumber?: number;
  maxQuestions?: number;
  score: number;
  streak: number;
  timeLeft?: number;
}

export function Scoreboard({
  questionNumber,
  maxQuestions,
  score,
  streak,
  timeLeft,
}: ScoreboardProps) {
  const scoreClass = useScoreFlashAnimation(score);
  const streakClass = useScoreFlashAnimation(streak);
  const timeDanger = useTimerFlashAnimation(timeLeft);

  return (
    <Card className="w-full max-w-4xl mb-6 px-2 py-4 flex justify-center items-center gap-25 text-2xl font-semibold text-text shadow">
      {typeof questionNumber === "number" &&
        typeof maxQuestions === "number" && (
          <span>
            Question:{" "}
            <b>
              {questionNumber}/{maxQuestions}
            </b>
          </span>
        )}
      <span className={scoreClass}>
        Score: <b>{score}</b>
      </span>
      <span className={streakClass}>
        Streak: <b>{streak}</b>
      </span>
      {typeof timeLeft === "number" && (
        <span className={timeDanger ? "text-danger fast-pulse" : undefined}>
          Time Left:{" "}
          <b>
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </b>
        </span>
      )}
    </Card>
  );
}
