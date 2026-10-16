"use client";

import { createContext, useContext } from "react";
import { PromoBannersData } from "@/types/webData";

const WebPromoSecContext = createContext<PromoBannersData>({
  bigBanner: undefined,
  smallBanners: [],
});

export function WebPromoProvider({
  children,
  promos,
}: {
  children: React.ReactNode;
  promos: PromoBannersData;
}) {
  return (
    <WebPromoSecContext.Provider value={promos}>
      {children}
    </WebPromoSecContext.Provider>
  );
}

export const usePromoSecData = () => useContext(WebPromoSecContext);
