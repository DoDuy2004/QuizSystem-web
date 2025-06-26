import { createSlice, type PayloadAction, createEntityAdapter } from '@reduxjs/toolkit';

// Define types
export interface ConfirmationDialogState {
  props: {
    open: boolean;
  };
  data: {
    onAgree: () => void;
    dialogContent: string;
    titleContent: string;
    agreeText: string;
    disagreeText: string;
    onDisagree: () => void;
  } | null;
}

export interface DialogPayload {
  data: {
    onAgree: () => void;
    dialogContent: string;
    titleContent: string;
    agreeText: string;
    disagreeText: string;
    onDisagree: () => void;
  };
}

const dialogAdapter = createEntityAdapter<any>();

const confirmationDialogSlice = createSlice({
  name: 'dialog/confirmation',
  initialState: dialogAdapter.getInitialState<any>({
    props: {
      open: false,
    },
    data: {
      onAgree: null,
      dialogContent: 'Are you sure?',
      titleContent: 'Confirm',
      agreeText: 'Agree',
      disagreeText: 'Cancel',
      onDisagree: null,
    },
  }),
  reducers: {
    setData: (state, action: PayloadAction<DialogPayload>) => {
      state.data = action.payload.data;
    },
    openConfirmationDialog: (state, action: PayloadAction<DialogPayload>) => {
      state.props = {
        open: true,
      };
      state.data = action.payload.data;
    },
    closeConfirmationDialog: (state) => {
      state.props = {
        open: false,
      };
      state.data = null;
    },
  },
});

export const {
  setData,
  openConfirmationDialog,
  closeConfirmationDialog,
} = confirmationDialogSlice.actions;

export default confirmationDialogSlice.reducer;
