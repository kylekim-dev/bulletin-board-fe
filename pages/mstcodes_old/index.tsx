import React, { useState, useEffect, useCallback } from "react";
import { GetStaticPaths, GetStaticProps, GetServerSideProps, NextPage, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import Link from "next/link";
import Container from '@mui/material/Container';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import LoadingButton from '@mui/lab/LoadingButton';
import { fontSize } from "@mui/system";
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface SelectItems {
    label: string;
    value: any | null;
}

interface MstCode {
  codeId: string;
  codeGroup: string;
  codeType: string;
  codeValue: string;
  codeName: string;
  displayName: string;
  codeIndex: number | null;
  reference1: string | null;
  reference2: string | null;
  reference3: string | null;
  reference4: string | null;
  reference5: string | null;
  reference6: string | null;
  reference7: string | null;
  reference8: string | null;
  reference9: string | null;
  reference10: string | null;
  excluded: string;
}

const codeGroups = [
  'B',
  'P'
];

const yesOrNo: SelectItems[] = [
  {
    label: 'YES',
    value: 'Y'
  },
  {
    label: 'NO',
    value: 'N'
  }
]

export default function CodeType(props: { codeTypes: MstCode[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  // const [codeType, setCodeType] = useState<string | null>(null);
  const [primaryMstCode, setPrimaryMstCode] = useState<MstCode | null>(null);
  const [updatedMstCode, setUpdatedMstCode] = useState<MstCode | null>(null);
  const [createdMstCode, setCreatedMstCode] = useState<MstCode | null>(null);
  const [mstCodes, setMstCodes] = useState<MstCode[] | null>(null);

  let mstcodeTable = <></>;
  let updateForm = <></>;
  let createForm = <></>;

  useEffect(() => {
  });

  const handleSubmitCreateMstCode = async (event: any, item: MstCode) => {
    event.preventDefault();
    setLoading(true);
    try{
      // const resp = await axios.put(`${process.env.PUBLIC_API_URL}/api/nwapp/mstcode/${item.codeId}`,
      // item,
      // {
      //     headers: {
      //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEwMDA2MTciLCJuYmYiOjE2NzgyMTIxMzIsImV4cCI6MTY3ODgxNjkzMiwiaWF0IjoxNjc4MjEyMTMyLCJpc3MiOiIxMDAwNjE3In0.AcSHda0m8QiStLfr41_cggCgMJaOQnujkdHtet-bccU`,
      //     },
      // }).catch(err => err.response);
  
      console.log("success");
    }
    catch(error){
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  }

  const handleSubmitUpdateMstCode = async (event: any, item: MstCode) => {
    event.preventDefault();
    setLoading(true);
    try{
      const resp = await axios.put(`${process.env.PUBLIC_API_URL}/api/nwapp/mstcode/${item.codeId}`,
      item,
      {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEwMDA2MTciLCJuYmYiOjE2NzgyMTIxMzIsImV4cCI6MTY3ODgxNjkzMiwiaWF0IjoxNjc4MjEyMTMyLCJpc3MiOiIxMDAwNjE3In0.AcSHda0m8QiStLfr41_cggCgMJaOQnujkdHtet-bccU`,
          },
      }).catch(err => err.response);
  
      console.log(resp.data);
    }
    catch(error){
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  }

  const handleCodeTypeChange = async (event: any, selectedMstCode: MstCode | null) => {
    event.preventDefault();
    try{
      setPrimaryMstCode(selectedMstCode);
  
      const resp = await axios.get(`${process.env.PUBLIC_API_URL}/api/nwapp/mstcode/${primaryMstCode?.codeType}`,
      {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEwMDA2MTciLCJuYmYiOjE2NzgyMTIxMzIsImV4cCI6MTY3ODgxNjkzMiwiaWF0IjoxNjc4MjEyMTMyLCJpc3MiOiIxMDAwNjE3In0.AcSHda0m8QiStLfr41_cggCgMJaOQnujkdHtet-bccU`,
          },
      }
      ).catch(err => err.response);
  
      if(resp.status != 200){
        setMstCodes(null);
        throw new Error(resp.data);
      }
  
      setMstCodes(resp.data);
    }
    catch (error){
      alert(error);
    }
  }

  if(createdMstCode != null){
    createForm = 
    <div>
      <form>
        <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5">New Mst Code</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                  label="Code Group"
                  name="codeGroup"
                  select
                  value={createdMstCode.codeGroup}
                  required
                  disabled
                  onChange={(e) => setCreatedMstCode({...createdMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                >
                  {codeGroups.map((v, index) => (
                    <MenuItem key={`${v}-${index}`} value={v}>
                      {v}
                    </MenuItem>
                  ))}
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormLabel id="demo-radio-buttons-group-label" sx={{ p: 0, m: 0, fontSize: 13 }}>Excluded</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                >
                  {
                    yesOrNo.map((x) => (
                      <FormControlLabel key={`yes-or-no-${x.value}`} value={x.value} 
                        label={
                          <Typography fontSize={13}>
                            { x.label }
                          </Typography>
                        }
                        control={
                        <Radio
                        color={x.value == 'Y' ? 'error' : 'success'}
                        checked={createdMstCode.excluded === x.value} 
                        name="excluded"
                        onChange={(e) => setCreatedMstCode({...createdMstCode, [e.target.name]: e.target.value}) }
                        sx={{
                          py: 0,
                          px: 1,
                          '& .MuiSvgIcon-root': {
                            fontSize: 16,
                          },
                        }}
                        />
                      }
                      />
                    ))
                  }
                </RadioGroup>
            </Grid>
            
            <Grid item xs={12}>
                <TextField
                  label="Code Type"
                  name="codeType"
                  value={createdMstCode.codeType}
                  required
                  onChange={(e) => setCreatedMstCode({...createdMstCode, [e.target.name]: e.target.value}) }
                  disabled
                  fullWidth
                  size="small"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  name="codeName"
                  value={createdMstCode.codeName}
                  required
                  onChange={(e) => setCreatedMstCode({...createdMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                  label="Display Name"
                  name="displayName"
                  value={createdMstCode.displayName}
                  required
                  onChange={(e) => setCreatedMstCode({...createdMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                />
            </Grid>
            
            <Grid item xs={12} md={6}>
                <TextField
                  label="Code Value"
                  name="codeValue"
                  value={createdMstCode.codeValue}
                  required
                  onChange={(e) => setCreatedMstCode({...createdMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                />
            </Grid>
            
            <Grid item xs={12} md={6}>
                <TextField
                  label="Display Order"
                  name="codeIndex"
                  value={createdMstCode.codeIndex}
                  required
                  onChange={(e) => setCreatedMstCode({...createdMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                />
            </Grid>
        </Grid>
      </form>
      <LoadingButton
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        loading={loading}
        onClick={(e) => handleSubmitCreateMstCode(e, createdMstCode)}
      >
        Add
      </LoadingButton>
    </div>
  }
  

  if(updatedMstCode != null){
    updateForm = 
    <div>
      <form>
        <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h5">Update</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <TextField
                  label="Code Group"
                  name="codeGroup"
                  select
                  value={updatedMstCode.codeGroup}
                  required
                  disabled
                  onChange={(e) => setUpdatedMstCode({...updatedMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                >
                  {codeGroups.map((v, index) => (
                    <MenuItem key={`${v}-${index}`} value={v}>
                      {v}
                    </MenuItem>
                  ))}
                </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
                <FormLabel id="demo-radio-buttons-group-label" sx={{ p: 0, m: 0, fontSize: 13 }}>Excluded</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                >
                  {
                    yesOrNo.map((x) => (
                      <FormControlLabel key={`yes-or-no-${x.value}`} value={x.value} 
                        label={
                          <Typography fontSize={13}>
                            { x.label }
                          </Typography>
                        }
                        control={
                        <Radio
                        color={x.value == 'Y' ? 'error' : 'success'}
                        checked={updatedMstCode.excluded === x.value} 
                        name="excluded"
                        onChange={(e) => setUpdatedMstCode({...updatedMstCode, [e.target.name]: e.target.value}) }
                        sx={{
                          py: 0,
                          px: 1,
                          '& .MuiSvgIcon-root': {
                            fontSize: 16,
                          },
                        }}
                        />
                      }
                      />
                    ))
                  }
                </RadioGroup>
            </Grid>
            
            <Grid item xs={12}>
                <TextField
                  label="Code Type"
                  name="codeType"
                  value={updatedMstCode.codeType}
                  required
                  onChange={(e) => setUpdatedMstCode({...updatedMstCode, [e.target.name]: e.target.value}) }
                  disabled
                  fullWidth
                  size="small"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                  label="Name"
                  name="codeName"
                  value={updatedMstCode.codeName}
                  required
                  onChange={(e) => setUpdatedMstCode({...updatedMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <TextField
                  label="Display Name"
                  name="displayName"
                  value={updatedMstCode.displayName}
                  required
                  onChange={(e) => setUpdatedMstCode({...updatedMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                />
            </Grid>
            
            <Grid item xs={12} md={6}>
                <TextField
                  label="Code Value"
                  name="codeValue"
                  value={updatedMstCode.codeValue}
                  required
                  onChange={(e) => setUpdatedMstCode({...updatedMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                />
            </Grid>
            
            <Grid item xs={12} md={6}>
                <TextField
                  label="Display Order"
                  name="codeIndex"
                  value={updatedMstCode.codeIndex}
                  required
                  onChange={(e) => setUpdatedMstCode({...updatedMstCode, [e.target.name]: e.target.value}) }
                  fullWidth
                  size="small"
                />
            </Grid>
        </Grid>
      </form>
      <LoadingButton
        fullWidth
        variant="contained"
        color="secondary"
        sx={{ mt: 2 }}
        loading={loading}
        onClick={(e) => handleSubmitUpdateMstCode(e, updatedMstCode)}
      >
        Update
      </LoadingButton>
    </div>
  }

  if(mstCodes != null){
    mstcodeTable = 
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="left">Code Name</TableCell>
              <TableCell align="left">Code Value</TableCell>
              <TableCell align="left">Display Name</TableCell>
              <TableCell align="left">Reference1</TableCell>
            </TableRow>
          </TableHead>
          <TableBody color='primary'>
            {mstCodes.map((row, index) => (
              <TableRow
                key={`${index}-${row.codeValue}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover
                selected={row.codeId == updatedMstCode?.codeId}
                onClick={() => 
                  {
                    setUpdatedMstCode(row);
                    setCreatedMstCode(null);
                  }
                }
              >
                <TableCell align="left">{row.excluded}</TableCell>
                <TableCell component="th" scope="row">
                  {row.codeName}
                </TableCell>
                <TableCell align="left">{row.codeValue}</TableCell>
                <TableCell align="left">{row.displayName}</TableCell>
                <TableCell align="left">{row.reference1}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} align="center">
                <LoadingButton
                  onClick={() => {
                    setUpdatedMstCode(null);
                    setCreatedMstCode({...createdMstCode, codeGroup: primaryMstCode?.codeGroup, codeType: primaryMstCode?.codeValue} as MstCode);
                  }}
                >
                  + Add a new Mst Code
                </LoadingButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  }

  return (
    <>
      <Head>
        <title>Login | Company</title>
        <meta name="description" content="Mst Code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Container>
        {/* Calling the Autocomplete component and updating its state features */}
        <Autocomplete
          id="manageable-states-demo"
          onChange={handleCodeTypeChange}
          options={props.codeTypes}
          getOptionLabel={option => `[${option.codeGroup}] - ${option.displayName}`}
          isOptionEqualToValue={(option, item) => option.codeValue === item.codeValue}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Manage State" />}
          fullWidth
        />
        { mstcodeTable }
        { createForm }
        { updateForm }
      </Container>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async () => {
    const codetype = "00000";
    const resp = await axios.get(`${process.env.PUBLIC_API_URL}/api/nwapp/mstcode/${codetype}`,
    {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEwMDA2MTciLCJuYmYiOjE2NzgyMTIxMzIsImV4cCI6MTY3ODgxNjkzMiwiaWF0IjoxNjc4MjEyMTMyLCJpc3MiOiIxMDAwNjE3In0.AcSHda0m8QiStLfr41_cggCgMJaOQnujkdHtet-bccU`,
        },
    }
    ).catch(err => err.response);

    if(resp.status != 200){
      return { notFound: true };
    }

    const codeTypes = resp.data;

    return { props: {codeTypes} };
};