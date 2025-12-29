import { useState } from "react";
import { FaFlag, FaLandmark, FaTrophy } from "react-icons/fa6";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card } from "@components";
import {
  CapitalQuiz,
  FlagQuiz,
  Leaderboards,
  QuizSettings,
  type Difficulty,
} from "@features/quizzes";

export default function QuizzesPage() {
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = useState<null | {
    route: string;
    key: string;
  }>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>(null);

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
    <>
      <Routes>
        <Route
          index
          element={
            <div className="min-h-screen flex flex-col items-center justify-center relative">
              {!settingsOpen ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cards.map((card) => (
                    <Card
                      key={card.key}
                      className="cursor-pointer max-w-xs w-full p-8 rounded-xl shadow-lg text-center font-sans hover:bg-primary transition"
                      onClick={() =>
                        card.key !== "leaderboards"
                          ? setSettingsOpen({
                              route: card.route,
                              key: card.key,
                            })
                          : navigate(card.route)
                      }
                    >
                      <div className="flex flex-col items-center">
                        {card.icon}
                        <h2 className="text-xl font-semibold mb-2">
                          {card.title}
                        </h2>
                        <p className="text-muted">{card.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <QuizSettings
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    onStart={() => {
                      navigate(settingsOpen.route);
                      setSettingsOpen(null);
                    }}
                    onCancel={() => setSettingsOpen(null)}
                  />
                </div>
              )}
            </div>
          }
        />
        <Route
          path="guess-the-flag"
          element={<FlagQuiz difficulty={difficulty ?? undefined} />}
        />
        <Route
          path="guess-the-capital"
          element={<CapitalQuiz difficulty={difficulty ?? undefined} />}
        />
        <Route path="leaderboards" element={<Leaderboards />} />
      </Routes>
    </>
  );
}
