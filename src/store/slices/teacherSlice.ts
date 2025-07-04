import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TeacherService from "../../services/teacher/TeacherService";

export interface TeacherStateProps {
  data: any[];
  teacherDetail: {};
}

const initialState: TeacherStateProps = {
  data: [],
  teacherDetail: {},
};

export const getTeachers = createAsyncThunk("teacher/getTeachers", async () => {
  const response: any = await TeacherService.getTeachers();

  const data = response.data;

  return data;
});

// export const importStudents = createAsyncThunk(
//   "student/import",
//   async ({ file }: { file: File }, { rejectWithValue }) => {
//     try {
//       const response: any = await StudentService.importStudents(file);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const addListStudents = createAsyncThunk(
//   "student/addListStudents",
//   async (params: any) => {
//     const form = params?.form;
//     const response: any = await StudentService.addListStudents({ form });

//     const data = response.data;

//     return data;
//   }
// );

export const teacherSlice = createSlice({
  name: "teacherSlice",
  initialState,
  reducers: {
    // resetSubjectState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getTeachers.fulfilled, (state, action) => {
      // console.log({ data: action.payload.data });
      state.data = action.payload;
    });
    // builder.addCase(addListStudents.fulfilled, (state, action) => {
    //   state.data = [
    //     ...state.data,
    //     ...action.payload.data.map((item: any) => ({
    //       ...item,
    //     })),
    //   ];
    // });
  },
});

// export const { resetSubjectState } = subjectSlice.actions;

export const selectTeachers = ({ teachers }: any) => teachers?.teachers?.data;
export const selectTeacher = ({ teachers }: any) =>
  teachers?.teachers?.studentDetail;

export default teacherSlice.reducer;
