import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAudio } from "@contexts/AudioContext";

/**
 * Generic quiz logic hook for reusability across different quiz types.
 * @param getNextQuestion Function to get the next question given the previous one
 * @param checkAnswer Function to check if a given guess is correct for a question
 * @param initialQuestion Optional initial question to start with
 * @param onQuestionAnswered Optional callback when a question is answered
 * @param onMaxStreakChange Optional callback when max streak changes
 */
export function useQuiz<TQuestion>({
  getNextQuestion,
  checkAnswer,
  initialQuestion = null,
  onQuestionAnswered,
  onMaxStreakChange,
  score: externalScore,
  setScore: externalSetScore,
}: {
  getNextQuestion: (prevQuestion: TQuestion | null) => TQuestion | null;
  checkAnswer: (guess: string, question: TQuestion) => boolean;
  initialQuestion?: TQuestion | null;
  onQuestionAnswered?: () => void;
  onMaxStreakChange?: (maxStreak: number) => void;
  score?: number;
  setScore?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [question, setQuestion] = useState<TQuestion | null>(initialQuestion);
  const [usedQuestions, setUsedQuestions] = useState<TQuestion[]>([]);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState<null | boolean>(null);
  const [internalScore, internalSetScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState<string>("");
  const score = externalScore !== undefined ? externalScore : internalScore;
  const setScore =
    externalSetScore !== undefined ? externalSetScore : internalSetScore;

  // Audio hooks for feedback sounds
  const { play } = useAudio();

  // Helper to get the next unique question
  const getNextUniqueQuestion = useCallback(
    (from: TQuestion | null) => {
      let candidate = getNextQuestion(from);
      let attempts = 0;
      const maxAttempts = 100;
      while (
        candidate &&
        usedQuestions.some((q) => q === candidate) &&
        attempts < maxAttempts
      ) {
        candidate = getNextQuestion(candidate);
        attempts++;
      }
      return candidate && !usedQuestions.some((q) => q === candidate)
        ? candidate
        : null;
    },
    [getNextQuestion, usedQuestions]
  );

  // Set the initial question if not set
  useEffect(() => {
    if (question === null) {
      const next = getNextUniqueQuestion(null);
      setQuestion(next);
      if (next !== null && next !== undefined) setUsedQuestions([next]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNextUniqueQuestion]);

  // Handle guess submission
  const handleGuess = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!question || result !== null) return;
      if (!guess.trim()) {
        return;
      }
      const correct = checkAnswer(guess, question);
      setResult(correct);
      setFeedback("");
      if (correct) {
        play("correct");
        setScore((prev) => prev + 1);
        setStreak((s) => {
          const newStreak = s + 1;
          setMaxStreak((max) => Math.max(max, newStreak));
          return newStreak;
        });
      } else {
        play("incorrect");
        setStreak(0);
      }
    },
    [
      guess,
      question,
      result,
      checkAnswer,
      setScore,
      play,
    ]
  );

  // Only call onMaxStreakChange if value actually changed
  const prevMaxStreakRef = useRef(maxStreak);
  useEffect(() => {
    if (onMaxStreakChange && maxStreak !== prevMaxStreakRef.current) {
      onMaxStreakChange(maxStreak);
      prevMaxStreakRef.current = maxStreak;
    }
  }, [maxStreak, onMaxStreakChange]);

  // Go to next question
  const nextQuestion = useCallback(() => {
    const candidate = getNextUniqueQuestion(question);
    if (candidate) {
      setUsedQuestions((prev) => [...prev, candidate]);
      setQuestion(candidate);
    } else {
      setQuestion(null);
    }
    setGuess("");
    setResult(null);
    setFeedback("");
    if (onQuestionAnswered) onQuestionAnswered();
  }, [getNextUniqueQuestion, question, onQuestionAnswered]);

  // Skip current question
  const skipQuestion = useCallback(() => {
    const candidate = getNextUniqueQuestion(question);
    if (candidate) {
      setUsedQuestions((prev) => [...prev, candidate]);
      setQuestion(candidate);
    } else {
      setQuestion(null);
    }
    setGuess("");
    setResult(null);
    setFeedback("");
    setStreak(0);
    if (onQuestionAnswered) onQuestionAnswered();
  }, [getNextUniqueQuestion, question, onQuestionAnswered]);

  // Forfeit logic
  const navigate = useNavigate();
  const handleForfeit = (endSession?: () => void) => {
    if (endSession) endSession();
    navigate("/quizzes");
  };

  return {
    question,
    guess,
    setGuess,
    result,
    score,
    setScore,
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
    usedQuestions,
  };
}
