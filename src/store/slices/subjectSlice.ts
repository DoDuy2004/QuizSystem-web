import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SubjectService from "../../services/subject/SubjectService";

export interface SubjectStateProps {
  data: any[];
  subjectDetail: {};
}

const initialState: SubjectStateProps = {
  data: [],
  subjectDetail: {},
};

export const getChapters = createAsyncThunk(
  "subject/getChapters",
  async (id: string) => {
    const response: any = await SubjectService.getChapters(id);

    const data = response.data;

    return data;
  }
);

export const getSubjects = createAsyncThunk("subject/getSubjects", async () => {
  const response: any = await SubjectService.getSubjects();

  const data = response.data;

  return data;
});

export const getSubjectById = createAsyncThunk(
  "subject/getSubjectById",
  async (id: string) => {
    const response: any = await SubjectService.getSubjectById(id);

    const data = response.data;

    return data;
  }
);

export const subjectSlice = createSlice({
  name: "subjectSlice",
  initialState,
  reducers: {
    resetSubjectState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getSubjects.fulfilled, (state, action) => {
      // console.log({ data: action.payload });
      state.data = action.payload.data;
    });
    builder.addCase(getSubjectById.fulfilled, (state, action) => {
      state.subjectDetail = action.payload.data;
    });
  },
});

export const { resetSubjectState } = subjectSlice.actions;

export const selectSubjects = ({ subjects }: any) => subjects?.subjects?.data;
export const selectSubject = ({ subjects }: any) =>
  subjects?.subjects?.subjectDetail;

export default subjectSlice.reducer;
