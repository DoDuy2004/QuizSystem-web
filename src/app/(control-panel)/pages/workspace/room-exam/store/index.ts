import { combineReducers } from "@reduxjs/toolkit";
import roomExamSlice from "../../../../../../store/slices/roomExamSlice";
import examSlice from "../../../../../../store/slices/examSlice";

const reducer = combineReducers({
  roomExams: roomExamSlice,
  exams: examSlice,
});

export default reducer;
