import { combineReducers } from "@reduxjs/toolkit";
import studentSlice from "../../../store/slices/studentSlice"

const reducer = combineReducers({
  students: studentSlice,
});

export default reducer;