import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSelector, useDispatch } from "react-redux";

import { TextField, Typography, Grid, Box, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { LoginFormValues } from "@/src/types";

import * as Yup from "yup";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { endLoading, startLoading, openSnackbar } from "@/slices/globalSlice";
import { setUser, resetUser } from "@/slices/userSlice";

const initialLoginFormValuesState: LoginFormValues = {
  username: "",
  password: "",
};

const schema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    reset,
    formState,
    getValues,
    setValue,
    watch,
  } = useForm<LoginFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    values: initialLoginFormValuesState,
  });

  const { errors } = formState;

  useEffect(() => {
    resetProfile();
  }, []);

  const resetProfile = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");
    dispatch(resetUser());
  }

  const onSubmit = async (credential: LoginFormValues) => {
    try {
      dispatch(startLoading());
      const resp = await axios
        .post(
          `${process.env.PUBLIC_API_URL}/api/bytepro/user/login`,
          credential
        )
        .catch((err) => err.response);

      if (resp.status != 200) {
        throw new Error(resp.data);
      }
      localStorage.setItem("token", resp.data.token);
      localStorage.setItem(
        "tokenExpirationDate",
        resp.data.tokenExpirationDate
      );
      localStorage.setItem("user", JSON.stringify(resp.data));
      
      if(localStorage.getItem("user") !== null){
        const userJosn: string = localStorage.getItem("user") as string;
        dispatch(setUser({ userJosn: userJosn }));
      }

      dispatch(
        openSnackbar({ status: "success", message: "Login successful." })
      );
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message);
      dispatch(openSnackbar({ status: "error", message: "Login failed." }));
    } finally {
      dispatch(endLoading());
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justifyContent="center">
          <Grid item xs={8}>
            <Box
              sx={{
                width: "100%",
                height: "100vh",
                backgroundColor: "primary.light",
              }}
            ></Box>
          </Grid>
          <Grid item xs={4}>
            <Box
              sx={{
                mx: "auto",
                p: 4,
              }}
              textAlign="center"
            >
              <Typography sx={{ my: 2 }} variant="h3">
                Logo
              </Typography>

              {errorMessage != null ? (
                <Alert severity="error">{errorMessage}</Alert>
              ) : (
                <></>
              )}
              <TextField
                label="Username"
                {...register("username")}
                fullWidth
                size="small"
                sx={{ my: 1 }}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
              <TextField
                label="Password"
                {...register("password")}
                fullWidth
                sx={{ my: 1 }}
                size="small"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Login
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
