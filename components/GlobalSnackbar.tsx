import type { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { closeSnackbar } from "@/slices/globalSlice";
import { Snackbar, Alert } from "@mui/material";
import Slide, { SlideProps } from "@mui/material/Slide";
import Stack from "@mui/material/Stack";

const GlobalSnackbar: NextPage = () => {
  const snackbarStatus = useSelector(
    (state: RootState) => state.global.snackbarStatus
  );
  const dispatch = useDispatch();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(closeSnackbar());
  };

  const SlideTransition = (props: SlideProps) => {
    return <Slide {...props} direction="up" />;
  };

  return (
      <Snackbar
        open={snackbarStatus.isOpen}
        onClose={handleClose}
        autoHideDuration={2000}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarStatus.status}
          sx={{ width: "100%" }}
        >
          {snackbarStatus.message}
        </Alert>
      </Snackbar>
  );
};
export default GlobalSnackbar;
