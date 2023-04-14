import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/slices/counterSlice";
import type { RootState } from "@/store";
import { Container, Chip, Box, Button, Link } from "@mui/material";
import { NextLinkComposed } from "@/src/Link";

// http://imean.com/
interface Content {
  id: number;
  title: string;
  category: string;
  body: string;
}

const contents: Content[] = [
  {
    id: 1,
    title: "title1 aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    category: "category1",
    body: "body1",
  },
  {
    id: 2,
    title: "title2",
    category: "category2",
    body: "body2",
  },
];

export default function Home() {
  const [profile, setProfile] = useState<Content[]>(contents);
  const [value, setValue] = useState<string>('');

  const temps = profile.map((item) => {
    return (
      <div title={item.title} key={item.id}>
        <Box 
          sx={{ display: 'flex' }}
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
        Hello
      </Container>
    </div>
  );
}
