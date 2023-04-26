import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, NextApiRequest } from "next";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/slices/counterSlice";
import type { RootState } from "@/store";
import { Container, Chip, Box, Button, Link } from "@mui/material";
import { NextLinkComposed } from "@/src/Link";
import { AxiosRequestConfig } from "axios";
import { ApiHelper } from "@/src/classes/ApiHelper";
import { Content } from "@/src/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.req.cookies["token"]) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const contents: Content[] = [];
  const api = new ApiHelper(`${process.env.PUBLIC_API_URL}`);
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${context.req.cookies["token"]}`,
    },
  };

  const resp = await api.get<any>("api/bulletin-boards", config);

  resp.data.map((item: any) => {
    contents.push({
      id: item.id,
      title: item.attributes.title,
      category: item.attributes.category,
      body: item.attributes.body,
      createdAt: item.attributes.body,
      publishedAt: item.attributes.body,
      updatedAt: item.attributes.body,
    });
  });

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      contents,
    },
  };
};

export default function BBS({ contents }: { contents: Content[] }) {

  const contentsComponent = contents.map((item) => {
    return (
      <div title={item.title} key={item.id}>
        <Box
          sx={{ display: "flex" }}
          to={{ pathname: `/bbs/${item.id}` }}
          component={NextLinkComposed}
        >
          <Chip size="small" label={item.category} />
          <div>{item.title}</div>
        </Box>
      </div>
    );
  });

  return (
    <div>
      <Container>
        <Button>
          <Link href="/bbs/write">글쓰기</Link>
        </Button>
        <h1>This is list</h1>
        {contentsComponent}
      </Container>
    </div>
  );
}
