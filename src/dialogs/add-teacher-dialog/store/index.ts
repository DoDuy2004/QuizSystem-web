import { combineReducers } from "@reduxjs/toolkit";
import teacherSlice from "../../../store/slices/teacherSlice";

const reducer = combineReducers({
  teachers: teacherSlice,
});

export default reducer;
