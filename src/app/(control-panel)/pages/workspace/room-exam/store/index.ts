import { combineReducers } from "@reduxjs/toolkit";
import roomExamSlice from "../../../../../../store/slices/roomExamSlice";

const reducer = combineReducers({
    roomExams: roomExamSlice
})

export default reducer;