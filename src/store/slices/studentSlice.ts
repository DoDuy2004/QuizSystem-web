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

export const searchStudents = createAsyncThunk(
  "student/searchStudents",
  async (params: any) => {
    const response: any = await StudentService.searchStudents({
      key: params?.key,
      limit: params?.limit,
    });

    const data = response.data;

    return data;
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

export const getStudent = createAsyncThunk(
  "student/getStudent",
  async (id: string) => {
    const response: any = await StudentService.getStudent(id);

    const data = response.data;

    return data;
  }
);

export const addStudent = createAsyncThunk(
  "student/addStudent",
  async (params: any) => {
    const form = params?.form;
    const response: any = await StudentService.createStudent({ form });

    const data = response.data;

    return data;
  }
);

export const updateStudent = createAsyncThunk(
  "student/updateStudent",
  async (params: any) => {
    const id = params?.id;
    const form = params?.form;
    const response: any = await StudentService.updateStudent({ id, form });

    const data = response.data;

    return data;
  }
);

export const submitExam = createAsyncThunk(
  "student/submitExam",
  async (params: any) => {
    const form = params?.form;
    const response: any = await StudentService.submitExam({ form });

    const data = response.data;

    return data;
  }
);

export const isSubmitted = createAsyncThunk(
  "student/submitExam",
  async (params: any) => {
    const roomId = params?.roomId;
    const studentId = params?.studentId;
    const response: any = await StudentService.checkIfSubmitted({
      roomId,
      studentId,
    });

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

    builder.addCase(getStudent.fulfilled, (state, action) => {
      state.studentDetail = action.payload.data;
    });

    builder.addCase(addStudent.fulfilled, (state, action) => {
      console.log({ data: action.payload.data });
      state.data = [...state.data, action.payload.data];
    });
    builder.addCase(updateStudent.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const index = state.data.findIndex((item: any) => item.id === id);
      state.data[index] = action.payload.data;
      state.studentDetail = action.payload.data;
    });
  },
});

export const { resetStudentState } = studentSlice.actions;

export const selectStudents = ({ students }: any) => students?.students?.data;
export const selectStudent = ({ students }: any) =>
  students?.students?.studentDetail;

export default studentSlice.reducer;
