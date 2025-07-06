import { combineReducers } from "@reduxjs/toolkit";
import classSlice from "../../../store/slices/classSlice";

const reducer = combineReducers({
  courseClass: classSlice,
});

export default reducer;
