import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { FaCircleXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "@app/store";
import {
  getLobbyCards,
  setDifficulty,
  setGameMode,
  setQuizType,
  LobbyCard,
  QuizEntry,
  QuizSettings,
  type LobbyCardItem,
} from "@features/quizzes";
import { useUiHint } from "@hooks";
import { isAuthenticated } from "@utils/firebase";
import { useFlyTransition, usePageTitle } from "@hooks";

// Lazy load leaderboards component
const Leaderboards = lazy(() =>
  import("@features/quizzes/leaderboards/components/Leaderboards").then(
    (mod) => ({ default: mod.Leaderboards }),
  ),
);

export default function QuizzesPage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("quizzes");
  const { t: tCommon } = useTranslation("common");

  const cards = useMemo(() => getLobbyCards(t), [t]) as LobbyCardItem[];
  const rows = [
    { group: "primary", padding: "lg" as const },
    { group: "secondary", padding: "sm" as const },
  ];

  // Set page titles dynamically
  const match = cards.find((card) => location.pathname.endsWith(card.route));
  const appName = tCommon("appName", "Atlaset");
  usePageTitle(match ? match.title : t("pageTitle", "Quizzes"), {
    suffix: ` | ${appName}`,
    fallback: `${t("pageTitle", "Quizzes")} | ${appName}`,
  });

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
  const difficulty = useSelector(
    (state: RootState) => state.quizSettings.difficulty,
  );
  const gameMode = useSelector(
    (state: RootState) => state.quizSettings.gameMode,
  );

  // When settingsOpen triggers, start fly-out and show settings after
  React.useEffect(() => {
    if (settingsOpen) {
      setShowSettings(false);
      triggerFlyOut();
      setTimeout(() => setShowSettings(true), 500);
    } else {
      setShowSettings(false);
      setTimeout(() => {
        triggerFlyIn();
      }, 10);
    }
  }, [settingsOpen, triggerFlyOut, triggerFlyIn]);

  // Timed leaderboard hint
  const [leaderboardHint, setLeaderboardHint] = useState<null | {
    message: string;
    icon: React.ReactNode;
  }>(null);
  const [hintKey, setHintKey] = useState(0);

  useUiHint(leaderboardHint, 4000, {
    key: `leaderboard-auth-${hintKey}`,
    position: "bottom",
    dismissable: true,
  });

  // Clear hint after 4 seconds
  useEffect(() => {
    if (leaderboardHint) {
      const timeout = setTimeout(() => setLeaderboardHint(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [leaderboardHint]);

  // Show auth required hint
  const showAuthHint = useCallback(
    (message?: string) => {
      if (leaderboardHint) return;
      setHintKey((k) => k + 1);
      setLeaderboardHint({
        message:
          message ||
          t(
            "leaderboards.authRequired",
            "You must be signed in to view leaderboards.",
          ),
        icon: <FaCircleXmark className="text-danger text-xl" />,
      });
    },
    [leaderboardHint, t],
  );

  // Handle card click behavior centrally
  const handleCardClick = useCallback(
    (card: LobbyCardItem) => {
      // Leaderboards has special auth handling
      if (card.key === "leaderboards") {
        if (isAuthenticated()) {
          navigate(card.route);
        } else {
          showAuthHint();
        }
        return;
      }

      // External/documentation links
      if (typeof card.route === "string" && card.route.startsWith("/")) {
        navigate(card.route);
        return;
      }

      // Quiz routes require auth
      if (isAuthenticated()) {
        setSettingsOpen({ route: card.route, key: card.key });
      } else {
        showAuthHint();
      }
    },
    [navigate, showAuthHint],
  );

  return (
    <Routes>
      <Route
        index
        element={
          <div className="min-h-screen flex flex-col items-center justify-center relative">
            {showCards && (
              <div className={animating ? "pointer-events-none" : ""}>
                {rows.map(({ group, padding }) => (
                  <div
                    key={group}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all ${
                      group === "secondary" ? "mt-6" : ""
                    }`}
                  >
                    {cards
                      .filter((c) => (c.group ?? "secondary") === group)
                      .map((card) => (
                        <LobbyCard
                          key={card.key}
                          card={card}
                          padding={padding}
                          animationClass={animationClass}
                          onClick={handleCardClick}
                        />
                      ))}
                  </div>
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
                      dispatch(
                        setQuizType(settingsOpen.key as "flag" | "capital"),
                      );
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
      <Route path="guess-the-flag" element={<QuizEntry />} />
      <Route path="guess-the-capital" element={<QuizEntry />} />
      <Route
        path="leaderboards"
        element={
          <Suspense>
            <Leaderboards />
          </Suspense>
        }
      />
    </Routes>
  );
}
