"use client";

import React, { createContext, useContext } from "react";
import { Product } from "@/types/product";

const ProductContext = createContext<Product[]>([]);

export function ProductProvider({
  children,
  products,
}: {
  children: React.ReactNode;
  products: Product[];
}) {
  return (
    <ProductContext.Provider value={products}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
