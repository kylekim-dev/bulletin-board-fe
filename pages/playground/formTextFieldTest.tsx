import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MaskedInput from "react-text-mask";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { startLoading, endLoading } from "@/slices/globalSlice";
import type { RootState } from "@/store";

import * as mask from "@/src/masks";
import * as regex from "@/src/regexs";

interface TestProfile {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  phoneMask: string | null;
  income: string | null;
  incomeMask: string | null;
  taxRate: string | null;
  taxRateMask: string | null;
  commissionRate: string | null;
//   sex: string | null;
//   agree: boolean;
}

const initialState: TestProfile = {
  fullName: null,
  email: null,
  phone: null,
  phoneMask: null,
  income: null,
  incomeMask: null,
  taxRate: null,
  taxRateMask: null,
  commissionRate: null,
//   sex: null,
//   agree: false,
};


const schema = Yup.object().shape({
  fullName: Yup.string().required("Required"),
  email: Yup.string()
    .required("Required")
    .matches(regex.emailRegex, "Invalid format."),
  phone: Yup.string().required("Required"),
  phoneMask: Yup.string()
    .required("Required")
    .matches(regex.phoneRegex, "Invalid format."),
  income: Yup.string().required("Required"),
  incomeMask: Yup.string()
    .required("Required")
    .matches(regex.currencyRegex, "Invalid format."),
  taxRate: Yup.string().required("Required"),
  taxRateMask: Yup.string()
    .required("Required")
    .matches(regex.percentageRegex, "Invalid format."),
commissionRate: Yup.string()
    .required("Required")
    .matches(regex.pointRegex, "Invalid format."),
//   sex: Yup.string().required("Required"),
//   agree: Yup.boolean().required("Required"),
});

export default function FormTextFieldTest() {
  const [profile, setProfile] = useState<TestProfile>(initialState);
  const global = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  useEffect(() => {});

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPserson({...myPerson, [e.target.name]: e.target.value});
  //   schema.validate(myPerson);
  // };

  // get functions to build form with useForm() hook
  const {
    register,
    handleSubmit,
    reset,
    formState,
    getValues,
    setValue,
    watch,
  } = useForm<TestProfile>({
    mode: "onChange",
    resolver: yupResolver(schema),
    values: initialState,
  });
  const { errors } = formState;

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name.includes("Mask") && value != null) {
      if (value.includes("$")) {
        setValue(name.replace("Mask", ""), value.replace(/,|\$/g, ""));
      } else {
        setValue(
          name.replace("Mask", ""),
          value.replace(/\s|\_|\(|\)|\-|\$/g, "")
        );
      }
    }
  };

  const onSubmit = async (data: TestProfile) => {
    dispatch(startLoading());
    console.log(data);
    await new Promise((r) => setTimeout(r, 2000));
    dispatch(endLoading());
  };

  return (
    <>
      <Head>
        <title>PlayGround | Company</title>
        <meta name="description" content="Mst Code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4">Welcome to Play ground</Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                label="Full Name"
                size="small"
                fullWidth
                {...register("fullName")}
                error={errors.fullName?.message != null}
                helperText={errors.fullName?.message}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                label="Email"
                size="small"
                fullWidth
                {...register("email")}
                error={errors.email?.message != null}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                size="small"
                fullWidth
                {...register("phoneMask", { onChange: handleChange })}
                error={errors.phoneMask?.message != null}
                helperText={errors.phoneMask?.message}
                InputProps={{
                  inputComponent: MaskedInput as any,
                  inputProps: { mask: mask.telMask },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Anual Income"
                size="small"
                fullWidth
                {...register("incomeMask", { onChange: handleChange })}
                error={errors.incomeMask?.message != null}
                helperText={errors.incomeMask?.message}
                InputProps={{
                  inputComponent: MaskedInput as any,
                  inputProps: { mask: mask.currencyMask },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tax Rage"
                size="small"
                fullWidth
                {...register("taxRateMask", { onChange: handleChange })}
                error={errors.taxRateMask?.message != null}
                helperText={errors.taxRateMask?.message}
                InputProps={{
                  inputComponent: MaskedInput as any,
                  inputProps: { mask: mask.percentageMask },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Commision Rate"
                size="small"
                fullWidth
                {...register("commissionRate", { onChange: handleChange })}
                error={errors.commissionRate?.message != null}
                helperText={errors.commissionRate?.message}
                InputProps={{
                  inputComponent: MaskedInput as any,
                  inputProps: { mask: mask.pointMask, guide: false },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                loading={global.loading}
              >
                Submit
              </LoadingButton>
            </Grid>
            <Grid item xs={12}>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
                loading={global.loading}
                onClick={() => reset()}
              >
                Reset
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
}
