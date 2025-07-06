import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface GlobalSliceState {
  data: [];
  addClassDialog: {
    isOpen: boolean;
    type: "new" | "edit";
  };
  addMultiQuestionsDialog: {
    isOpen: boolean;
  };
  addQuestionToExamDialog: {
    isOpen: boolean;
  };
  addSubjectDialog: {
    isOpen: boolean;
  };
  addStudentsDialog: {
    isOpen: boolean;
  };
  addRoomExamDialog: {
    isOpen: boolean;
  };
  addStudentsToClassDialog: {
    isOpen: boolean;
  };
}

const initialState: GlobalSliceState = {
  data: [],
  addClassDialog: {
    isOpen: false,
    type: "new",
  },
  addMultiQuestionsDialog: {
    isOpen: false,
  },
  addQuestionToExamDialog: {
    isOpen: false,
  },
  addSubjectDialog: {
    isOpen: false,
  },
  addStudentsDialog: {
    isOpen: false,
  },
  addRoomExamDialog: {
    isOpen: false,
  },
  addStudentsToClassDialog: {
    isOpen: false,
  },
};

const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    //class
    openAddClassDialog: (state, action) => {
      state.addClassDialog.isOpen = true;
      state.addClassDialog.type = action.payload;
      // console.log("type:", state.couponDetail.type);
    },

    closeAddClassDialog: (state) => {
      state.addClassDialog.isOpen = false;
    },

    // question
    openAddMultiQuestionsDialog: (state) => {
      state.addMultiQuestionsDialog.isOpen = true;
    },
    closeAddMultiQuestionsDialog: (state) => {
      state.addMultiQuestionsDialog.isOpen = false;
    },

    // exam
    openAddQuestionToExamDialog: (state) => {
      state.addQuestionToExamDialog.isOpen = true;
    },
    closeAddQuestionToExamDialog: (state) => {
      state.addQuestionToExamDialog.isOpen = false;
    },

    //subject
    openAddSubjectDialog: (state) => {
      state.addSubjectDialog.isOpen = true;
    },
    closeAddSubjectDialog: (state) => {
      state.addSubjectDialog.isOpen = false;
    },

    //student
    openAddStudentsDialog: (state) => {
      state.addStudentsDialog.isOpen = true;
    },
    closeAddStudentsDialog: (state) => {
      state.addStudentsDialog.isOpen = false;
    },

    //room exam
    openAddRoomExamDialog: (state) => {
      state.addRoomExamDialog.isOpen = true;
    },
    closeAddRoomExamDialog: (state) => {
      state.addRoomExamDialog.isOpen = false;
    },

    // add students to class
    openAddStudentsToClassDialog: (state) => {
      state.addStudentsToClassDialog.isOpen = true;
    },
    closeAddStudentsToClassDialog: (state) => {
      state.addStudentsToClassDialog.isOpen = false;
    },
  },
});

export const {
  openAddClassDialog,
  closeAddClassDialog,
  openAddMultiQuestionsDialog,
  closeAddMultiQuestionsDialog,
  openAddQuestionToExamDialog,
  closeAddQuestionToExamDialog,
  openAddSubjectDialog,
  closeAddSubjectDialog,
  openAddStudentsDialog,
  closeAddStudentsDialog,
  openAddRoomExamDialog,
  closeAddRoomExamDialog,
  openAddStudentsToClassDialog,
  closeAddStudentsToClassDialog,
} = globalSlice.actions;

export const selectAddClassDialog = ({ globalSlice }: any) =>
  globalSlice.addClassDialog;
export const selectAddMultiQuestionsDialog = ({ globalSlice }: any) =>
  globalSlice.addMultiQuestionsDialog;
export const selectAddQuestionToExamDialog = ({ globalSlice }: any) =>
  globalSlice.addQuestionToExamDialog;

export const selectAddSubjectDialog = ({ globalSlice }: any) =>
  globalSlice.addSubjectDialog;

export const selectAddStudentsDialog = ({ globalSlice }: any) =>
  globalSlice.addStudentsDialog;

export const selectAddRoomExamDialog = ({ globalSlice }: any) =>
  globalSlice.addRoomExamDialog;

export const selectAddStudentsToClassDialog = ({ globalSlice }: any) =>
  globalSlice.addStudentsToClassDialog;

export default globalSlice.reducer;
