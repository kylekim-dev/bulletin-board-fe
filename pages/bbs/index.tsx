import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/slices/counterSlice";
import type { RootState } from "@/store";
import { Container, Chip, Box, Button, Link } from "@mui/material";
import { NextLinkComposed } from "@/src/Link";
import { AxiosRequestConfig } from "axios";
import { ApiHelper } from "@/src/classes/ApiHelper";
import { Content } from "@/src/types";

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const contents: Content[] = [];
  const api = new ApiHelper(`${process.env.PUBLIC_API_URL}`);
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer fcac2eba022483561c50b82fa39089e9da9156d5f9dd928ce2ec4a9fbc7b89b90c940c3911ab466108d9a15f7a006b1a383e705f9150d38688c4e467bcf93bfb60b893dbf528eaa0eac2d9669feb408924af2cbd07fb1072bc99491bfef38fa8ba47d80daa4322590c7cec0e2b6de198cdaf1f38a6fc5e361e806823a47ee099`,
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
