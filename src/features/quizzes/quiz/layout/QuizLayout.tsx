import React from "react";
import { Card } from "@components";
import { Scoreboard } from "./Scoreboard";
import { Link } from "react-router-dom";

interface QuizLayoutProps {
  title: string;
  score: number;
  streak: number;
  prompt?: React.ReactNode;
  guessForm: React.ReactNode;
  feedback?: React.ReactNode;
  resultMessage?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Generic layout for quizzes: title, scoreboard, and main content card.
 */
export function QuizLayout({
  title,
  score,
  streak,
  prompt,
  guessForm,
  feedback,
  resultMessage,
  children,
}: QuizLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="mb-20 text-2xl font-bold text-blue-800 text-center dark:text-text">
        {title}
      </h1>
      <Scoreboard score={score} streak={streak} />
      <Card className="max-w-md w-full p-8 rounded-xl shadow-lg text-center font-sans">
        {prompt && <div className="mb-8">{prompt}</div>}
        {guessForm}
        {feedback}
        {resultMessage}
        {children}
      </Card>
      <Link
        to="/quizzes"
        className="mt-8 inline-block px-4 py-2 text-white font-semibold"
      >
        ← Return
      </Link>
    </div>
  );
}
