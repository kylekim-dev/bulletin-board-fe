import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { object, number, string, ObjectSchema } from "yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { openSnackbar, openDialog } from "@/slices/globalSlice";
import { AxiosRequestConfig } from "axios";
import { ApiHelper } from "@/src/classes/ApiHelper";

import {
  Radio,
  RadioGroup,
  FormLabel,
  IconButton,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Box,
  Grid,
  TextField,
  Container,
  Typography,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  FormControl,
  FormHelperText,
  Hidden,
  Icon
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { MstCode, SelectItem, CIConditionItem } from "@/src/types";

const initialConditionItemState: CIConditionItem = {
  itemId: 0,
  itemName: null,
  itemType: null,
  codeGroup: null,
  codeType: null,
  pricerFieldName: null,
  excluded: "N",
};

const schema = Yup.object().shape({
  itemId: Yup.number().required(),
  itemName: Yup.string().required(),
  codeGroup: Yup.string().required(),
  itemType: Yup.string().required(),
  codeType: Yup.string().required(),
  pricerFieldName: Yup.string().required(),
  excluded: Yup.string().required(),
});

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ConditionItem() {
  const [conditionItems, setConditionItems] = useState<CIConditionItem[] | null>(
    null
  );
  const [condition, setCondition] = useState<CIConditionItem>(
    initialConditionItemState
  );
  const [conditionModalShow, setConditionModalShow] = useState<boolean>(false);

  const [itemTypes, setItemTypes] = useState<SelectItem[] | null>(null);
  const [codeTypes, setCodeTypes] = useState<SelectItem[] | null>(null);
  const [pricerFields, setPricerFields] = useState<SelectItem[] | null>(null);
  const [yAndN, setYAndN] = useState<SelectItem[] | null>(null);

  const global = useSelector((state: RootState) => state.global);
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
  } = useForm<CIConditionItem>({
    mode: "onChange",
    resolver: yupResolver(schema),
    values: condition,
  });

  const { errors } = formState;

  useEffect(() => {
    getConditionItems();
  }, []);

  const getConditionItems = async () => {
    const api = new ApiHelper(process.env.PUBLIC_API_URL);
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    try {
      const dataConditionTypes = await api.get<CIConditionItem[]>(`api/nwapp/conditionItem`, config);
      setConditionItems(dataConditionTypes);

      const dataCodeTypes = await api.get<SelectItem[]>(`api/nwapp/SelectItem/MstCode/00000`, config);
      setCodeTypes(dataCodeTypes);

      const pricerFieldTypes = await api.get<SelectItem[]>(`api/nwapp/SelectItem/MstCode/Pricer Field`, config);
      setPricerFields(pricerFieldTypes);

      const itemTypes = await api.get<SelectItem[]>(`api/nwapp/SelectItem/MstCode/PR_ITEM_TYPE`, config);
      setItemTypes(itemTypes);

      const yandNTypes = await api.get<SelectItem[]>(`api/nwapp/SelectItem/MstCode/YandN`, config);
      setYAndN(yandNTypes);

    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: CIConditionItem) => {
    console.log(data);
    try {
      if(data.itemId > 0){
        console.log("Update");
      }
      else {
        console.log("Create");
      }
      dispatch(openSnackbar({status: 'success', message: "Success"}));
      reset();
      setConditionModalShow(false);
    } catch (error: any) {
      dispatch(openDialog({ status: 'error', error: error, title: "Success" }));
    }
  };

  const handleOpen = (conditionItem: CIConditionItem) =>
    setCondition(conditionItem);
  const handleClose = () => setCondition(initialConditionItemState);

  let conditionItemTable = <></>;
  let conditionModal = <></>;

  if (conditionItems != null) {
    conditionItemTable = (
      <div>
        <Box textAlign={"right"}>
          <LoadingButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setCondition(initialConditionItemState);
              setConditionModalShow(true);
            }}
          >
            Condition Item
          </LoadingButton>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="left">Item Name</TableCell>
                <TableCell align="left">Item Type</TableCell>
                <TableCell align="left">Code Group Name</TableCell>
                <TableCell align="left">Code Type</TableCell>
                <TableCell align="left">Pricer Field Name</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody color="primary">
              {conditionItems.map((row, index) => (
                <TableRow
                  key={`${index}-${row.itemId}`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  hover
                  selected={row.itemId == condition?.itemId}
                >
                  <TableCell align="left">{ row.excluded == "N" ? <Icon color="success"><CheckCircle /></Icon> : <Icon color="error"><RadioButtonUnchecked /></Icon> }</TableCell>
                  <TableCell align="left">{row.itemName}</TableCell>
                  <TableCell align="left">{row.itemType}</TableCell>
                  <TableCell align="left">{row.codeGroup}</TableCell>
                  <TableCell align="left">{row.codeType}</TableCell>
                  <TableCell align="left">{row.pricerFieldName}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        handleOpen(row);
                        setConditionModalShow(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  } else {
    return (
      <>
        <div>loading...</div>
      </>
    );
  }

  if (
    condition != null &&
    codeTypes != null &&
    pricerFields != null &&
    itemTypes != null &&
    yAndN != null
  ) {
    conditionModal = (
      <Modal
        open={conditionModalShow}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              title={`id: ${condition.itemId}`}
            >
              {condition.itemId > 0 ? "Update " : "Create "} Condition Item
            </Typography>
            <Grid container spacing={2}>
              <Hidden lgDown>
                <Grid item xs={12}>
                  <TextField
                    label="Item Id"
                    {...register("itemId")}
                    fullWidth
                    size="small"
                    error={!!errors.itemId}
                    helperText={errors.itemId?.message}
                  />
                </Grid>
              </Hidden>
              <FormHelperText error>{ errors.itemId?.message }</FormHelperText>
              <Grid item xs={12}>
                <TextField
                  label="Item Name"
                  {...register("itemName")}
                  fullWidth
                  size="small"
                  error={!!errors.itemName}
                  helperText={errors.itemName?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Data Type"
                  {...register("itemType")}
                  select
                  fullWidth
                  size="small"
                  error={!!errors.itemType}
                  helperText={errors.itemType?.message}
                >
                  {itemTypes.map((item, index) => (
                    <MenuItem key={`${item.label}-${index}`} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Code Group"
                  {...register("codeGroup")}
                  select
                  fullWidth
                  size="small"
                  error={!!errors.codeGroup}
                  helperText={errors.codeGroup?.message}
                >
                    <MenuItem value={`B`}>
                      Byte Pro
                    </MenuItem>
                    <MenuItem value={`P`}>
                      Custom
                    </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Code Type"
                  {...register("codeType")}
                  select
                  fullWidth
                  size="small"
                  error={!!errors.codeType}
                  helperText={errors.codeType?.message}
                >
                  {codeTypes.map((item, index) => (
                    <MenuItem key={`${item.label}-${index}`} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Pricer Field"
                  {...register("pricerFieldName")}
                  select
                  fullWidth
                  size="small"
                  error={!!errors.pricerFieldName}
                  helperText={errors.pricerFieldName?.message}
                >
                  {pricerFields.map((item, index) => (
                    <MenuItem key={`${item.label}-${index}`} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  label="Excluded"
                  control={
                    <Checkbox
                      color="error"
                      checked={watch("excluded") == "Y"}
                      {...register("excluded")}
                      onChange={(e) => {
                        setValue("excluded", e.target.checked ? "Y" : "N");
                      }}
                    />
                  }
                />
                { errors.excluded && <FormHelperText error>{errors.excluded.message}</FormHelperText> }
              </Grid>
              <Grid item xs={12} textAlign="right">
                <LoadingButton variant="contained" type="submit">
                  {condition.itemId > 0 ? "Update" : "Create"}
                </LoadingButton>
                <LoadingButton
                  onClick={(e) => {
                    e.preventDefault();
                    reset();
                    setConditionModalShow(false);
                  }}
                >
                  Cancel
                </LoadingButton>
              </Grid>
              {/* <Grid item xs={12} textAlign="right">
                { errors != null ? JSON.stringify(errors) : "" }
              </Grid> */}
            </Grid>
          </Box>
        </form>
      </Modal>
    );
  }

  return (
    <>
      <Head>
        <title>ConditionItems | Company</title>
        <meta name="description" content="Mst Code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container>
        {conditionItemTable}
        {conditionModal}
      </Container>
    </>
  );
}
