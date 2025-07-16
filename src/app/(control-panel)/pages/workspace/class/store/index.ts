import { combineReducers } from "@reduxjs/toolkit";
import classSlice from "../../../../../../store/slices/classSlice";
import notificationSlice from "../../../../../../store/slices/notificationSlice";

const reducer = combineReducers({
  courseClass: classSlice,
  notification: notificationSlice,
});

export default reducer;
