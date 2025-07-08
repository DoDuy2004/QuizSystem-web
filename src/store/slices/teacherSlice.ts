import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TeacherService from "../../services/teacher/TeacherService";
import userService from "../../services/user/UserService";

export interface TeacherStateProps {
  data: any[];
  teacherDetail: {};
}

const initialState: TeacherStateProps = {
  data: [],
  teacherDetail: {},
};

export const getTeachers = createAsyncThunk(
  "teacher/getTeachers", 
  async (searchText?: string) => {
    const response: any = await TeacherService.getTeachers(searchText);
    return response.data;
  }
);

export const getTeacher = createAsyncThunk(
  "teacher/getTeacher",
  async (id: string) => {
    const response: any = await TeacherService.getTeacher(id);

    const data = response.data;

    return data;
  }
);

export const addTeacher = createAsyncThunk(
  "teacher/addTeacher",
  async (params: any) => {
    const form = params?.form;
    const response: any = await TeacherService.createTeacher({ form });

    const data = response.data;

    return data;
  }
);

export const updateTeacher = createAsyncThunk(
  "teacher/updateTeacher",
  async (params: any) => {
    const id = params?.id;
    const form = params?.form;
    const response: any = await TeacherService.updateTeacher({ id, form });

    const data = response.data;

    return data;
  }
);

export const importTeachers = createAsyncThunk(
  "student/import",
  async ({ file }: { file: File }, { rejectWithValue }) => {
    try {
      const response: any = await TeacherService.importTeachers(file);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addListTeachers = createAsyncThunk(
  "student/addListStudents",
  async (params: any) => {
    const form = params?.form;
    const response: any = await TeacherService.addListTeachers({ form });

    const data = response.data;

    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: any) => {
    const response: any = await userService.deleteUser(id);

    const data = response.data;

    return data;
  }
);

export const teacherSlice = createSlice({
  name: "teacherSlice",
  initialState,
  reducers: {
    // resetSubjectState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getTeachers.fulfilled, (state, action) => {
      // console.log({ data: action.payload.data });
      state.data = action.payload.data;
    });
    builder.addCase(addListTeachers.fulfilled, (state, action) => {
      state.data = [
        ...state.data,
        ...action.payload.data.map((item: any) => ({
          ...item,
        })),
      ];
    });
    builder.addCase(getTeacher.fulfilled, (state, action) => {
      state.teacherDetail = action.payload.data;
    });

    builder.addCase(addTeacher.fulfilled, (state, action) => {
      console.log({ data: action.payload.data });
      state.data = [...state.data, action.payload];
    });
    builder.addCase(updateTeacher.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const index = state.data.findIndex((item: any) => item.id === id);
      state.data[index] = action.payload.data;
      state.teacherDetail = action.payload.data;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const id = action.meta.arg;
      const index = state.data.findIndex((item: any) => item.id === id);
      state.data[index] = { ...state.data[index], status: "DELETED" };
      // state.teacherDetail = action.payload.data;
    });
  },
});

// export const { resetSubjectState } = subjectSlice.actions;

export const selectTeachers = ({ teachers }: any) => teachers?.teachers?.data;
export const selectTeacher = ({ teachers }: any) =>
  teachers?.teachers?.teacherDetail;

export default teacherSlice.reducer;
