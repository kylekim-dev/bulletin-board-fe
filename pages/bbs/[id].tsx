import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/slices/counterSlice";
import type { RootState } from "@/store";
import { Container, Chip, Box, Button, Link } from "@mui/material";
import { NextLinkComposed } from "@/src/Link";
import { Content } from "@/src/types";

export default function BBSDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState<Content>();

    useEffect(() => {
        const data = localStorage.getItem('contents123') || null;
        if(!!data){
            const contents = JSON.parse(data);
            const content = contents.find((item: Content) => item.id === Number(id));
            setContent(content);
        }
    }, [id]);

  return (
    <div>
      <Container>
        {<div dangerouslySetInnerHTML={{ __html: content?.body ?? '' }}></div>}
      </Container>
    </div>
  );
}
