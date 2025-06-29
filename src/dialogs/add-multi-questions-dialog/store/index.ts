import { combineReducers } from "@reduxjs/toolkit";
import questionBank from "../../../store/slices/questionBankSlice";

const reducer = combineReducers({
  questionBank
});

export default reducer;
