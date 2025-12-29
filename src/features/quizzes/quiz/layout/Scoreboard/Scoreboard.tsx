import { Card } from "@components";
import "./Scoreboard.css";

interface ScoreboardProps {
  score: number;
  streak: number;
  timeLeft?: number;
  questionsAnswered?: number;
  maxQuestions?: number;
}

export function Scoreboard({
  score,
  streak,
  timeLeft,
  questionsAnswered,
  maxQuestions,
}: ScoreboardProps) {
  const showMergedScore =
    typeof questionsAnswered === "number" && typeof maxQuestions === "number";
  // Animation logic for time left
  let timeDanger = false;
  if (typeof timeLeft === "number") {
    const seconds = timeLeft % 60;
    // Danger every :00 (seconds === 0) or every second in last minute
    if (seconds === 0 || timeLeft <= 60) {
      timeDanger = true;
    }
  }

  return (
    <Card className="w-full max-w-2xl mb-6 px-2 py-4 flex justify-center items-center gap-25 text-2xl font-semibold bg-surface text-text rounded-lg shadow">
      <span>
        Score:{" "}
        <b>
          {showMergedScore ? `${questionsAnswered}/${maxQuestions}` : score}
        </b>
      </span>
      <span>
        Streak: <b>{streak}</b>
      </span>
      {typeof timeLeft === "number" && showMergedScore && (
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
