"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, UserRound } from "lucide-react";

function Field({ label, icon, ph, pw }: { label: string; icon: React.ReactNode; ph: string; pw?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label>{label}</label>
      <div className="input">
        {icon}
        <input type={pw && !show ? "password" : "text"} placeholder={ph} />
        {pw && (
          <button type="button" onClick={() => setShow(!show)} aria-label="toggle password">
            {show ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const login = mode === "login";
  return (
    <div className="auth-bg">
      <div className="auth-frame">
        <section className="hero">
          <h1>Mulai Langkah Hemat Hari Ini.</h1>
          <p>Ubah kebiasaan boros energi menjadi efisiensi nyata tanpa perlu instalasi perangkat keras yang rumit</p>
        </section>
        <section className="auth-card">
          <h2>{login ? "Log In To Your Account" : "Create Your Account"}</h2>
          {!login && <Field label="Full Name" icon={<UserRound size={24} />} ph="Enter Your Full Name" />}
          <Field label="Email Adrress" icon={<Mail size={24} />} ph="Enter Your Email" />
          <Field label="Password" icon={<Lock size={24} />} ph="Enter Your Password" pw />
          {!login && <Field label="Password" icon={<Lock size={24} />} ph="Confirm Your Password" pw />}
          {login && <a className="forgot">Forgot Your Password?</a>}
          <button className="btn-dark" onClick={() => router.push("/dashboard")}>{login ? "Login" : "Create Account"}</button>
          <div className="or"><i /> <span>Or</span> <i /></div>
          <button className="btn-google" onClick={() => router.push("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
            Continue with Google
          </button>
          <p className="switch">
            {login ? <>Don’t have an account? <Link href="/register">Sign in</Link></> : <>Already have an account? <Link href="/login">Login</Link></>}
          </p>
        </section>
      </div>
    </div>
  );
}
