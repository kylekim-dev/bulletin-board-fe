import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/slices/counterSlice";
import type { RootState } from "@/store";
import { Container, Chip, Box, Button, Link } from "@mui/material";
import { NextLinkComposed } from "@/src/Link";

export default function Home() {

  return (
    <div>
      <Container>
        <Box 
          sx={{ display: 'flex' }}
          to={{ pathname: `/bbs` }}
          component={NextLinkComposed}
        >
          Go to BBS
        </Box>
      </Container>
    </div>
  );
}
