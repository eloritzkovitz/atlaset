import { useEffect, useState } from "react";

interface TimedQuizSessionProps {
  duration: number;
  maxQuestions: number;
  children: (session: {
    timeLeft: number;
    questionsAnswered: number;
    sessionActive: boolean;
    endSession: () => void;
    incrementQuestions: () => void;
  }) => React.ReactNode;
}

export function TimedQuizSession({ duration, maxQuestions, children }: TimedQuizSessionProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [sessionActive, setSessionActive] = useState(true);

  // Timer effect
  useEffect(() => {
    if (!sessionActive) return;
    setTimeLeft(duration);
    setQuestionsAnswered(0);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setSessionActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionActive, duration]);

  // End session if max questions reached
  useEffect(() => {
    if (questionsAnswered >= maxQuestions) {
      setSessionActive(false);
    }
  }, [questionsAnswered, maxQuestions]);

  const endSession = () => setSessionActive(false);
  const incrementQuestions = () => setQuestionsAnswered((n) => n + 1);

  return (
    <>{children({ timeLeft, questionsAnswered, sessionActive, endSession, incrementQuestions })}</>
  );
}
