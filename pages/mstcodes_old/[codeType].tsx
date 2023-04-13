import React, { useState, useEffect, useCallback } from "react";
import { GetStaticPaths, GetStaticProps, GetServerSideProps, NextPage, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import Link from "next/link";
interface MasterCode {
  codeId: string;
  codeGroup: string;
  codeIndex: number;
  codeName: string;
  codeType: string;
  codeValue: string;
  displayName: string;
  excluded: string;
  reference1: string;
}

export default function CodeType(props: { mstcodes: MasterCode[] }) {
  const router = useRouter();
  const query = router.query;
  const [mstcodes, setMstCodes] = useState<MasterCode[]>(props.mstcodes);

  useEffect(() => {
  });

  return (
    <>
      <Head>
        <title>Login | Company</title>
        <meta name="description" content="Mst Code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ul>
        {
          mstcodes.map((x) => (
            <li key={x.codeId}>{ x.codeType } { x.codeValue }</li>
          ))
        }
      </ul>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query;

    const resp = await axios.get(`${process.env.PUBLIC_API_URL}/api/nwapp/mstcode/${query.codeType}`,
    {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEwMDA2MTciLCJuYmYiOjE2NzgyMTIxMzIsImV4cCI6MTY3ODgxNjkzMiwiaWF0IjoxNjc4MjEyMTMyLCJpc3MiOiIxMDAwNjE3In0.AcSHda0m8QiStLfr41_cggCgMJaOQnujkdHtet-bccU`,
        },
      }
    ).catch(err => err.response);


    if(resp.status != 200){
      return { notFound: true };
    }
    const mstcodes = resp.data;

    return { props: {mstcodes} };
};