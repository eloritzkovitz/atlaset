import { useEffect, useState, useCallback } from "react";

/**
 * Generic quiz logic hook for reusability across different quiz types.
 * @param options - configuration for the quiz
 *   getNextQuestion: function to get the next question (should return a question object)
 *   checkAnswer: function to check if the guess is correct (guess, question) => boolean
 *   initialQuestion: (optional) initial question to start with
 */
export function useQuiz<TQuestion>({
  getNextQuestion,
  checkAnswer,
  initialQuestion = null,
}: {
  getNextQuestion: (prevQuestion: TQuestion | null) => TQuestion | null;
  checkAnswer: (guess: string, question: TQuestion) => boolean;
  initialQuestion?: TQuestion | null;
}) {
  const [question, setQuestion] = useState<TQuestion | null>(initialQuestion);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  // Set the initial question if not set
  useEffect(() => {
    if (question === null) {
      setQuestion(getNextQuestion(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNextQuestion]);

  // Handle guess submission
  const handleGuess = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!question) return;
      if (!guess.trim()) {
        setFeedback("Please enter an answer.");
        return;
      }
      const correct = checkAnswer(guess, question);
      setResult(correct);
      setFeedback("");
      if (correct) {
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
      } else {
        setStreak(0);
      }
    },
    [guess, question, checkAnswer]
  );

  // Go to next question
  const nextQuestion = useCallback(() => {
    setQuestion(getNextQuestion(question));
    setGuess("");
    setResult(null);
    setFeedback("");
  }, [getNextQuestion, question]);

  // Skip current question
  const skipQuestion = useCallback(() => {
    setQuestion(getNextQuestion(question));
    setGuess("");
    setResult(null);
    setFeedback("");
    setStreak(0);
  }, [getNextQuestion, question]);

  return {
    question,
    guess,
    setGuess,
    result,
    score,
    streak,
    feedback,
    handleGuess,
    nextQuestion,
    skipQuestion,
    setQuestion,
    setResult,
    setFeedback,
  };
}
