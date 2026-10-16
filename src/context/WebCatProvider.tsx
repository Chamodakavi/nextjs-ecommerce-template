"use client";

import { createContext, useContext } from "react";
import { GeneralCat } from "@/types/catData";

interface WebCatProviderProps {
  children: React.ReactNode;
  categories: GeneralCat[];
}

const WebCatContext = createContext<GeneralCat[]>([]);

export function WebCatProvider({ children, categories }: WebCatProviderProps) {
  return (
    <WebCatContext.Provider value={categories}>
      {children}
    </WebCatContext.Provider>
  );
}

export const useCatData = () => useContext(WebCatContext);
