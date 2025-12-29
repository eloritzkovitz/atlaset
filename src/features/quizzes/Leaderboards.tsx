import { Card } from "@components";
import { FaTrophy } from "react-icons/fa6";

export function Leaderboards() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="mb-12 text-3xl font-bold text-blue-800 text-center dark:text-text">
        Leaderboards
      </h1>
      <Card className="max-w-md w-full p-8 rounded-xl shadow-lg text-center font-sans">
        <FaTrophy className="text-5xl mb-4 text-yellow-500" />
        <p className="text-lg">Leaderboard coming soon!</p>
      </Card>
    </div>
  );
}
