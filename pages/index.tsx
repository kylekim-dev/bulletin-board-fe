import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/slices/counterSlice";
import type { RootState } from "@/store";
import { Container, Chip, Box, Button, Link } from "@mui/material";
import { NextLinkComposed } from "@/src/Link";
import { setCookie } from "cookies-next";

export default function Home() {

  // useEffect(() => {
  //   setCookie("token", "99dbb60e9bf750bb048db40eba0ce280473a565c2549c1cf3f25f501ecdcfc5c801d9fbc22392704c23fb5d40589fe86780ca9f5f0a334e8756477e81917bddc1debf2562e2372217d8c5bd06b7fe6d51a2ff9798c5e0e867f6f632b172ad6ac1a05e29c4e0c130e9c03cd5e00e5cf266554a27ef59331ea10437790844ed15b");
  // }, []);

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
