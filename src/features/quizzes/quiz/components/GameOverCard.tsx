import { Card, ActionButton } from "@components";

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
  const isVictory = type === "victory";
  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      <Card className="w-full max-w-xl">
        <div className="card-body items-center text-center">
          <h2
            className={`card-title text-2xl font-bold mb-4 ${
              isVictory ? "text-success" : "text-danger"
            }`}
          >
            {isVictory ? "Congratulations!" : "Game Over..."}
          </h2>
          <div className="mb-2 text-lg">
            {isVictory
              ? "You completed the quiz! Well done."
              : "Better luck next time!"}
          </div>
          {isVictory && (
            <div className="mb-4 flex flex-col items-center gap-2">
              {typeof score === "number" && (
                <div>
                  <span className="font-semibold">Score:</span> {score}
                </div>
              )}
              {typeof streak === "number" && (
                <div>
                  <span className="font-semibold">Streak:</span> {streak}
                </div>
              )}
              {typeof timeUsed === "number" && (
                <div>
                  <span className="font-semibold">Time:</span>{" "}
                  {Math.floor(timeUsed / 60)}:
                  {(timeUsed % 60).toString().padStart(2, "0")}
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
            <a
              href="/quizzes"
              className="btn btn-primary w-full max-w-xs"
              onClick={onReturn}
            >
              Return
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
