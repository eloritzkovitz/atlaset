import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizAudio } from "./useQuizAudio";

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
  onQuestionAnswered,
}: {
  getNextQuestion: (prevQuestion: TQuestion | null) => TQuestion | null;
  checkAnswer: (guess: string, question: TQuestion) => boolean;
  initialQuestion?: TQuestion | null;
  onQuestionAnswered?: () => void;
}) {
  const [question, setQuestion] = useState<TQuestion | null>(initialQuestion);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  // Audio hooks for feedback sounds
  const { playCorrect, playIncorrect } = useQuizAudio();

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
        playCorrect();
        setScore((s) => s + 1);
        setStreak((s) => {
          const newStreak = s + 1;
          setMaxStreak((max) => Math.max(max, newStreak));
          return newStreak;
        });
      } else {
        playIncorrect();
        setStreak(0);
      }
      if (onQuestionAnswered) onQuestionAnswered();
    },
    [
      guess,
      question,
      checkAnswer,
      onQuestionAnswered,
      playCorrect,
      playIncorrect,
    ]
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

  // Forfeit logic
  const navigate = useNavigate();
  const handleForfeit = () => {
    navigate("/quizzes");
  };
  const wrapTimedForfeit = (endSession: () => void) => () => {
    endSession();
    handleForfeit();
  };

  return {
    question,
    guess,
    setGuess,
    result,
    score,
    streak,
    maxStreak,
    feedback,
    handleGuess,
    nextQuestion,
    skipQuestion,
    setQuestion,
    setResult,
    setFeedback,
    handleForfeit,
    wrapTimedForfeit,
  };
}
