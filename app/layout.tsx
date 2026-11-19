import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WattRoom - Virtual Energy Metering & Automatic Billing",
  description: "Aplikasi manajemen konsumsi listrik rumah kos & penagihan denda otomatis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
