"use client";

import React, { createContext, useContext } from "react";
import { CountdownConfig } from "@/types/countdown";

const WebCountdownContext = createContext<CountdownConfig | null>(null);

export function WebCountdownProvider({
  children,
  countdown,
}: {
  children: React.ReactNode;
  countdown: CountdownConfig | null;
}) {
  return (
    <WebCountdownContext.Provider value={countdown}>
      {children}
    </WebCountdownContext.Provider>
  );
}

export const useCountdownData = () => useContext(WebCountdownContext);
