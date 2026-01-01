import { useNavigate } from "react-router-dom";
import { Card, ActionButton } from "@components";
import { useAnimatedNumber } from "@hooks";
import { formatTimeSeconds } from "@utils/date";
import { useQuizAudio } from "../hooks/useQuizAudio";
import { useEffect } from "react";

export interface GameOverCardProps {
  type?: "gameover" | "complete";
  score?: number;
  streak?: number;
  timeUsed?: number;
  maxQuestions?: number;
  onPlayAgain?: () => void;
  onReturn?: () => void;
}

export function GameOverCard({
  type = "gameover",
  score,
  streak,
  timeUsed,
  maxQuestions,
  onPlayAgain,
  onReturn,
}: GameOverCardProps) {
  const { playPerfect, playGood, playLose, playAww } = useQuizAudio();
  const navigate = useNavigate();
  const handleReturn = onReturn || (() => navigate("/quizzes"));

  // Determine if it's a completed quiz
  const isComplete = type === "complete";

  // Animated numbers for score, streak, time using hook with duration
  const animatedScore = useAnimatedNumber(score ?? 0, 640);
  const animatedStreak = useAnimatedNumber(streak ?? 0, 640);
  const animatedTime = useAnimatedNumber(timeUsed ?? 0, 640);

  // Calculate success percentage if possible
  let percent: number | null = null;
  if (typeof score === "number" && typeof maxQuestions === "number" && maxQuestions > 0) {
    percent = Math.round((score / maxQuestions) * 100);
  }

  // Play sound on mount based on result
  useEffect(() => {
    if (type === "complete") {
      if (percent === 100) {
        playPerfect();
      } else if (percent !== null && percent >= 80) {
        playGood();
      } else if (percent !== null && percent >= 40) {
        playAww();
      } else {
        playAww();
      }
    } else {
      playLose();
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dynamic heading, color, and message based on score/percentage
  let resultHeading = "";
  let resultMessage = "";
  let headingColor = "text-success";
  if (percent !== null) {
    if (percent === 100) {
      resultHeading = "Perfect!";
      resultMessage = "A perfect score! Outstanding!";
      headingColor = "text-success";
    } else if (percent >= 80) {
      resultHeading = "Excellent job!";
      resultMessage = "You really know your stuff.";
      headingColor = "text-success/80";
    } else if (percent >= 60) {
      resultHeading = "Great effort!";
      resultMessage = "Keep practicing to improve even more.";
      headingColor = "text-warning";
    } else if (percent >= 40) {
      resultHeading = "Not bad!";
      resultMessage = "Try again to boost your score.";
      headingColor = "text-warning/80";
    } else {
      resultHeading = "You could do some more practice...";
      resultMessage = "Keep practicing and you'll get better!";
      headingColor = "text-danger/80";
    }
  } else if (typeof score === "number") {
    resultHeading = "Quiz Complete!";
    resultMessage = `Your score: ${score}`;
    headingColor = "text-success";
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      <Card className="w-full max-w-xl">
        <div className="card-body items-center text-center">
          <h2
            className={`card-title text-4xl font-bold mb-4 ${
              isComplete ? headingColor : "text-danger"
            }`}
          >
            {isComplete ? resultHeading : "Game Over..."}
          </h2>
          <div className="mb-8 text-lg font-semibold">
            {isComplete
              ? resultMessage || "You completed the quiz! Well done!"
              : "Better luck next time!"}
            {percent !== null && (
              <div className="text-base text-muted mt-2">Success rate: {percent}%</div>
            )}
          </div>
          {isComplete && (
            <div className="mb-8 flex flex-row items-center justify-center gap-6">
              {typeof score === "number" && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted mb-1">Score</span>
                  <span className="text-2xl font-bold text-success/80">
                    {animatedScore}
                  </span>
                </div>
              )}
              {typeof streak === "number" && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted mb-1">Max Streak</span>
                  <span className="text-2xl font-bold text-warning">
                    {animatedStreak}
                  </span>
                </div>
              )}
              {typeof timeUsed === "number" && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-muted mb-1">Time</span>
                  <span className="text-2xl font-bold text-info">
                    {formatTimeSeconds(animatedTime)}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-4 w-full items-center">
            <ActionButton
              type="button"
              variant="primary"
              className="w-full max-w-xs"
              onClick={onPlayAgain || (() => window.location.reload())}
              rounded
            >
              Play Again
            </ActionButton>
            <ActionButton
              type="button"
              variant="custom"
              className="w-full max-w-xs px-4 py-2 font-bold bg-input rounded-lg hover:bg-input-hover"
              onClick={handleReturn}
              rounded
            >
              Return
            </ActionButton>
          </div>
        </div>
      </Card>
    </div>
  );
}
