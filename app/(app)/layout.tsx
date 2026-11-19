import React from "react";
import { EnergyProvider } from "@/context/EnergyContext";
import Shell from "@/components/Shell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <EnergyProvider>
      <Shell>{children}</Shell>
    </EnergyProvider>
  );
}
