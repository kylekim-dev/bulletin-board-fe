import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import {
  Typography,
  Box,
  Grid,
  TextField,
  Container,
  Divider,
  MenuItem,
  FormHelperText,
  Select,
  Input,
  InputAdornment,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Checkbox,
  Tooltip,
  FormControlLabel,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,
  Autocomplete,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DownloadIcon from "@mui/icons-material/Download";
import LoadingButton from "@mui/lab/LoadingButton";
import { grey } from "@mui/material/colors";
import { useForm, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import {
  startLoading,
  endLoading,
  openDialog,
  openSnackbar,
} from "@/slices/globalSlice";
import type { RootState } from "@/store";

import { downloadJsonFile, isNullOrEmpty } from "@/src/helpers/commonHelper";
import { useDropzone } from "react-dropzone";

import {
  FileData,
  LoanEligibility,
  SelectItem,
  PricingOption,
  PricingResult,
  Loan,
} from "@/src/types";

import { loanPurposeType } from "@/src/enums";

import { AxiosRequestConfig } from "axios";
import { ApiHelper } from "@/src/classes/ApiHelper";
import MaskedInput from "react-text-mask";
import * as mask from "@/src/masks";
import * as regex from "@/src/regexs";
import * as convertHelper from "@/src/helpers/convert";
import * as classStyleHelper from "@/src/helpers/classStyle";
import * as mortgageCalculatorHelper from "@/src/helpers/mortgageCalculator";

// TODO: add imask

const initialState: FileData = {
  fileName: null,
  occupancyType: 0,
  organizationId: 0,
  documentationType: 0,
  fileCreditScore: null,
  fileCreditScoreMask: null,
  waiveEscrow: 0,
  loCompType: 0,
  compPlanId: 0,
  loan: {
    loanProgramId: 0,
    dti: null,
    dtiMask: null,
    mortgageType: 0,
    loanPurpose: 0,
    refiPurpAu: 0,
    purPrice: null,
    purPriceMask: null,
    baseLoan: null,
    baseLoanMask: null,
    ltv: null,
    ltvMask: null,
    cltv: null,
    cltvMask: null,
    loanProductType: -1,
    lockDays: 0,
    term: null,
  },
  subProp: {
    appraisedValue: null,
    appraisedValueMask: null,
    noUnits: 0,
    propertyType: 0,
    state: null,
    county: null,
  },
  customFields: null,
  pricingOptions: null,
};

const schema = Yup.object().shape({
  organizationId: Yup.number().min(1, "required").required("required"),
  occupancyType: Yup.number().min(1, "required").required("required"),
  documentationType: Yup.number().min(1, "required").required("required"),
  waiveEscrow: Yup.number().min(1, "required").required("required"),
  loCompType: Yup.number().min(1, "required").required("required"),
  compPlanId: Yup.number().when("loCompType", ([loCompType], schema) => {
    return loCompType == 2
      ? schema.min(1, "required").required("required")
      : schema;
  }),
  fileCreditScoreMask: Yup.string()
    .matches(regex.creditScoreRegex, regex.creditScoreRegexMsg)
    .required("required"),
  loan: Yup.object().shape({
    dtiMask: Yup.string()
      .matches(regex.percentageRegex, regex.percentageRegexMsg)
      .required("required"),
    // purPrice: Yup.string().when("loanPurpose", ([loanPurpose], schema) => {
    //   return loanPurpose === 2 ? schema : schema.required("required");
    // }),
    purPriceMask: Yup.string().when("loanPurpose", ([loanPurpose], schema) => {
      return loanPurpose === loanPurpose.Refinance
        ? schema
        : schema
            .matches(regex.currencyRegex, regex.currencyRegexMsg)
            .required("required");
    }),
    baseLoanMask: Yup.string()
      .matches(regex.currencyRegex, regex.currencyRegexMsg)
      .required("required"),
    // loanProgramId: Yup.number().min(1, "required").required("required"),
    mortgageType: Yup.number().min(1, "required").required("required"),
    loanPurpose: Yup.number().min(1, "required").required("required"),
    loanProductType: Yup.number().min(0, "required").required("required"),
    lockDays: Yup.number().min(1, "required").required("required"),
    term: Yup.number().nullable(),
    refiPurpAu: Yup.number().when("loanPurpose", ([loanPurpose], schema) => {
      return loanPurpose === 2
        ? schema.min(1, "required").required("required")
        : schema;
    }),
    ltvMask: Yup.string()
      .matches(regex.percentageRegex, regex.percentageRegexMsg)
      .required("required"),
    cltvMask: Yup.string()
      .matches(regex.percentageRegex, regex.percentageRegexMsg)
      .required("required"),
  }),
  subProp: Yup.object().shape({
    appraisedValueMask: Yup.string()
      .matches(regex.currencyRegex, regex.currencyRegexMsg)
      .required("required"),
    propertyType: Yup.number().min(1, "required").required("required"),
    noUnits: Yup.number().min(1, "required").required("required"),
    state: Yup.string().required("required"),
    county: Yup.string().required("required"),
  }),
  customFields: Yup.object().shape({
    field04: Yup.string().when(
      "documentationType",
      ([documentationType], schema) => {
        return documentationType === 1
          ? Yup.string().required("required")
          : schema;
      }
    ),
  }),
});

export default function Finder() {
  const dispatch = useDispatch();

  const [requestModel, setRequestModel] = useState<FileData>(initialState);

  const [availableLoansItems, setAvailableLoans] = useState<
    LoanEligibility[] | null
  >(null);

  const [optionFields, setOptionFields] = useState<PricingOption[] | null>(
    null
  );

  const [pricingResult, setPricingResult] = useState<PricingResult | null>(
    null
  );
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);
  const [showOnlyAvailableLoans, setShowOnlyAvailableLoans] =
    useState<boolean>(true);

  // get functions to build form with useForm() hook
  const [organizationItems, setOrganizationItems] = useState<SelectItem[]>([]);
  const [mortgageTypeItems, setMortgageTypeItems] = useState<SelectItem[]>([]);
  const [loanPurposeItems, setLoanPurposeItems] = useState<SelectItem[]>([]);
  const [refiPurpAuItems, setRefiPurpAuItems] = useState<SelectItem[]>([]);
  const [occupancyItems, setOccupancyItems] = useState<SelectItem[]>([]);
  const [subjectPropertyTypeItems, setSubjectPropertyTypeItems] = useState<
    SelectItem[]
  >([]);
  const [noUnitsItems, setNoUnitsItems] = useState<SelectItem[]>([]);
  const [documentationTypeItems, setDocumentationTypeItems] = useState<
    SelectItem[]
  >([]);
  const [stateItems, setStateItems] = useState<SelectItem[]>([]);
  const [countyItems, setCountyItems] = useState<SelectItem[]>([]);
  const [loanProductTypeItems, setLoanProductTypeItems] = useState<
    SelectItem[]
  >([]);
  const [waiveEscrowItems, setWaiveEscrowItems] = useState<SelectItem[]>([]);
  const [lockDaysItems, setLockDaysItems] = useState<SelectItem[]>([]);
  const [loCompTypeItems, setLOCompTypeItems] = useState<SelectItem[]>([]);
  const [incomeDocTypeItems, setIncomeDocTypeItems] = useState<SelectItem[]>(
    []
  );
  const [compensationPlanItems, setCompensationPlanItems] = useState<
    SelectItem[]
  >([]);

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setValue,
    getValues,
    watch,
  } = useForm<FileData>({
    mode: "onChange",
    resolver: yupResolver(schema),
    values: initialState,
  });
  const { errors } = formState;

  useEffect(() => {
    const api = new ApiHelper(process.env.PUBLIC_API_URL);
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    api
      .get<SelectItem[]>("api/BytePro/Organization/SelectItems", config)
      .then((resp) => {
        setOrganizationItems(resp);
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/mortgagetype", config)
      .then((resp) => {
        setMortgageTypeItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/loanpurpose", config)
      .then((resp) => {
        setLoanPurposeItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/RefiPurpAU", config)
      .then((resp) => {
        setRefiPurpAuItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/occupancyType", config)
      .then((resp) => {
        setOccupancyItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>(
        "api/nwapp/SelectItem/MstCode/subjectPropertyType",
        config
      )
      .then((resp) => {
        setSubjectPropertyTypeItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/NoOfUnits", config)
      .then((resp) => {
        setNoUnitsItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>(
        "api/nwapp/SelectItem/MstCode/documentationType",
        config
      )
      .then((resp) => {
        setDocumentationTypeItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/loanProductType", config)
      .then((resp) => {
        setLoanProductTypeItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>(
        "api/nwapp/SelectItem/MstCode/escrowWaiverType",
        config
      )
      .then((resp) => {
        setWaiveEscrowItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/lOCKDAYS", config)
      .then((resp) => {
        setLockDaysItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/lOCompType", config)
      .then((resp) => {
        setLOCompTypeItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/1000004", config)
      .then((resp) => {
        setIncomeDocTypeItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>(`api/nwapp/SelectItem/CompensationPlan/0`, config)
      .then((resp) => {
        setCompensationPlanItems(resp.filter((x) => x.enabled));
      });

    api
      .get<SelectItem[]>("api/nwapp/SelectItem/MstCode/State", config)
      .then((resp) => {
        setStateItems(resp.filter((x) => x.enabled && !isNullOrEmpty(x.value)));
      });

    api
      .get<SelectItem[]>(`api/nwapp/SelectItem/county/all`, config)
      .then((resp) => {
        setCountyItems(
          resp.filter((x) => x.enabled && !isNullOrEmpty(x.value))
        );
      });
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name == "loan.loanPurpose") {
      if (value == loanPurposeType.Refinance) {
        setValue("loan.refiPurpAu", 0);
        setValue("loan.purPrice", null);
      }
    }

    if (name === "loan.dtiMask") {
      setValue("loan.dti", convertHelper.toFloat(value));
    }

    if (name == "subProp.appraisedValueMask") {
      const appraisedValue = convertHelper.toFloat(value);
      setValue("subProp.appraisedValue", appraisedValue);
    }

    if (name == "loan.baseLoanMask") {
      const baseLoan: number = convertHelper.toFloat(value) ?? 0;
      const appraisedValue: number = watch("subProp.appraisedValue") ?? 0;
      const ltv = (baseLoan / appraisedValue) * 100.0;

      setValue("loan.baseLoan", baseLoan);
      setValue("loan.ltv", ltv);
      setValue("loan.ltvMask", convertHelper.toPercent(ltv));
      setValue("loan.cltv", ltv);
      setValue("loan.cltvMask", convertHelper.toPercent(ltv));
    }

    if (name == "loan.ltvMask") {
      const ltv: number = convertHelper?.toFloat(value) ?? 0;
      const appraisedValue: number = watch("subProp.appraisedValue") ?? 0;
      const baseLoan: number = appraisedValue * (ltv / 100);

      setValue("loan.ltv", ltv);
      setValue("loan.cltv", ltv);
      setValue("loan.cltvMask", convertHelper.toPercent(ltv));
      setValue("loan.baseLoan", baseLoan);
      setValue("loan.baseLoanMask", convertHelper.toCurrency(baseLoan));
    }

    if (name == "subProp.state") {
      const api = new ApiHelper(process.env.PUBLIC_API_URL);
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      api
        .get<SelectItem[]>(`api/nwapp/SelectItem/county/${value}`, config)
        .then((resp) => {
          setCountyItems(resp.filter((x) => x.enabled));
        });

      setValue("subProp.county", null);
    }

    if (name == "loCompType") {
      if (value == 1) {
        setValue("compPlanId", 0);
      }
    }

    setRequestModel(initialState);
    setAvailableLoans(null);
    setOptionFields(null);
    setPricingResult(null);
  };

  const getPricingByFileData = async () => {
    dispatch(startLoading());
    try {
      requestModel.pricingOptions = optionFields;
      setRequestModel({ ...requestModel });

      const api = new ApiHelper(process.env.PUBLIC_API_URL);
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const resp = await api.post<PricingResult>(
        "api/NWAPP/Price/PricingByFileData",
        requestModel,
        config
      );

      setPricingResult(resp);
    } catch (error) {
      dispatch(
        openDialog({
          status: "error",
          error: error,
          title: "Success",
        })
      );
    }
    dispatch(endLoading());
  };

  const handleSelectEligibleLoan = async (loanProgramId: number) => {
    dispatch(startLoading());
    try {
      const api = new ApiHelper(process.env.PUBLIC_API_URL);
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      const loanTerm: number = await api
        .get<any | null>(`api/BytePro/LoanProgram/${loanProgramId}`, config)
        .then((resp) => (resp?.term ?? 360) as number)
        .catch(() => 360);

      requestModel.loan.loanProgramId = loanProgramId;
      requestModel.loan.term = loanTerm;

      setRequestModel({ ...requestModel });

      const optionFieldList = await api.post<PricingOption[]>(
        "api/NWAPP/Price/ProgramOptionField",
        requestModel,
        config
      );

      if (optionFieldList !== null) {
        optionFieldList.map((option) => {
          if (option.required && option.defaultValue === null) {
            option.errorMessage = "This field is required.";
          }
        });
      }

      setOptionFields(optionFieldList);
      setPricingResult(null);
    } catch (error) {
      dispatch(
        openDialog({
          status: "error",
          error: error,
          title: "Success",
        })
      );
    }
    dispatch(endLoading());
  };

  const onSubmit = async (fileData: FileData) => {
    dispatch(startLoading());
    try {
      const api = new ApiHelper(process.env.PUBLIC_API_URL);
      const config: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      setRequestModel({ ...fileData });

      const resp = await api.post<LoanEligibility[]>(
        "api/NWAPP/Price/EligibleProgramList",
        fileData,
        config
      );

      const data = resp as LoanEligibility[];
      setAvailableLoans(data);
    } catch (error) {
      console.log(error);
      dispatch(
        openDialog({
          status: "error",
          error: error,
          title: "Success",
        })
      );
    }

    dispatch(endLoading());
  };

  const handleOptionFieldsInputChange = (e: any) => {
    const { name, value } = e.target;

    if (optionFields !== null) {
      const changedOption: PricingOption | undefined =
        optionFields?.find((x) => x.pricerFieldName === name) ?? undefined;

      if (changedOption === undefined) return;
      changedOption.defaultValue = value;

      if (changedOption.required && isNullOrEmpty(changedOption.defaultValue)) {
        changedOption.errorMessage = "This field is required";
      } else {
        changedOption.errorMessage = null;
      }

      setOptionFields([...optionFields]);
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      multiple: false,
      maxFiles: 1,
      accept: { "application/json": [] },
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length == 0) {
          dispatch(openSnackbar({ status: "error", message: "error" }));
          return;
        }
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = () => {
          const fileDataJson: FileData = JSON.parse(reader.result as string);
          reset(fileDataJson);
          setUploadOpen(false);
        };

        reader.readAsText(file);
      },
    });

  let fileDataForm = <>...loading</>;
  let eligibleLoanTable = <></>;
  let optionFieldsForm = <></>;
  let pricingResultForm = <></>;
  let uploadDialog = (
    <Dialog
      open={uploadOpen}
      onClose={() => setUploadOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        {"Upload Pricing Senario json file"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "4px dashed #eee",
                color: "grey",
              }}
              height={200}
            >
              <div>
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag & drop some files here, or click to select files</p>
                )}
              </div>
            </Box>
          </div>
          <div>
            {fileRejections != null && fileRejections.length > 0 && (
              <Box>
                <Box>Rejected Files</Box>
                <Box sx={{ color: "red" }}>
                  {fileRejections.map((file) => (
                    <>
                      <div key={file.file.name}>
                        File Name: {file.file.name}
                      </div>
                      <div key={file.file.name}>
                        Reason: {file.errors[0].message}
                      </div>
                    </>
                  ))}
                </Box>
              </Box>
            )}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setUploadOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  fileDataForm = (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container justifyContent="center" spacing={1}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Typography variant="h4">Product Finder</Typography>
            <Box sx={{ display: "flex" }}>
              <LoadingButton
                variant="contained"
                color="info"
                size="small"
                onClick={() => setUploadOpen(true)}
              >
                Upload
              </LoadingButton>

              <LoadingButton
                variant="contained"
                color="error"
                size="small"
                onClick={() => reset(initialState)}
                sx={{ ml: 1 }}
              >
                Reset
              </LoadingButton>
            </Box>
          </Box>
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            label="Organization"
            value={watch("organizationId")}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("organizationId", {
              onChange: handleInputChange,
            })}
            error={!!errors.organizationId}
            helperText={errors.organizationId?.message}
          >
            {organizationItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            label="Mortgage Type"
            value={watch("loan.mortgageType")}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("loan.mortgageType", {
              onChange: handleInputChange,
            })}
            error={!!errors.loan?.mortgageType}
            helperText={errors.loan?.mortgageType?.message}
          >
            {mortgageTypeItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            label="Loan Purpose"
            {...register("loan.loanPurpose", { onChange: handleInputChange })}
            value={watch("loan.loanPurpose")}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.loan?.loanPurpose}
            helperText={errors.loan?.loanPurpose?.message}
          >
            {loanPurposeItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item md={6} xs={12}>
          {watch("loan.loanPurpose") == 2 ? (
            <TextField
              label="Refinance Type"
              {...register("loan.refiPurpAu", {
                onChange: handleInputChange,
              })}
              value={watch("loan.refiPurpAu")}
              select
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.loan?.refiPurpAu}
              helperText={errors.loan?.refiPurpAu?.message}
            >
              {refiPurpAuItems.map((item, index) => (
                <MenuItem key={`${item.label}-${index}`} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item md={4} xs={12}>
          <TextField
            label="Property Type"
            {...register("subProp.propertyType", {
              onChange: handleInputChange,
            })}
            value={watch("subProp.propertyType")}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.subProp?.propertyType}
            helperText={errors.subProp?.propertyType?.message}
          >
            {subjectPropertyTypeItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item md={2} xs={12}>
          <TextField
            label="No Units"
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={watch("subProp.noUnits")}
            {...register("subProp.noUnits", { onChange: handleInputChange })}
            error={!!errors.subProp?.noUnits}
            helperText={errors.subProp?.noUnits?.message}
          >
            {noUnitsItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            label="Occupancy Type"
            {...register("occupancyType", { onChange: handleInputChange })}
            value={watch("occupancyType")}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.occupancyType}
            helperText={errors.occupancyType?.message}
          >
            {occupancyItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            label="Documentation Type"
            {...register("documentationType", {
              onChange: handleInputChange,
            })}
            value={watch("documentationType")}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.documentationType}
            helperText={errors.documentationType?.message}
          >
            {documentationTypeItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item md={6} xs={12}>
          {watch("documentationType") == 1 ? (
            <TextField
              label="Income Doc Type"
              {...register("customFields.field04", {
                onChange: handleInputChange,
              })}
              value={watch("customFields.field04")}
              select
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.customFields?.field04}
              helperText={errors.customFields?.field04?.message}
            >
              {incomeDocTypeItems.map((item, index) => (
                <MenuItem key={`${item.label}-${index}`} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item md={3} xs={12}>
          <TextField
            label="Credit Score"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("fileCreditScoreMask", {
              onChange: handleInputChange,
            })}
            error={!!errors.fileCreditScoreMask}
            helperText={errors.fileCreditScoreMask?.message}
            InputProps={{
              inputComponent: MaskedInput as any,
              inputProps: { mask: mask.creditMask, guide: false },
            }}
          />
        </Grid>

        <Grid item md={3} xs={12}>
          <TextField
            label="DTI"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{
              inputComponent: MaskedInput as any,
              inputProps: { mask: mask.percentageMask },
            }}
            {...register("loan.dtiMask", { onChange: handleInputChange })}
            error={!!errors.loan?.dtiMask}
            helperText={errors.loan?.dtiMask?.message}
          />
        </Grid>

        <Grid item md={3} xs={12}>
          <TextField
            label="State"
            value={watch("subProp.state") ?? ""}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("subProp.state", {
              onChange: handleInputChange,
            })}
            error={!!errors?.subProp?.state}
            helperText={errors?.subProp?.state?.message}
          >
            {stateItems.map((item, index) => (
              <MenuItem
                key={`${item.value}-${index}`}
                value={item.value as string}
              >
                {item.value}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item md={3} xs={12}>
          <TextField
            label="County"
            value={watch("subProp.county") ?? ""}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("subProp.county", {
              onChange: handleInputChange,
            })}
            error={!!errors.subProp?.county}
            helperText={errors.subProp?.county?.message}
          >
            {countyItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Divider></Divider>
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            label="Property Price"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("subProp.appraisedValueMask", {
              onChange: handleInputChange,
            })}
            error={!!errors?.subProp?.appraisedValueMask}
            helperText={errors?.subProp?.appraisedValueMask?.message}
            InputProps={{
              inputComponent: MaskedInput as any,
              inputProps: { mask: mask.currencyMask, guide: false },
            }}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          {watch("loan.loanPurpose") != 2 ? (
            <TextField
              label="Sales Price"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("loan.purPriceMask", {
                onChange: handleInputChange,
              })}
              error={!!errors.loan?.purPriceMask}
              helperText={errors.loan?.purPriceMask?.message}
              InputProps={{
                inputComponent: MaskedInput as any,
                inputProps: { mask: mask.currencyMask, guide: false },
              }}
            />
          ) : (
            <></>
          )}
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            label="Loan Amount"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("loan.baseLoanMask", {
              onChange: handleInputChange,
            })}
            error={!!errors.loan?.baseLoanMask}
            helperText={errors.loan?.baseLoanMask?.message}
            InputProps={{
              inputComponent: MaskedInput as any,
              inputProps: { mask: mask.currencyMask, guide: false },
            }}
          />
        </Grid>

        <Grid item md={3} xs={12}>
          <TextField
            label="LTV"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("loan.ltvMask", { onChange: handleInputChange })}
            error={!!errors.loan?.ltvMask}
            helperText={errors.loan?.ltvMask?.message}
            InputProps={{
              inputComponent: MaskedInput as any,
              inputProps: { mask: mask.percentageMask },
            }}
          />
        </Grid>

        <Grid item md={3} xs={12}>
          <TextField
            label="LTV"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("loan.cltvMask", { onChange: handleInputChange })}
            error={!!errors.loan?.cltvMask}
            helperText={errors.loan?.cltvMask?.message}
            InputProps={{
              inputComponent: MaskedInput as any,
              inputProps: { mask: mask.percentageMask },
            }}
          />
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            label="Amortization Type"
            {...register("loan.loanProductType", {
              onChange: handleInputChange,
            })}
            value={watch("loan.loanProductType")}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.loan?.loanProductType}
            helperText={errors.loan?.loanProductType?.message}
          >
            {loanProductTypeItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            label="Impound"
            {...register("waiveEscrow", { onChange: handleInputChange })}
            value={watch("waiveEscrow")}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.waiveEscrow}
            helperText={errors.waiveEscrow?.message}
          >
            {waiveEscrowItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item md={6} xs={12}>
          <TextField
            label="Lock Period"
            {...register("loan.lockDays", { onChange: handleInputChange })}
            value={watch("loan.lockDays")}
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.loan?.lockDays}
            helperText={errors.loan?.lockDays?.message}
          >
            {lockDaysItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item md={3} xs={12}>
          <TextField
            label="Comp Plan"
            select
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={watch("loCompType")}
            {...register("loCompType", { onChange: handleInputChange })}
            error={!!errors.loCompType}
            helperText={errors.loCompType?.message}
          >
            {loCompTypeItems.map((item, index) => (
              <MenuItem key={`${item.label}-${index}`} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item md={3} xs={12}>
          {watch("loCompType") == 2 ? (
            <TextField
              label="Comp Plan"
              {...register("compPlanId", { onChange: handleInputChange })}
              value={watch("compPlanId")}
              select
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.compPlanId}
              helperText={errors.compPlanId?.message}
            >
              {compensationPlanItems.map((item, index) => (
                <MenuItem key={`${item.label}-${index}`} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <></>
          )}
        </Grid>

        <Grid item xs={11}>
          <LoadingButton fullWidth type="submit" variant="contained">
            Find Eligible Product
          </LoadingButton>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            sx={{ mx: 1 }}
            onClick={() => downloadJsonFile(JSON.stringify(requestModel))}
            aria-label="delete"
            disabled={!formState.isValid}
            title="Download Template"
          >
            <DownloadIcon />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  );

  if (availableLoansItems !== null) {
    eligibleLoanTable = (
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <Typography variant="h5">Eligible Loans</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showOnlyAvailableLoans}
                onChange={(e) => setShowOnlyAvailableLoans(e.target.checked)}
                name="showOnlyAvailableLoans"
                color="primary"
              />
            }
            label="Show Only Available Loans"
          />
        </Box>
        <TableContainer>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>Program Name</TableCell>
                <TableCell>Code</TableCell>
              </TableRow>
            </TableHead>
            {availableLoansItems.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{ textAlign: "center", color: "error.main" }}
                    colSpan={8}
                  >
                    No eligible loans found
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {availableLoansItems
                  .filter((x) => x.eligibility === true)
                  .map((row, index) => (
                    <TableRow
                      key={`${row.loanProgramID}-${index}`}
                      sx={{
                        cursor: "pointer",
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                      hover
                      selected={
                        row.loanProgramID === requestModel.loan.loanProgramId
                      }
                      onClick={() => {
                        if (row.eligibility === false) {
                          return;
                        }
                        handleSelectEligibleLoan(row.loanProgramID);
                      }}
                    >
                      <TableCell align="center">
                        {row.eligibility ? (
                          <Checkbox
                            checked={
                              row.loanProgramID ===
                              requestModel.loan.loanProgramId
                            }
                            readOnly={true}
                            size="small"
                          />
                        ) : (
                          <Tooltip
                            title={row.ineligibleNote}
                            placement="right-start"
                          >
                            <ErrorOutlineIcon color="error" />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>{row.loanProgramName}</TableCell>
                      <TableCell>{row.loanProgramCode}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Grid>
    );
  }

  const getTextFieldForOptionField = (options: PricingOption[]) => {
    if (options.length === 0) {
      return <Box>No Data</Box>;
    } else {
      let comp = options.map((optionItem, index) => {
        if (optionItem.fieldType == "list" && optionItem.lookupList !== null) {
          return (
            <Grid item xs={12} md={6} key={`option-field-${index}`}>
              <TextField
                label={optionItem.displayName}
                value={optionItem.defaultValue}
                name={optionItem.pricerFieldName}
                onChange={handleOptionFieldsInputChange}
                select
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!isNullOrEmpty(optionItem.errorMessage)}
                helperText={optionItem?.errorMessage ?? null}
              >
                {optionItem.lookupList.map((mst, index) => (
                  <MenuItem
                    key={`${mst.codeId}-${index}`}
                    value={mst.codeValue}
                  >
                    {mst.displayName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          );
        } else {
          return (
            <Grid item xs={12} md={6} key={`option-field-${index}`}>
              <TextField
                label={optionItem.displayName}
                value={optionItem.defaultValue}
                name={optionItem.pricerFieldName}
                onChange={handleOptionFieldsInputChange}
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!isNullOrEmpty(optionItem.errorMessage)}
                helperText={optionItem?.errorMessage ?? null}
              />
            </Grid>
          );
        }
      });

      return comp;
    }
  };

  if (optionFields !== null) {
    optionFieldsForm = (
      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <Typography variant="h5">Loan Options</Typography>
        </Box>
        <Grid container spacing={1}>
          {getTextFieldForOptionField(optionFields)}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
              }}
            >
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                size="small"
                fullWidth
                onClick={getPricingByFileData}
                disabled={optionFields.some(
                  (x) => !isNullOrEmpty(x.errorMessage)
                )}
              >
                See Rate Sheet
              </LoadingButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (pricingResult !== null) {
    pricingResultForm = (
      <div>
        <Grid sx={{ my: 1 }} item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <Typography variant="h5">Pricing Result</Typography>
          </Box>
          <TableContainer>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              {pricingResult.adjustments != null &&
              pricingResult.adjustments.length > 0 ? (
                <TableBody>
                  {pricingResult.adjustments.map((row, index) => (
                    <TableRow key={`adjustments-${index}`}>
                      <TableCell>{row.note}</TableCell>
                      <TableCell
                        sx={{
                          color: classStyleHelper.getPositiveOrNegative(
                            row.rateAdjustment
                          ),
                        }}
                      >
                        {row.rateAdjustment.toFixed(3)}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: classStyleHelper.getPositiveOrNegative(
                            row.priceAdjustment
                          ),
                        }}
                      >
                        {row.priceAdjustment.toFixed(3)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{ textAlign: "center", color: "error.main" }}
                      colSpan={8}
                    >
                      No adjustments found
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
        <Grid sx={{ my: 1 }} item xs={12}>
          <TableContainer>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Rate</TableCell>
                  <TableCell>Base Price</TableCell>
                  <TableCell>Final Price</TableCell>
                  <TableCell>P & I</TableCell>
                </TableRow>
              </TableHead>
              {pricingResult.ratesheets != null &&
              pricingResult.ratesheets.length > 0 ? (
                <TableBody>
                  {pricingResult.ratesheets.map((row, index) => (
                    <TableRow
                      sx={{ bgcolor: index % 2 == 0 ? grey[300] : "" }}
                      key={`ratesheets-${index}`}
                    >
                      <TableCell
                        sx={{
                          color: classStyleHelper.getPositiveOrNegative(
                            row.finalRate
                          ),
                        }}
                      >
                        {row.finalRate?.toFixed(3)}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: classStyleHelper.getPositiveOrNegative(
                            row.basePrice
                          ),
                        }}
                      >
                        {row.basePrice?.toFixed(3)}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: classStyleHelper.getPositiveOrNegative(
                            row.finalPrice
                          ),
                        }}
                      >
                        {row.finalPrice?.toFixed(3)}
                      </TableCell>
                      <TableCell>
                        {convertHelper.toCurrency(
                          mortgageCalculatorHelper.calculateMonthlyPayment(
                            requestModel?.loan?.baseLoan ?? 0,
                            row.finalRate ?? 0,
                            requestModel?.loan?.term ?? 360
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell
                      sx={{ textAlign: "center", color: "error.main" }}
                      colSpan={8}
                    >
                      No ratesheets found
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Grid>
      </div>
    );
  }

  return (
    <>
      <Container>
        {fileDataForm}
        {eligibleLoanTable}
        {optionFieldsForm}
        {pricingResultForm}
        {uploadDialog}
      </Container>
    </>
  );
}
