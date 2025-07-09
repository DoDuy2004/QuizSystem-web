import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import QuestionBankService from "../../services/question-bank/QuestionBankService";
import CourseClassService from "../../services/course-class/CourseClassService";
import { create } from "lodash";

export interface QuestionBankStateProps {
  data: any[];
  questionBankDetail: {
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

const initialState: QuestionBankStateProps = {
  data: [],
  questionBankDetail: {
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

export const getQuestionBanks = createAsyncThunk(
  "questionBank/getQuestionBanks",
  async (searchText?: string) => {
    const response: any = await QuestionBankService.getQuestionBanks(searchText);
    return response.data;
  }
);


export const getQuestionBankById = createAsyncThunk(
  "questionBank/getQuestionBankById",
  async (params: any) => {
    const id = params?.id;
    const response: any = await QuestionBankService.getQuestionBankById(id);

    const data = response.data;

    return data;
  }
);

export const getQuestionsByQuestionBank = createAsyncThunk(
  "questionBank/getQuestionsByQuestionBank",
  async (params: any) => {
    const id = params?.id;
    const response: any = await QuestionBankService.getQuestionsByQuestionBank(
      id
    );

    const data = response.data;

    return data;
  }
);

export const getQuestions = createAsyncThunk(
  "questionBank/getQuestions",
  async () => {
    const response: any = await QuestionBankService.getQuestions();

    const data = response.data;

    return data;
  }
);

export const deleteQuestionBank = createAsyncThunk(
  "questionBank/deleteQuestionBank",
  async (params: any) => {
    const id = params?.id;
    const response: any = await QuestionBankService.deleteQuestionBank(id);

    const data = response.data;
    return data;
  }
);

export const addQuestionBank = createAsyncThunk(
  "questionBank/addQuestionBank",
  async (params: any) => {
    const form = params?.form;
    const response: any = await QuestionBankService.addQuestionBank({ form });

    const data = response.data;
    return data;
  }
);

export const editQuestionBank = createAsyncThunk(
  "questionBank/editQuestionBank",
  async (params: any) => {
    const form = params?.form;
    const id = params?.id;
    const response: any = await QuestionBankService.updateQuestionBank({
      id,
      form,
    });

    const data = response.data;
    return data;
  }
);

export const addQuestionToQuestionBank = createAsyncThunk(
  "questionBank/addQuestion",
  async (params: any) => {
    const form = params?.form;
    const response: any = await QuestionBankService.addQuestionToQuestionBank({
      form,
    });

    const data = response.data;

    return data;
  }
);

export const getQuestionById = createAsyncThunk(
  "questionBank/getQuestionById",
  async (id: string) => {
    const response: any = await QuestionBankService.getQuestionById(id);

    const data = response.data;

    return data;
  }
);

export const editQuestion = createAsyncThunk(
  "questionBank/editQuestion",
  async (params: any) => {
    const id = params?.id;
    const form = params?.form;

    const response: any = await QuestionBankService.editQuestion({
      id,
      form,
    });

    const data = response.data;

    return data;
  }
);

export const deleteQuestion = createAsyncThunk(
  "questionBank/deleteQuestion",
  async (id: any) => {
    const response: any = await QuestionBankService.deleteQuestion(id);

    const data = response.data;

    return data;
  }
);

export const importQuestions = createAsyncThunk(
  "questions/import",
  async ({ file }: { file: File }, { rejectWithValue }) => {
    try {
      const response: any = await QuestionBankService.importQuestions(file);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addListQuestions = createAsyncThunk(
  "questionBank/addListQuestions",
  async (params: any) => {
    const form = params?.form;
    const id = params?.id;
    const response: any = await QuestionBankService.addListQuestions({ id, form });

    const data = response.data;

    return data;
  }
);

export const questionBankSlice = createSlice({
  name: "questionBankSlice",
  initialState,
  reducers: {
    resetQuestionBankState: () => initialState,
    setImportStatus: (state, action) => {
      state.importStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getQuestionBanks.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });
      state.data = action.payload.data;
    });
    builder.addCase(getQuestionBankById.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });

      state.questionBankDetail.data = action.payload.data;
    });
    builder.addCase(getQuestionsByQuestionBank.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });

      state.questionBankDetail.questions = action.payload.data;
    });
    builder.addCase(deleteQuestionBank.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const index = state.data.findIndex((item: any) => item.id === id);
      console.log({ index });
      console.log({ id });
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    });
    builder.addCase(deleteQuestion.fulfilled, (state, action) => {
      const { id } = action.meta.arg;
      const index = state.questionBankDetail.questions.findIndex(
        (item: any) => item.id === id
      );
      console.log({ index });
      console.log({ id });
      if (index !== -1) {
        state.questionBankDetail.questions.splice(index, 1);
      }
    });
    builder.addCase(addQuestionBank.fulfilled, (state, action) => {
      console.log({ data: action.payload });
      state.questionBankDetail.data = action.payload.data;
    });
    builder.addCase(editQuestionBank.fulfilled, (state, action) => {
      console.log({ data: action.payload });
      state.questionBankDetail.data = action.payload.data;
    });
    builder.addCase(addQuestionToQuestionBank.fulfilled, (state, action) => {
      // console.log({ data: action.payload });
      state.questionBankDetail.questions = [
        ...state.questionBankDetail.questions,
        action.payload.data,
      ];
    });
    builder.addCase(importQuestions.fulfilled, (state, action) => {
      state.questionBankDetail.questions = [
        ...state.questionBankDetail.questions,
        ...action.payload.data.map((item: any) => ({
          ...item,
        })),
      ];
    });

    builder.addCase(getQuestions.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });

      state.questionBankDetail.questions = action.payload.data;
    });
  },
});

export const selectQuestionBanks = ({ questionBank }: any) =>
  questionBank?.questionBank?.data;
export const selectQuestionBank = ({ questionBank }: any) =>
  questionBank?.questionBank?.questionBankDetail;
export const selectImportStatus = ({ questionBank }: any) =>
  questionBank?.questionBank?.importStatus;

export const { resetQuestionBankState, setImportStatus } =
  questionBankSlice.actions;

export default questionBankSlice.reducer;
