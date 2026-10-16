"use client";

import { createContext, useContext } from "react";
import { WebCarousel, PromoCard, HeroSectionData } from "@/types/webData";

interface WebDataProviderProps {
  children: React.ReactNode;
  slides: WebCarousel[];
  promos: PromoCard[];
}

const WebCarouselContext = createContext<HeroSectionData>({
  slides: [],
  promos: [],
});

export function WebDataProvider({
  children,
  slides,
  promos,
}: WebDataProviderProps) {
  return (
    <WebCarouselContext.Provider value={{ slides, promos }}>
      {children}
    </WebCarouselContext.Provider>
  );
}

export const useWebData = () => useContext(WebCarouselContext);
