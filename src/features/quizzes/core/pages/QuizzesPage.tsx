import { Routes, Route } from "react-router-dom";
import { QuizLobby } from "../../lobby/components/QuizLobby";
import { Leaderboards } from "../../leaderboards/components/Leaderboards";
import { QuizEntry } from "../../quiz/components/QuizEntry";

export default function QuizzesPage() {
  return (
    <Routes>
      <Route index element={<QuizLobby />} />
      <Route path="guess-the-flag" element={<QuizEntry />} />
      <Route path="guess-the-capital" element={<QuizEntry />} />
      <Route path="leaderboards" element={<Leaderboards />} />
    </Routes>
  );
}
