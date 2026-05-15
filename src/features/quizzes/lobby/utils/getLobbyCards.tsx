import type { TFunction } from "i18next";
import { ICONS } from "@constants/icons";
import type { LobbyCardItem } from "../types";

export function getLobbyCards(t: TFunction): LobbyCardItem[] {
  return [
    {
      key: "flag",
      route: "guess-the-flag",
      icon: <ICONS.quizFlag className="text-5xl mb-4" />,
      title: t("lobby.cards.flag.title", "Guess the Flag"),
      description: t(
        "lobby.cards.flag.description",
        "Can you identify the country by its flag?",
      ),
      muted: false,
      group: "primary",
    },
    {
      key: "capital",
      route: "guess-the-capital",
      icon: <ICONS.quizCapital className="text-5xl mb-4" />,
      title: t("lobby.cards.capital.title", "Guess the Capital"),
      description: t(
        "lobby.cards.capital.description",
        "Test your knowledge of world capitals!",
      ),
      muted: false,
      group: "primary",
    },
    {
      key: "howto",
      route: "/docs/quizzes/gameplay",
      icon: <ICONS.gameplay className="text-5xl mb-4 text-stone-500" />,
      title: t("lobby.cards.howto.title", "How to play"),
      description: t(
        "lobby.cards.howto.description",
        "Learn game rules, scoring and tips",
      ),
      muted: false,
      group: "secondary",
    },
    {
      key: "leaderboards",
      route: "leaderboards",
      icon: <ICONS.leaderboards className="text-5xl mb-4 text-yellow-500" />,
      title: t("lobby.cards.leaderboards.title", "Leaderboards"),
      description: t(
        "lobby.cards.leaderboards.description",
        "See top scores and streaks!",
      ),
      muted: false,
      group: "secondary",
    },
  ];
}
