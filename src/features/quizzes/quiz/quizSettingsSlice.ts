import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Difficulty, GameMode, QuizType } from "../types";

interface QuizSettingsState {
  quizType: QuizType;
  difficulty: Difficulty;
  gameMode: GameMode;
}

const initialState: QuizSettingsState = {
  quizType: "flag",
  difficulty: "easy",
  gameMode: "timed",
};

const quizSettingsSlice = createSlice({
  name: "quizSettings",
  initialState,
  reducers: {
    setQuizType(state, action: PayloadAction<QuizType>) {
      state.quizType = action.payload;
    },
    setDifficulty(state, action: PayloadAction<Difficulty>) {
      state.difficulty = action.payload;
    },
    setGameMode(state, action: PayloadAction<GameMode>) {
      state.gameMode = action.payload;
    },
    resetSettings(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setQuizType, setDifficulty, setGameMode, resetSettings } =
  quizSettingsSlice.actions;
export default quizSettingsSlice.reducer;
