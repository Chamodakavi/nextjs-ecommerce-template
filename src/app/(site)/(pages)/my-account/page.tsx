import MyAccount from "@/components/MyAccount";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Premier Auto Hub",
  description:
    "Manage your orders, shipping addresses, and account details on Premier Auto Hub.",
};

const MyAccountPage = () => {
  return (
    <main>
      <MyAccount />
    </main>
  );
};

export default MyAccountPage;
