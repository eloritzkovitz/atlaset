import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCircleXmark } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState } from "@app/store";
import {
  useDisclosure,
  useFlyTransition,
  usePageTitle,
  useUiHint,
} from "@hooks";
import { isAuthenticated } from "@lib/firebase";
import { LobbyCard } from "./LobbyCard";
import { QuizSettings } from "./QuizSettings";
import type { LobbyCardItem } from "../types";
import { getLobbyCards } from "../utils/getLobbyCards";
import {
  setDifficulty,
  setGameMode,
  setQuizType,
} from "../../core/slices/quizSettingsSlice";

const ROWS = [
  { group: "primary", padding: "lg" as const },
  { group: "secondary", padding: "sm" as const },
];

export function QuizLobby() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation("quizzes");

  const cards = useMemo(() => getLobbyCards(t), [t]) as LobbyCardItem[];

  // Dynamic page title
  const match = cards.find((card) => location.pathname.endsWith(card.route));
  usePageTitle(match ? match.title : t("pageTitle", "Quizzes"));

  // Modal state for quiz settings
  const settingsModal = useDisclosure<{ route: string; key: string }>();
  const [showSettings, setShowSettings] = useState(false);

  // Redux
  const { difficulty, gameMode } = useSelector(
    (state: RootState) => state.quizSettings,
  );

  // Card fly/fly-back transition
  const {
    visible: showCards,
    animating,
    animationClass,
    show: triggerFlyIn,
    hide: triggerFlyOut,
  } = useFlyTransition({ duration: 500, initialVisible: true });

  // Settings fly/fly-back transition
  useEffect(() => {
    if (settingsModal.isOpen) {
      setShowSettings(false);
      triggerFlyOut();
      const timer = setTimeout(() => setShowSettings(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowSettings(false);
      const timer = setTimeout(() => triggerFlyIn(), 10);
      return () => clearTimeout(timer);
    }
  }, [settingsModal.isOpen, triggerFlyOut, triggerFlyIn]);

  // Auth Hint Toast
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

  useEffect(() => {
    if (leaderboardHint) {
      const timeout = setTimeout(() => setLeaderboardHint(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [leaderboardHint]);

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

  const handleCardClick = useCallback(
    (card: LobbyCardItem) => {
      if (card.key === "leaderboards") {
        if (isAuthenticated()) {
          navigate(card.route);
        } else {
          showAuthHint();
        }
        return;
      }

      if (typeof card.route === "string" && card.route.startsWith("/")) {
        navigate(card.route);
        return;
      }

      settingsModal.open({ route: card.route, key: card.key });
    },
    [navigate, showAuthHint, settingsModal],
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {showCards && (
        <div className={animating ? "pointer-events-none" : ""}>
          {ROWS.map(({ group, padding }) => (
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

      {showSettings && settingsModal.data && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-fly-in">
            <QuizSettings
              difficulty={difficulty}
              setDifficulty={(value) => dispatch(setDifficulty(value))}
              gameMode={gameMode}
              setGameMode={(value) => dispatch(setGameMode(value))}
              onStart={() => {
                dispatch(
                  setQuizType(settingsModal.data!.key as "flag" | "capital"),
                );
                navigate(settingsModal.data!.route);
                settingsModal.close();
              }}
              onCancel={settingsModal.close}
            />
          </div>
        </div>
      )}
    </div>
  );
}
