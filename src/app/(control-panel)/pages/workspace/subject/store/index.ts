import { combineReducers } from "@reduxjs/toolkit";
import subjects from "../../../../../../store/slices/subjectSlice";

const reducer = combineReducers({
    subjects
})

export default reducer;