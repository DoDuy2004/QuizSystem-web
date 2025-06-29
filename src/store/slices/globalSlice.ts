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
  },
});

export const {
  openAddClassDialog,
  closeAddClassDialog,
  openAddMultiQuestionsDialog,
  closeAddMultiQuestionsDialog,
} = globalSlice.actions;

export const selectAddClassDialog = ({ globalSlice }: any) =>
  globalSlice.addClassDialog;
export const selectAddMultiQuestionsDialog = ({ globalSlice }: any) =>
  globalSlice.addMultiQuestionsDialog;

export default globalSlice.reducer;
