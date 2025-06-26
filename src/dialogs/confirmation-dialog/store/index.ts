import { combineReducers } from "@reduxjs/toolkit";
import confirmationDialog from "../../../store/slices/confirmationSlice";

const reducer = combineReducers({
  confirmationDialog,
});

export default reducer;
