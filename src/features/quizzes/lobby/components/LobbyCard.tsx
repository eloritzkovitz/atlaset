import React from "react";
import { Card } from "@components";
import type { LobbyCardItem } from "../types";

export const LobbyCard: React.FC<{
  card: LobbyCardItem;
  padding?: "lg" | "sm";
  animationClass?: string;
  onClick: (card: LobbyCardItem) => void;
}> = ({ card, padding = "sm", animationClass, onClick }) => {
  const pad = padding === "lg" ? "p-8" : "p-6";
  const classes = `cursor-pointer max-w-xs w-full ${pad} rounded-xl text-center font-sans ${
    card.muted ? "opacity-80" : "shadow-lg"
  } hover:bg-primary/40 hover:scale-102 animation transition h-full min-h-[220px] md:min-h-[260px]`;

  return (
    <Card
      className={classes}
      animationClass={animationClass}
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
