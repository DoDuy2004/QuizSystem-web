import { combineReducers } from "@reduxjs/toolkit";
import examSlice from "../../../../../../store/slices/examSlice";

const reducer = combineReducers({
  exams: examSlice,
});

export default reducer;
