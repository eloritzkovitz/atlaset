import { useNavigate } from "react-router-dom";
import { Card, ActionButton } from "@components";
import { useAnimatedNumber } from "@hooks";
import { formatTimeSeconds } from "@utils/date";

export interface GameOverCardProps {
  type?: "gameover" | "victory";
  score?: number;
  streak?: number;
  timeUsed?: number;
  onPlayAgain?: () => void;
  onReturn?: () => void;
}

export function GameOverCard({
  type = "gameover",
  score,
  streak,
  timeUsed,
  onPlayAgain,
  onReturn,
}: GameOverCardProps) {
  const navigate = useNavigate();
  const handleReturn = onReturn || (() => navigate("/quizzes"));

  // Determine if it's a victory
  const isVictory = type === "victory";

  // Animated numbers for score, streak, time using hook with duration
  const animatedScore = useAnimatedNumber(score ?? 0, 640);
  const animatedStreak = useAnimatedNumber(streak ?? 0, 640);
  const animatedTime = useAnimatedNumber(timeUsed ?? 0, 640);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      <Card className="w-full max-w-xl">
        <div className="card-body items-center text-center">
          <h2
            className={`card-title text-4xl font-bold mb-4 ${
              isVictory ? "text-success" : "text-danger"
            }`}
          >
            {isVictory ? "Victory!" : "Game Over..."}
          </h2>
          <div className="mb-8 text-lg font-semibold">
            {isVictory
              ? "You completed the quiz! Well done!"
              : "Better luck next time!"}
          </div>
          {isVictory && (
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
