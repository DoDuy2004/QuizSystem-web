import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import StudentService from "../../services/student/StudentService";

export interface StudentStateProps {
  data: any[];
  studentDetail: {};
}

const initialState: StudentStateProps = {
  data: [],
  studentDetail: {},
};

export const getStudents = createAsyncThunk("student/getStudents", async () => {
  const response: any = await StudentService.getStudents();

  const data = response.data;

  return data;
});

export const importStudents = createAsyncThunk(
  "student/import",
  async ({ file }: { file: File }, { rejectWithValue }) => {
    try {
      const response: any = await StudentService.importStudents(file);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addListStudents = createAsyncThunk(
  "student/addListStudents",
  async (params: any) => {
    const form = params?.form;
    const response: any = await StudentService.addListStudents({ form });

    const data = response.data;

    return data;
  }
);

export const studentSlice = createSlice({
  name: "studentSlice",
  initialState,
  reducers: {
    resetStudentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getStudents.fulfilled, (state, action) => {
      // console.log({ data: action.payload.data });
      state.data = action.payload.data;
    });
    builder.addCase(addListStudents.fulfilled, (state, action) => {
      state.data = [
        ...state.data,
        ...action.payload.data.map((item: any) => ({
          ...item,
        })),
      ];
    });
  },
});

export const { resetStudentState } = studentSlice.actions;

export const selectStudents = ({ students }: any) => students?.students?.data;
export const selectStudent = ({ students }: any) =>
  students?.students?.studentDetail;

export default studentSlice.reducer;
