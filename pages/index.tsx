import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '@/slices/counterSlice';
import type { RootState } from '@/store';;
import Container from "@mui/material/Container";
import Finder from "@/pages/pricing/finder";

export default function Home() {
  const [open, setOpen] = useState<boolean>(true);
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    checkLoggedIn();
  });

  const checkLoggedIn = () => {
    if (localStorage.getItem('token') === null) {
      router.push("/auth/login");
    }
  }

  return (
    <div>
      <Finder />
    </div>
  );
}