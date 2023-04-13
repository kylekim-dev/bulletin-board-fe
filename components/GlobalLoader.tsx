import type { NextPage } from "next";
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Backdrop, CircularProgress } from "@mui/material";

const GlobalLoader: NextPage = () => {
  const open = useSelector((state: RootState) => state.global.loading);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
};
export default GlobalLoader;
