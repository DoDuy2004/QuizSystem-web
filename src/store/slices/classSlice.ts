import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CourseClassService from "../../services/course-class/CourseClassService";

export interface QuestionBankStateProps {
  data: any[];
  classDetail: {
    data: {};
    students: [];
  };
}

const initialState: QuestionBankStateProps = {
  data: [],
  classDetail: {
    data: {},
    students: [],
  },
};

export const getClasses = createAsyncThunk(
  "class/getClasses",
  async () => {
    const response: any = await CourseClassService.getClasses();

    const data = response.data;

    return data;
  }
);

export const getClassById = createAsyncThunk(
  "class/getClassById",
  async (id: any) => {
    const response: any = await CourseClassService.getClassById(id);

    const data = response.data;

    return data;
  }
);

export const deleteClass = createAsyncThunk(
  "class/deleteClass",
  async (params: any) => {
    const id = params?.id;
    const response: any = await CourseClassService.deleteClass(id);

    const data = response.data;
    return data;
  }
);

export const addClass = createAsyncThunk(
  "class/addClass",
  async (params: any) => {
    const form = params?.form;
    const response: any = await CourseClassService.addClass({ form });

    const data = response.data;
    return data;
  }
);

export const editClass = createAsyncThunk(
  "class/editClass",
  async (params: any) => {
    const form = params?.form;
    const id = params?.id;
    const response: any = await CourseClassService.updateClass({
      id,
      form,
    });

    const data = response.data;
    return data;
  }
);

export const addStudentToClass = createAsyncThunk(
  "class/addStudent",
  async (params: any) => {
    const form = params?.form;
    const response: any = await CourseClassService.addStudentToClass({
      form,
    });

    const data = response.data;

    return data;
  }
);

export const getStudentsByClass = createAsyncThunk(
  "class/getStudents",
  async (id: string) => {
    const response: any = await CourseClassService.getStudentsByClass(id);

    const data = response.data;

    return data;
  }
);

export const classSlice = createSlice({
  name: "classSlice",
  initialState,
  reducers: {
    resetClassState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getClasses.fulfilled, (state, action) => {
      console.log({ data: action.payload });
      state.data = action.payload.data;
    });
    builder.addCase(getClassById.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });
      state.classDetail.data = action.payload.data;
    });
    builder.addCase(getStudentsByClass.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });

      state.classDetail.students = action.payload.data;
    });
    builder.addCase(deleteClass.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const index = state.data.findIndex((item: any) => item.id === id);
      console.log({ index });
      console.log({ id });
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    });
    builder.addCase(addClass.fulfilled, (state, action) => {
      console.log({ data: action.payload });
      state.classDetail.data = action.payload.data;
      state.data = [...(state.data || []), action.payload.data];
    });
    builder.addCase(editClass.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });
      const { id } = action.meta.arg;
      const index = state.data.findIndex((item: any) => item.id === id);
      state.data[index] = action.payload.data;
      state.classDetail.data = action.payload.data;
    });
  },
});

export const selectClasses = ({ courseClass }: any) =>
  courseClass?.courseClass?.data;
export const selectClass = ({ courseClass }: any) =>
  courseClass?.courseClass?.classDetail;

export const { resetClassState } = classSlice.actions;

export default classSlice.reducer;
