import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RoomExamService from "../../services/room-exam/RoomExamService";

export interface ExamStateProps {
  data: [];
  roomExamDetail: {
    data: {};
    questions: any[];
  };
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
  roomExamDetail: {
    data: {},
    questions: [],
  },
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

export const getRoomExams = createAsyncThunk("exam/getExams", async () => {
  const response: any = await RoomExamService.getRoomExams();

  const data = response.data;

  return data;
});

export const getRoomExambyId = createAsyncThunk(
  "exam/getExambyId",
  async (params: any) => {
    const id = params?.id;
    const response: any = await RoomExamService.getRoomExambyId(id);

    const data = response.data;

    return data;
  }
);

export const examSlice = createSlice({
  name: "questionBankSlice",
  initialState,
  reducers: {
    resetExamState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getRoomExams.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });
      state.data = action.payload.data;
    });
    builder.addCase(getRoomExambyId.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });

      state.roomExamDetail.data = action.payload.data;
    });
  },
});

export const selectRoomExams = ({ roomExams }: any) =>
  roomExams?.roomExams?.data;
export const selectRoomExam = ({ roomExams }: any) =>
  roomExams?.roomExams?.roomExamDetail;

export const { resetExamState } = examSlice.actions;

export default examSlice.reducer;
