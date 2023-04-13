import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store';
import { StatusWindow } from '@/src/types';

export interface GlobalState {
  loading: boolean;
  snackbarStatus: StatusWindow;
  dialogStatus: StatusWindow;
}

const initialState: GlobalState = {
    loading: false,
    snackbarStatus: {
        isOpen: false,
        status: 'info',
        title: '',
        message: '',
    },
    dialogStatus: {
        isOpen: false,
        status: 'info',
        title: '',
        message: '',
    },
}

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    endLoading: (state) => {
      state.loading = false;
    },
    openSnackbar: (state, action: PayloadAction<{ status: 'success' | 'info' | 'warning' | 'error' | undefined; message?: string, direction?: string }>) => {
        state.snackbarStatus.isOpen = true;
        state.snackbarStatus.status = action.payload?.status;
        state.snackbarStatus.message = action.payload?.message ?? '';
    },
    closeSnackbar: (state) => {
        state.snackbarStatus.isOpen = false;
        //state.snackbarStatus = initialState.snackbarStatus;
    },
    openDialog: (state, action: PayloadAction<{ status: 'success' | 'info' | 'warning' | 'error' | undefined; error: any, title?: string }>) => {
        let errorMessages = action.payload?.error ?? '';
        if(errorMessages instanceof Error){
          errorMessages = action.payload?.error?.message ?? '';
        }

        state.dialogStatus.isOpen = true;
        state.dialogStatus.status = action.payload?.status;
        state.dialogStatus.message = errorMessages;
        state.dialogStatus.title = action.payload?.title ?? '';
    },
    closeDialog: (state) => {
        state.dialogStatus.isOpen = false;
        //state.dialogStatus = initialState.snackbarStatus;
    },
  },
})

// Action creators are generated for each case reducer function
export const { startLoading, endLoading, openSnackbar, closeSnackbar, openDialog, closeDialog } = globalSlice.actions;

export default globalSlice.reducer;