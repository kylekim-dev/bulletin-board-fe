import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { resetUser } from "@/slices/userSlice";
import { useDispatch } from "react-redux";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    router.push("/auth/login");
  }

  return <>logout...</>;
}
