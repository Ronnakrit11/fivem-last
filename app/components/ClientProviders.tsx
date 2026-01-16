"use client";

import { BalanceProvider } from "@/app/contexts/BalanceContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function ClientProviders({ 
  children
}: { 
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      <BalanceProvider>
        {children}
        <Toaster position="bottom-right" richColors />
      </BalanceProvider>
    </ThemeProvider>
  );
}
