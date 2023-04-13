import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { Typography, Box } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MaskedInput, { conformToMask } from "react-text-mask";
import PropTypes from "prop-types";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { startLoading, endLoading } from "@/slices/globalSlice";
import type { RootState } from "@/store";

export default function PlayGround() {
  const global = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  useEffect(() => {});

  const fontTypes = (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Typography variant="h1" gutterBottom>
        h1. Heading
      </Typography>
      <Typography variant="h2" gutterBottom>
        h2. Heading
      </Typography>
      <Typography variant="h3" gutterBottom>
        h3. Heading
      </Typography>
      <Typography variant="h4" gutterBottom>
        h4. Heading
      </Typography>
      <Typography variant="h5" gutterBottom>
        h5. Heading
      </Typography>
      <Typography variant="h6" gutterBottom>
        h6. Heading
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Quos blanditiis tenetur
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        Quos blanditiis tenetur
      </Typography>
      <Typography variant="body1" gutterBottom>
        body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
        blanditiis tenetur unde suscipit, quam beatae rerum inventore
        consectetur, neque doloribus, cupiditate numquam dignissimos laborum
        fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography variant="body2" gutterBottom>
        body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
        blanditiis tenetur unde suscipit, quam beatae rerum inventore
        consectetur, neque doloribus, cupiditate numquam dignissimos laborum
        fugiat deleniti? Eum quasi quidem quibusdam.
      </Typography>
      <Typography variant="button" display="block" gutterBottom>
        button text
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        caption text
      </Typography>
      <Typography variant="overline" display="block" gutterBottom>
        overline text
      </Typography>
    </Box>
  );

  const textColor = (
    <Box sx={{ width: "100%", maxWidth: 500 }}>
      <Typography color="primary" gutterBottom>
        Primary color
      </Typography>
      <Typography bgcolor="primary.main" gutterBottom>
        Primary color
      </Typography>
      <Typography color="secondary" gutterBottom>
        Secondary color
      </Typography>
      <Typography bgcolor="secondary.main" gutterBottom>
        Secondary color
      </Typography>
      <Typography color="success" gutterBottom>
        Success color
      </Typography>
      <Typography bgcolor="success.main" gutterBottom>
        Success color
      </Typography>
      <Typography color="error" gutterBottom>
        Error color
      </Typography>
      <Typography bgcolor="error.main" gutterBottom>
        Error color
      </Typography>
      <Typography color="warning.main" gutterBottom>
        Warning color
      </Typography>
      <Typography bgcolor="warning.main" gutterBottom>
        Warning color
      </Typography>
      <Typography color="info.main" gutterBottom>
        Info color
      </Typography>
      <Typography bgcolor="info.main" gutterBottom>
        Info color
      </Typography>
    </Box>
  );

  return (
    <>
      <Head>
        <title>PlayGround | Company</title>
        <meta name="description" content="Mst Code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container>
        {textColor}
        {fontTypes}
      </Container>
    </>
  );
}
