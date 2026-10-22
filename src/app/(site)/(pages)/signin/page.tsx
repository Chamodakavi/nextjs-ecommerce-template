import Signin from "@/components/Auth/Signin";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Premier Auto Hub",
  description:
    "Sign in to your Premier Auto Hub account to manage orders and settings.",
};

const SigninPage = () => {
  return (
    <main>
      <Signin />
    </main>
  );
};

export default SigninPage;
