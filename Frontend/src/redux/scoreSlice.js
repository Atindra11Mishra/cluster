import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  totalScore: 0,
  title: "",
};

const scoreSlice = createSlice({
  name: "score",
  initialState: {
    totalScore: 0,
    title: "",
  },
  reducers: {
    setScore: (state, action) => {
      state.totalScore += action.payload.score; // ✅ Add new score instead of replacing
      state.title = action.payload.title; // ✅ Keep title updating normally
    },
    resetScore: (state) => {
      state.totalScore = 0;
      state.title = "";
    },
  },
});


export const { setScore, resetScore } = scoreSlice.actions;
export default scoreSlice.reducer;
