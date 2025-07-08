import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SubjectService from "../../services/subject/SubjectService";

export interface SubjectStateProps {
  data: any[];
  subjectDetail: {
    data: {};
    chapters: any[];
  };
}

const initialState: SubjectStateProps = {
  data: [],
  subjectDetail: {
    data: {},
    chapters: [],
  },
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

export const createSubject = createAsyncThunk(
  "subject/createSubject",
  async (params: any) => {
    const form = params?.form;
    const response: any = await SubjectService.createSubject({ form });

    const data = response.data;

    return data;
  }
);

export const updateSubject = createAsyncThunk(
  "subject/updateSubject",
  async (params: any) => {
    const form = params?.form;
    const id = params?.id;
    const response: any = await SubjectService.updateSubject({ id, form });

    const data = response.data;

    return data;
  }
);

export const addChapter = createAsyncThunk(
  "subject/addChapter",
  async (params: any) => {
    const form = params?.form;
    const id = params?.id;
    const response: any = await SubjectService.addChapter({ id, form });

    const data = response.data;

    return data;
  }
);

export const updateChapter = createAsyncThunk(
  "subject/updateChapter",
  async (params: any) => {
    const form = params?.form;
    const id = params?.id;
    const response: any = await SubjectService.updateChapter({ id, form });

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
    builder.addCase(createSubject.fulfilled, (state, action) => {
      console.log({ data: action.payload.data });
      state.data = [...state.data, action.payload.data];
    });
    builder.addCase(updateSubject.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const index = state.data.findIndex((item: any) => item.id === id);
      state.data[index] = action.payload.data;
      state.subjectDetail = action.payload.data;
    });
    builder.addCase(addChapter.fulfilled, (state, action) => {
      state.subjectDetail.chapters = [
        ...state.subjectDetail.chapters,
        action.payload,
      ];
    });
    builder.addCase(updateChapter.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const index = state.subjectDetail.chapters.findIndex(
        (item: any) => item.id === id
      );
      state.subjectDetail.chapters[index] = action.payload;
      // state.subjectDetail = action.payload.data;
    });
  },
});

export const { resetSubjectState } = subjectSlice.actions;

export const selectSubjects = ({ subjects }: any) => subjects?.subjects?.data;
export const selectSubject = ({ subjects }: any) =>
  subjects?.subjects?.subjectDetail;

export default subjectSlice.reducer;
