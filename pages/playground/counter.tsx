import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { decrement, increment } from "@/slices/counterSlice";
import type { RootState } from "@/store";
import Container from "@mui/material/Container";

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  useEffect(() => {});

  return (
    <>
      <Container>
        <h1>Dashboard </h1>

        <div>Click me!</div>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
        <div>Count: {count}</div>
      </Container>
    </>
  );
}
