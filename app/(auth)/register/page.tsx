import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Create Your Account - WattRoom",
  description: "Daftar akun baru WattRoom untuk mulai langkah hemat energi hari ini.",
};

export default function Register() {
  return <AuthForm mode="register" />;
}
