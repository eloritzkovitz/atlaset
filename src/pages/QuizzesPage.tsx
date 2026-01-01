import React, { useState } from "react";
import { FaFlag, FaLandmark, FaTrophy } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Card } from "@components";
import { Leaderboards, QuizEntry, QuizSettings } from "@features/quizzes";
import { setQuizType, setDifficulty, setGameMode } from "@features/quizzes/quiz/quizSettingsSlice";
import { useFlyTransition } from "@hooks";

export default function QuizzesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // UI state
  const [settingsOpen, setSettingsOpen] = useState<null | {
    route: string;
    key: string;
  }>(null);

  // Card fly/fly-back animation
  const {
    visible: showCards,
    animating,
    animationClass,
    trigger: triggerFlyOut,
    show: triggerFlyIn,
  } = useFlyTransition({
    duration: 500,
    direction: "left",
    initialVisible: true,
  });

  // Show settings after fly-out
  const [showSettings, setShowSettings] = useState(false);

  // Redux quiz settings
  const difficulty = useSelector((state: any) => state.quizSettings.difficulty);
  const gameMode = useSelector((state: any) => state.quizSettings.gameMode);

  // When settingsOpen triggers, start fly-out and show settings after
  React.useEffect(() => {
    if (settingsOpen) {
      setShowSettings(false);
      triggerFlyOut();
      setTimeout(() => setShowSettings(true), 500);
    } else {
      setShowSettings(false);
      // Fly cards back in
      setTimeout(() => {
        triggerFlyIn();
      }, 10); // allow settings to close first
    }
  }, [settingsOpen, triggerFlyOut, triggerFlyIn]);

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
              {showCards && (
                <div
                  className={
                    "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all" +
                    (animating ? " pointer-events-none" : "")
                  }
                >
                  {cards.map((card) => (
                    <Card
                      key={card.key}
                      className="cursor-pointer max-w-xs w-full p-8 rounded-xl shadow-lg text-center font-sans hover:bg-primary/50 hover:scale-105 animation transition"
                      animationClass={animationClass}
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
              )}
              {showSettings && settingsOpen && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="animate-fly-in">
                    <QuizSettings
                      difficulty={difficulty}
                      setDifficulty={(value) => dispatch(setDifficulty(value))}
                      gameMode={gameMode}
                      setGameMode={(value) => dispatch(setGameMode(value))}
                      onStart={() => {
                        dispatch(setQuizType(settingsOpen.key as "flag" | "capital"));
                        navigate(settingsOpen.route);
                        setSettingsOpen(null);
                      }}
                      onCancel={() => setSettingsOpen(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          }
        />
        <Route
          path="guess-the-flag"
          element={<QuizEntry />}
        />
        <Route
          path="guess-the-capital"
          element={<QuizEntry />}
        />
        <Route path="leaderboards" element={<Leaderboards />} />
      </Routes>
    </>
  );
}
