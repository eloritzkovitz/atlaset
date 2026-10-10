import React from "react";
import { Card } from "@components";
import type { LobbyCardItem } from "../types";

/** Renders a single card in the quizzes lobby. */
export const LobbyCard: React.FC<{
  card: LobbyCardItem;
  padding?: "lg" | "sm";
  animationClass?: string;
  onClick: (card: LobbyCardItem) => void;
}> = ({ card, padding = "sm", animationClass, onClick }) => {
  const pad = padding === "lg" ? "p-8" : "p-6";

  return (
    <Card
      className={`max-w-xs w-full ${pad} rounded-xl text-center font-sans h-full min-h-[220px] md:min-h-[260px]`}
      animationClass={animationClass}
      hoverEffect="scale"
      onClick={() => onClick(card)}
    >
      <div
        className="flex flex-col items-center h-full justify-start pt-4"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick(card);
        }}
      >
        {card.icon}
        <h2
          className={
            padding === "lg"
              ? "text-xl font-semibold mb-2"
              : "text-lg font-semibold mb-2"
          }
        >
          {card.title}
        </h2>
        <p className="text-muted text-center">{card.description}</p>
      </div>
    </Card>
  );
};
