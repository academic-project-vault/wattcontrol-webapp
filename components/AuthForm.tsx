"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, UserRound, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  ph: string;
  type?: string;
  pw?: boolean;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

function Field({ label, icon, ph, pw, name, value, onChange, required = true }: FieldProps) {
  const [show, setShow] = useState(false);
  
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <div className="input">
        <span className="field-icon">{icon}</span>
        <input
          id={name}
          name={name}
          type={pw && !show ? "password" : "text"}
          placeholder={ph}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={pw ? "current-password" : name === "email" ? "email" : "name"}
        />
        {pw && (
          <button
            type="button"
            className="pw-toggle"
            onClick={() => setShow(!show)}
            aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
            tabIndex={-1}
          >
            {show ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const login = mode === "login";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.email.trim()) {
      setError("Silakan masukkan alamat email Anda.");
      return;
    }

    if (!formData.password) {
      setError("Silakan masukkan kata sandi Anda.");
      return;
    }

    if (!login) {
      if (!formData.fullName.trim()) {
        setError("Silakan masukkan nama lengkap Anda.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Kata sandi minimal 6 karakter.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Konfirmasi kata sandi tidak cocok.");
        return;
      }
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      try {
        const userData = {
          name: login ? "Ibu Kos (Admin)" : formData.fullName,
          email: formData.email,
          role: "Admin Kos",
          isLoggedIn: true,
        };
        localStorage.setItem("wattcontrol_user", JSON.stringify(userData));
      } catch (err) {
        // LocalStorage fallback
      }

      setSuccess(login ? "Login berhasil! Mengalihkan..." : "Akun berhasil dibuat! Mengalihkan...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    }, 600);
  };

  const handleGoogleAuth = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      try {
        const userData = {
          name: "Ibu Kos (Admin)",
          email: "admin@wattroom.com",
          role: "Admin Kos",
          isLoggedIn: true,
        };
        localStorage.setItem("wattcontrol_user", JSON.stringify(userData));
      } catch (err) {}
      router.push("/dashboard");
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotModal(false);
      setForgotSent(false);
      setForgotEmail("");
      setSuccess("Link reset kata sandi telah dikirim ke email Anda.");
    }, 1500);
  };

  return (
    <div className="auth-bg">
      <div className="auth-frame">
        {/* Left Hero Section */}
        <section className="hero">
          <h1>Mulai Langkah Hemat Hari Ini.</h1>
          <p>
            Ubah kebiasaan boros energi menjadi efisiensi nyata tanpa perlu instalasi perangkat keras yang rumit
          </p>
        </section>

        {/* Right Frosted Card */}
        <section className={`auth-card ${login ? "auth-card-login" : "auth-card-register"}`}>
          <h2>{login ? "Log In To Your Account" : "Create Your Account"}</h2>

          {error && (
            <div className="auth-alert error">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-alert success">
              <CheckCircle2 size={16} className="flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {!login && (
              <Field
                label="Full Name"
                icon={<UserRound size={20} />}
                ph="Enter Your Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            )}

            <Field
              label="Email Adrress"
              icon={<Mail size={20} />}
              ph="Enter Your Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Field
              label="Password"
              icon={<Lock size={20} />}
              ph="Enter Your Password"
              name="password"
              pw
              value={formData.password}
              onChange={handleChange}
            />

            {!login && (
              <Field
                label="Password"
                icon={<Lock size={20} />}
                ph="Confirm Your Password"
                name="confirmPassword"
                pw
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            )}

            {login && (
              <button
                type="button"
                className="forgot"
                onClick={() => {
                  setForgotEmail(formData.email);
                  setForgotModal(true);
                }}
              >
                Forgot Your Password?
              </button>
            )}

            <button type="submit" className="btn-dark" disabled={loading || googleLoading}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : login ? (
                "Login"
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="or">
            <i /> <span>Or</span> <i />
          </div>

          <button
            type="button"
            className="btn-google"
            onClick={handleGoogleAuth}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin text-gray-600" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          <p className="switch">
            {login ? (
              <>
                Don’t have an account? <Link href="/register">Sign in</Link>
              </>
            ) : (
              <>
                Already have an account? <Link href="/login">Login</Link>
              </>
            )}
          </p>
        </section>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-scaleUp">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reset Kata Sandi</h3>
            <p className="text-sm text-gray-600 mb-4">
              Masukkan alamat email Anda untuk menerima tautan pemulihan kata sandi.
            </p>
            {forgotSent ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} />
                <span>Link berhasil dikirim! Silakan periksa inbox Anda.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#353A3E]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setForgotModal(false)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#353A3E] hover:bg-gray-800 rounded-xl"
                  >
                    Kirim Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
