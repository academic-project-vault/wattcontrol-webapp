import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log In To Your Account - WattRoom",
  description: "Masuk ke akun WattRoom untuk memantau konsumsi energi dan penagihan otomatis kos.",
};

export default function Login() {
  return <AuthForm mode="login" />;
}
