"use client";

import React, { createContext, useContext } from "react";
import { Product } from "@/types/product";

const NewArrivalContext = createContext<Product[]>([]);

export function NewArrivalProvider({
  children,
  products,
}: {
  children: React.ReactNode;
  products: Product[];
}) {
  return (
    <NewArrivalContext.Provider value={products}>
      {children}
    </NewArrivalContext.Provider>
  );
}

export const useNewArrivals = () => useContext(NewArrivalContext);
