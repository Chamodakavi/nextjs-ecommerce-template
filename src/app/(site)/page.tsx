import Home from "@/components/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextCommerce | Nextjs E-commerce template",
  description: "This is Home for NextCommerce Template",
  // other metadata
};

export default async function HomePage() {
  return (
    <>
      <Home />
    </>
  );
}
// test