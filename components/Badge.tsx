import React from "react";
import { EnergyStatus } from "@/lib/energyService";

interface BadgeProps {
  status: EnergyStatus;
  size?: "sm" | "md" | "lg";
}

export default function Badge({ status, size = "md" }: BadgeProps) {
  const getColors = () => {
    switch (status) {
      case "AMAN":
        return "bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/40";
      case "SIAGA":
        return "bg-[#F59E0B]/20 text-[#B45309] border border-[#F59E0B]/50";
      case "OVER LIMIT":
        return "bg-[#DC2626] text-white border border-[#B91C1C]";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-0.5 text-xs font-semibold rounded-full";
      case "lg":
        return "px-4 py-1.5 text-base font-bold rounded-full";
      case "md":
      default:
        return "px-3 py-1 text-sm font-bold rounded-full";
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center tracking-wide uppercase transition-colors ${getColors()} ${getSizeClasses()}`}
      style={{
        backgroundColor:
          status === "AMAN"
            ? "#dcfce7"
            : status === "SIAGA"
            ? "#fef3c7"
            : "#DC2626",
        color:
          status === "AMAN"
            ? "#166534"
            : status === "SIAGA"
            ? "#92400e"
            : "#ffffff",
        borderColor:
          status === "AMAN"
            ? "#16a34a"
            : status === "SIAGA"
            ? "#f59e0b"
            : "#dc2626",
      }}
    >
      {status}
    </span>
  );
}
