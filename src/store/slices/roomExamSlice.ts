import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import RoomExamService from "../../services/room-exam/RoomExamService";

export interface ExamStateProps {
  data: any[];
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

// export const getRoomExams = createAsyncThunk(
//   "roomExam/getRoomExams",
//   async () => {
//     const response: any = await RoomExamService.getRoomExams();

//     const data = response.data;

//     return data;
//   }
// );

export const getRoomExams = createAsyncThunk(
  "roomExam/getRoomExams",
  async (searchText?: string) => {
    const response: any = await RoomExamService.getRoomExams(searchText);
    return response.data;
  }
);

export const getRoomExambyId = createAsyncThunk(
  "roomExam/getRoomExambyId",
  async (params: any) => {
    const id = params?.id;
    const response: any = await RoomExamService.getRoomExambyId(id);

    const data = response.data;

    return data;
  }
);

export const createRoomExam = createAsyncThunk(
  "roomExam/createRoomExam",
  async (params: any) => {
    const form = params?.form;

    const response: any = await RoomExamService.createRoomExam({ form });

    const data = response.data;

    return data;
  }
);

// export const getRoomExamsByStudent = createAsyncThunk(
//   "student/getRoomExams",
//   async (id: string) => {
//     const response: any = await RoomExamService.getRoomExamsByStudent(id);

//     const data = response.data;

//     return data;
//   }
// );

export const getRoomExamsByStudent = createAsyncThunk(
  "student/getRoomExams",
  async ({ id, search }: { id: string; search?: string }) => {
    const response: any = await RoomExamService.getRoomExamsByStudent(
      id,
      search
    );
    return response.data;
  }
);

export const getRoomExamResults = createAsyncThunk(
  "student/getRoomExamResults",
  async (searchText: string = "") => {
    const response: any = await RoomExamService.getRoomExamResults(searchText);
    return response.data;
  }
);

export const getStudentExamsByRoom = createAsyncThunk(
  "student/getRoomExamResults",
  async (id: string) => {
    const response: any = await RoomExamService.getStudentExamsByRoom(id);

    const data = response.data;

    return data;
  }
);

export const getStudentExamDetail = createAsyncThunk(
  "student/getStudentExamDetail",
  async (params: any) => {
    const response: any = await RoomExamService.getStudentExamDetail(params);

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
    builder.addCase(getRoomExamsByStudent.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });
      state.data = action.payload.data;
    });
    builder.addCase(getRoomExambyId.fulfilled, (state, action) => {
      //   console.log({ data: action.payload });

      state.roomExamDetail.data = action.payload.data;
    });
    builder.addCase(createRoomExam.fulfilled, (state, action) => {
      console.log({ action: action.payload });
      state.data = [...state.data, action.payload];
    });
  },
});

export const selectRoomExams = ({ roomExams }: any) =>
  roomExams?.roomExams?.data;
export const selectRoomExam = ({ roomExams }: any) =>
  roomExams?.roomExams?.roomExamDetail;

export const { resetExamState } = examSlice.actions;

export default examSlice.reducer;
