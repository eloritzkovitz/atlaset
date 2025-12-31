import { Card } from "@components";
import { useScoreFlashAnimation } from "../../hooks/useScoreFlashAnimation";
import { useTimerFlashAnimation } from "../../hooks/useTimerFlashAnimation";
import "./Scoreboard.css";

interface ScoreboardProps {
  score: number;
  streak: number;
  timeLeft?: number;
  maxQuestions?: number;
}

export function Scoreboard({
  score,
  streak,
  timeLeft,
  maxQuestions,
}: ScoreboardProps) {
  const scoreClass = useScoreFlashAnimation(score);
  const streakClass = useScoreFlashAnimation(streak);
  const timeDanger = useTimerFlashAnimation(timeLeft);
  
  // Show score as score/maxQuestions only in timed mode (when timeLeft is defined)
  const showTimedScore = typeof timeLeft === "number" && typeof maxQuestions === "number";
  
  return (
    <Card className="w-full max-w-2xl mb-6 px-2 py-4 flex justify-center items-center gap-25 text-2xl font-semibold text-text shadow">
      <span className={scoreClass}>
        Score: {" "}
        <b>
          {showTimedScore ? `${score}/${maxQuestions}` : score}
        </b>
      </span>
      <span className={streakClass}>
        Streak: <b>{streak}</b>
      </span>
      {typeof timeLeft === "number" && (
        <span className={timeDanger ? "text-danger fast-pulse" : undefined}>
          Time Left: {" "}
          <b>
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </b>
        </span>
      )}
    </Card>
  );
}
