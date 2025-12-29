import { FaFlag, FaLandmark, FaTrophy } from "react-icons/fa6";
import { Card } from "@components";
import FlagQuiz from "@features/quizzes/FlagQuiz";
import CapitalQuiz from "@features/quizzes/CapitalQuiz";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Leaderboards } from "@features/quizzes/Leaderboards";

export default function QuizzesPage() {
  const navigate = useNavigate();

  const cards = [
    {
      key: "flag",
      route: "guess-the-flag",
      icon: <FaFlag className="text-5xl mb-4" />,
      title: "Guess the Flag",
      description: "Can you identify the country by its flag?",
      muted: false,
    },
    {
      key: "capital",
      route: "guess-the-capital",
      icon: <FaLandmark className="text-5xl mb-4" />,
      title: "Guess the Capital",
      description: "Test your knowledge of world capitals!",
      muted: true,
    },
    {
      key: "leaderboards",
      route: "leaderboards",
      icon: <FaTrophy className="text-5xl mb-4 text-yellow-500" />,
      title: "Leaderboards",
      description: "See top scores and streaks!",
      muted: true,
    },
  ];

  return (
    <Routes>
      <Route
        index
        element={
          <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cards.map((card) => (
                <Card
                  key={card.key}
                  className="cursor-pointer max-w-xs w-full p-8 rounded-xl shadow-lg text-center font-sans hover:bg-primary transition"
                  onClick={() => navigate(card.route)}
                >
                  <div className="flex flex-col items-center">
                    {card.icon}
                    <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                    <p
                      className={
                        card.muted
                          ? "text-muted"
                          : "text-gray-600 dark:text-gray-300"
                      }
                    >
                      {card.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        }
      />
      <Route path="guess-the-flag" element={<FlagQuiz />} />
      <Route path="guess-the-capital" element={<CapitalQuiz />} />
      <Route path="leaderboards" element={<Leaderboards />} />
    </Routes>
  );
}
