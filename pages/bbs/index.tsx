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

export default function BBS() {
  const [contents, setContents] = useState<Content[]>([]);

    useEffect(() => {
        // const fetchData = async () => {
        //     const result = await fetch('http://localhost:3000/api/bbs')
        //     const json = await result.json()
        //     setContents(json)
        // }
        // fetchData()
        setContents(JSON.parse(localStorage.getItem('contents123') || '[]'));
    }, [])

  const temps = contents.map((item) => {
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
        <h1>This is list</h1>
        { temps }
      </Container>
    </div>
  );
}
