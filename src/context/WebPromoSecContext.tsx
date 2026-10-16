"use client";

import { createContext, useContext } from "react";
import type { PromoSecCard } from "@/types/webData";

interface WebPromoProviderProps {
  children: React.ReactNode;
  promos: PromoSecCard[];
}

const WebPromoSecContext = createContext<PromoSecCard[]>([]);

export function WebPromoProvider({ children, promos }: WebPromoProviderProps) {
  return (
    <WebPromoSecContext.Provider value={promos ?? []}>
      {children}
    </WebPromoSecContext.Provider>
  );
}

export function usePromoSecData() {
  return useContext(WebPromoSecContext);
}
