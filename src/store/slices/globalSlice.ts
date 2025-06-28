import { createSelector, createSlice } from "@reduxjs/toolkit";

export interface GlobalSliceState {
  data: [];
  addClassDialog: {
    isOpen: boolean;
    type: "new" | "edit";
  };
}

const initialState: GlobalSliceState = {
  data: [],
  addClassDialog: {
    isOpen: false,
    type: "new",
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
  },
});

export const { openAddClassDialog, closeAddClassDialog } = globalSlice.actions;

export const selectAddClassDialog = ({ globalSlice }: any) =>
  globalSlice.addClassDialog;

export default globalSlice.reducer;
