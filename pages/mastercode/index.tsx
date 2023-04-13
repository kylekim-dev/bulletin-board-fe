import React, { useState, useEffect, useCallback } from "react";
import {
  GetStaticPaths,
  GetStaticProps,
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import Link from "next/link";
import {
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  MenuItem,
  Typography,
  Dialog,
  Grid,
  Paper,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  TextField,
  Autocomplete,
  Container,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import { fontSize } from "@mui/system";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MstCode, SelectItem } from "@/src/types";
import { AxiosRequestConfig } from "axios";
import { ApiHelper } from "@/src/classes/ApiHelper";
import { useSelector, useDispatch } from "react-redux";
import {
  startLoading,
  endLoading,
  openDialog,
  openSnackbar,
} from "@/slices/globalSlice";

export default function MasterCode() {
  const dispatch = useDispatch();
  const [codeTypes, setCodeTypes] = useState<SelectItem[]>([]);
  const [selectedCodeType, setSelectedCodeType] = useState<SelectItem | null>(
    null
  );
  const [showDisabled, setShowDisabled] = useState<boolean>(false);
  const [mstcodes, setMstCodes] = useState<MstCode[]>([]);
  const [selectedMstCode, setSelectedMstCode] = useState<MstCode | null>(null);
  const [crudDialogOpen, setCrudDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const api = new ApiHelper(process.env.PUBLIC_API_URL);
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/00000", config)
      .then((resp) => {
        setCodeTypes(
          resp
            .filter((x) => x.enabled === true)
            .sort((a, b) => a.label.localeCompare(b.label))
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(openSnackbar({ status: "error", message: error as string }));
      });
  }, []);

  const handleCodeTypeChange = async (
    event: any,
    codeType: SelectItem | null
  ) => {
    event.preventDefault();
    dispatch(startLoading());
    try {
      const api = new ApiHelper(process.env.PUBLIC_API_URL);
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      setSelectedCodeType(codeType);
      const data = await api.get<MstCode[]>(
        `api/nwapp/mstcode/${codeType?.value}`,
        config
      );
      setMstCodes(data);
    } catch (error) {
      dispatch(openSnackbar({ status: "error", message: error as string }));
    }
    dispatch(endLoading());
  };

  const handleClickTable = (event: any, mst: MstCode) => {
    event.preventDefault();
    setSelectedMstCode(mst);
    setCrudDialogOpen(true);
  };

  const crudDialog = (
    <Dialog
      open={crudDialogOpen}
      onClose={() => setCrudDialogOpen(false)}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Master Code</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the following information.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          name="codeName"
          label="Code Name"
          type="text"
          fullWidth
          variant="standard"
          value={selectedMstCode?.codeName}
        />
        <TextField
          margin="dense"
          id="displayName"
          label="Display Name"
          type="text"
          fullWidth
          variant="standard"
          value={selectedMstCode?.displayName}
        />
        <TextField
          margin="dense"
          id="reference1"
          label="Reference 1"
          type="text"
          fullWidth
          variant="standard"
          value={selectedMstCode?.reference1}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCrudDialogOpen(false)}>Cancel</Button>
        <Button onClick={() => setCrudDialogOpen(false)} variant="contained" >Save</Button>
      </DialogActions>
    </Dialog>
  );

  const mstCodeTable = (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead >
          <TableRow>
            <TableCell>codeName</TableCell>
            <TableCell>codeValue</TableCell>
            <TableCell>displayName</TableCell>
            <TableCell>reference1</TableCell>
            <TableCell>reference2</TableCell>
            <TableCell>reference3</TableCell>
            <TableCell>reference4</TableCell>
            <TableCell>reference5</TableCell>
            <TableCell>reference6</TableCell>
            <TableCell>reference7</TableCell>
            <TableCell>reference8</TableCell>
            <TableCell>reference9</TableCell>
            <TableCell>reference10</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mstcodes.length > 0 ? (
            mstcodes.map((row) => (
              <TableRow
                key={row.codeId}
                sx={{
                  bgcolor: row.excluded === "Y" ? "error.main" : "",
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
                hover
                onClick={(event) => handleClickTable(event, row)}
              >
                <TableCell>{row.codeName}</TableCell>
                <TableCell>{row.codeValue}</TableCell>
                <TableCell>{row.displayName}</TableCell>
                <TableCell>{row.reference1}</TableCell>
                <TableCell>{row.reference2}</TableCell>
                <TableCell>{row.reference3}</TableCell>
                <TableCell>{row.reference4}</TableCell>
                <TableCell>{row.reference5}</TableCell>
                <TableCell>{row.reference6}</TableCell>
                <TableCell>{row.reference7}</TableCell>
                <TableCell>{row.reference8}</TableCell>
                <TableCell>{row.reference9}</TableCell>
                <TableCell>{row.reference10}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell colSpan={14} align="center">
                <Typography color="textSecondary">No Data</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <Container>
        <h1>Master Code</h1>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              value={selectedCodeType}
              onChange={(event, newValue) =>
                handleCodeTypeChange(event, newValue)
              }
              options={codeTypes}
              size="small"
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Target Code Type" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showDisabled}
                  onChange={(event) => {
                    setShowDisabled(event.target.checked);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                ></Checkbox>
              }
              label="Include Disabled"
            />
          </Grid>
        </Grid>
        {mstCodeTable}
        {crudDialog}
      </Container>
    </>
  );
}
