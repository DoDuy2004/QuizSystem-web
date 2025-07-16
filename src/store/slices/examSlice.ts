import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CourseClassService from "../../services/course-class/CourseClassService";
import ExamService from "../../services/exam/ExamService";

export interface ExamStateProps {
  data: any[];
  examDetail: {
    data: {};
    questions: any[];
  };
  importStatus: string;
  totalElements: number;
  totalPages: number;
  pagination: {
    page: number;
    size: number;
    sortBy: string;
    direction: string;
  };
  isFilterOpen: boolean;
  filter: {
    status: [];
    subject: string;
  };
}

const initialState: ExamStateProps = {
  data: [],
  examDetail: {
    data: {},
    questions: [],
  },
  importStatus: "",
  totalElements: 0,
  totalPages: 0,
  pagination: {
    page: 0,
    size: 10,
    sortBy: "createdDate",
    direction: "DESC",
  },
  isFilterOpen: false,
  filter: {
    status: [],
    subject: "",
  },
};

export const getExams = createAsyncThunk(
  "exam/getExams",
  async (searchText?: string) => {
    const response: any = await ExamService.getExams(searchText);
    return response.data;
  }
);

export const getExambyId = createAsyncThunk(
  "exam/getExambyId",
  async (params: any) => {
    const id = params?.id;
    const response: any = await ExamService.getExambyId(id);

    const data = response.data;

    return data;
  }
);

export const deleteExam = createAsyncThunk(
  "exam/deleteExam",
  async (params: any) => {
    const id = params?.id;
    const response: any = await ExamService.deleteExam(id);

    const data = response.data;
    return data;
  }
);

export const addExam = createAsyncThunk("exam/addExam", async (params: any) => {
  const form = params?.form;
  const response: any = await ExamService.addExam({ form });

  const data = response.data;
  return data;
});

export const editExam = createAsyncThunk(
  "exam/editExam",
  async (params: any) => {
    const form = params?.form;
    const id = params?.id;
    const response: any = await ExamService.updateExam({
      id,
      form,
    });

    const data = response.data;
    return data;
  }
);

export const getQuestionsByExam = createAsyncThunk(
  "exam/getQuestionByExam",
  async (id: string) => {
    const response: any = await ExamService.getQuestionByExam(id);

    const data = response.data;

    return data;
  }
);

export const addQuestionToExam = createAsyncThunk(
  "exam/addQuestionToExam",
  async (params: any) => {
    const form = params?.form;
    const id = params?.id;
    const response: any = await ExamService.addQuestionToExam({
      id,
      form,
    });

    const data = response.data;

    return data;
  }
);

export const deleteQuestionFromExam = createAsyncThunk(
  "exam/deleteQuestionFromExam",
  async (params: any) => {
    const examId = params?.examId;
    const questionId = params?.questionId;
    const response: any = await ExamService.deleteQuestionFromExam({
      examId,
      questionId,
    });

    const data = response.data;

    return data;
  }
);

// Ví dụ định nghĩa createMatrix (nếu dùng createAsyncThunk)

export const createMatrix = createAsyncThunk(
  "exam/createMatrix",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await ExamService.createExamMatrix(params);
      return response;
    } catch (error: any) {
      // Truyền nguyên error data vào rejectWithValue
      return rejectWithValue({
        status: error.status || 500,
        ...error.data,
      });
    }
  }
);

export const searchExams = createAsyncThunk(
  "student/searchClasses",
  async (params: any) => {
    const response: any = await ExamService.searchExams({
      key: params?.key,
      limit: params?.limit,
    });

    const data = response.data;

    return data;
  }
);

export const examSlice = createSlice({
  name: "examSlice",
  initialState,
  reducers: {
    resetExamState: () => initialState,
    setImportStatus: (state, action) => {
      state.importStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getExams.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });
      state.data = action.payload.data;
    });
    builder.addCase(getExambyId.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });

      state.examDetail.data = action.payload.data;
    });
    builder.addCase(deleteExam.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const index = state.data.findIndex((item: any) => item.id === id);
      console.log({ index });
      console.log({ id });
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    });
    builder.addCase(addExam.fulfilled, (state, action) => {
      console.log({ data: action.payload.data });
      state.examDetail.data = action.payload.data;
      state.data = [...state.data, action.payload.data];
    });
    builder.addCase(editExam.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });
      state.examDetail.data = action.payload.data;
    });
    builder.addCase(getQuestionsByExam.fulfilled, (state, action) => {
      state.examDetail.questions = action.payload.data;
    });
    builder.addCase(addQuestionToExam.fulfilled, (state, action) => {
      console.log({ data: action.payload });
      state.examDetail.questions = [
        ...state.examDetail.questions,
        action.payload.data,
      ];
    });

    builder.addCase(deleteQuestionFromExam.fulfilled, (state, action) => {
      const { questionId } = action.meta.arg;
      console.log({ questionId });
      const index = state.examDetail.questions.findIndex(
        (item: any) => item.id === questionId
      );
      console.log({ index });
      console.log({ questionId });
      if (index !== -1) {
        state.examDetail.questions.splice(index, 1);
      }
    });
  },
});

export const selectExams = ({ exams }: any) => exams?.exams?.data;
export const selectExam = ({ exams }: any) => exams?.exams?.examDetail;
export const selectExamDetail = (state: any) => state.exams?.examDetail || {};
export const selectImportStatus = ({ exams }: any) =>
  exams?.exams?.importStatus;

export const { resetExamState, setImportStatus } = examSlice.actions;

export default examSlice.reducer;
