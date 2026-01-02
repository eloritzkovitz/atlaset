import React from "react";
import { Card } from "@components";
import { Scoreboard } from "./Scoreboard/Scoreboard";

interface QuizLayoutProps {
  title: string;
  score: number;
  streak: number;
  prompt?: React.ReactNode;
  guessForm: React.ReactNode;
  feedback?: React.ReactNode;
  resultMessage?: React.ReactNode;
  timeLeft?: number;
  questionNumber?: number;
  maxQuestions?: number;
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
  timeLeft,
  questionNumber,
  maxQuestions,
  children,
}: QuizLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="mb-20 text-2xl font-bold text-blue-800 text-center dark:text-text">
        {title}
      </h1>      
      <Scoreboard
        questionNumber={questionNumber}
        maxQuestions={maxQuestions}
        score={score}
        streak={streak}
        timeLeft={timeLeft}
      />
      <Card className="max-w-4xl w-full p-8 rounded-xl shadow-lg text-center font-sans">
        {prompt && <div className="mb-8">{prompt}</div>}
        {guessForm}
        {feedback}
        {resultMessage}
        {children}
      </Card>      
    </div>
  );
}
