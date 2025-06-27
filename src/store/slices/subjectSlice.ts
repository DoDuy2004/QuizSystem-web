import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SubjectService from "../../services/subjectd/SubjectService";

export interface SubjectStateProps {
  data: [];
}

const initialState: SubjectStateProps = {
  data: [],
};

export const getChapters = createAsyncThunk("subject/getChapters", async () => {
  const response: any = await SubjectService.getChapters();

  const data = response.data;

  return data;
});

export const subjectSlice = createSlice({
  name: "subjectSlice",
  initialState,
  reducers: {
    resetSubjectState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getChapters.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });
      state.data = action.payload.data;
    });
  },
});

export const { resetSubjectState } = subjectSlice.actions;

export default subjectSlice.reducer;
