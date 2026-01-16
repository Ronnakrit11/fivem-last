"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signInSocial, signUp } from "@/lib/actions/auth-actions";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "sonner";
import { useBalance } from "@/app/contexts/BalanceContext";

export default function AuthClientPage() {
  const router = useRouter();
  const { refreshBalance } = useBalance();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  // Get callback URL from search params (set by middleware)

  const handleSocialAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError("");

    try {
      // Get the redirect URL from sessionStorage or default to /dashboard
      const redirectTo = typeof window !== 'undefined' 
        ? sessionStorage.getItem('redirectAfterLogin') || "/dashboard"
        : "/dashboard";
      
      // Pass callbackURL to preserve redirect intention
      await signInSocial(provider, `${redirectTo}?login=success`);
    } catch (err) {
      setError(
        `เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย ${provider}: ${
          err instanceof Error ? err.message : "ข้อผิดพลาดที่ไม่ทราบสาเหตุ"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isSignIn) {
        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
        const result = await signIn(email, password, redirectTo);
        if (!result.user) {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } else {
          // Sign in สำเร็จ - clear old balance และ แสดง toast และ redirect
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('user_balance');
            sessionStorage.removeItem('user_balance_timestamp');
          }
          toast.success("เข้าสู่ระบบสำเร็จ");
          setTimeout(async () => {
            await refreshBalance();
            // Get the redirect URL from sessionStorage or default to /dashboard
            const redirectTo = typeof window !== 'undefined' 
              ? sessionStorage.getItem('redirectAfterLogin') || "/dashboard"
              : "/dashboard";
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('redirectAfterLogin');
            }
            router.push(redirectTo);
            router.refresh();
          }, 1000);
        }
      } else {
        // Verify Turnstile token for sign up
        if (!turnstileToken) {
          setError("กรุณายืนยันว่าคุณไม่ใช่บอท");
          setIsLoading(false);
          return;
        }

        // Verify turnstile token with backend
        const verifyResponse = await fetch("/api/auth/verify-turnstile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: turnstileToken }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok || !verifyData.success) {
          setError("การยืนยันล้มเหลว กรุณาลองใหม่อีกครั้ง");
          setTurnstileToken("");
          setIsLoading(false);
          return;
        }

        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
        const result = await signUp(email, password, name, redirectTo);
        if (!result.user) {
          setError("สร้างบัญชีไม่สำเร็จ");
        } else {
          // Sign up สำเร็จ - clear old balance และ แสดง toast และ redirect
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('user_balance');
            sessionStorage.removeItem('user_balance_timestamp');
          }
          toast.success("สมัครสมาชิกสำเร็จ");
          setTimeout(async () => {
            await refreshBalance();
            // Get the redirect URL from sessionStorage or default to /dashboard
            const redirectTo = typeof window !== 'undefined' 
              ? sessionStorage.getItem('redirectAfterLogin') || "/dashboard"
              : "/dashboard";
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('redirectAfterLogin');
            }
            router.push(redirectTo);
            router.refresh();
          }, 1000);
        }
      }
    } catch (err) {
      setError(
        `ข้อผิดพลาดในการยืนยันตัวตน: ${
          err instanceof Error ? err.message : "ข้อผิดพลาดที่ไม่ทราบสาเหตุ"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(600px_400px_at_50%_0%,rgba(99,102,241,0.28),transparent_60%),radial-gradient(520px_360px_at_50%_100%,rgba(147,51,234,0.28),transparent_60%)] opacity-50"></div>
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)];background-size:24px_24px,24px_24px;background-position:-1px_-1px; opacity-10"></div>
      </div>
      <div className="relative flex items-center justify-center p-4 pt-20">
        <div className="max-w-md w-full space-y-8 rounded-3xl p-6 md:p-8 bg-white/10 backdrop-blur-xl border border-white/10 ring-1 ring-white/5 shadow-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              {isSignIn ? "ยินดีต้อนรับกลับมา" : "สร้างบัญชี"}
            </h1>
            <p className="text-gray-400">
              {isSignIn
                ? "เข้าสู่ระบบเพื่อดำเนินการต่อ"
                : "สมัครสมาชิกเพื่อเริ่มต้นใช้งาน"}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg p-4 bg-red-500/10 border border-red-500/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Social Authentication */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialAuth("google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl shadow-sm text-gray-200 bg-white/10 hover:bg-white/15 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              เข้าสู่ระบบด้วย Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-400">
                หรือเข้าสู่ระบบด้วย
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isSignIn && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  ชื่อ-นามสกุล
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required={!isSignIn}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-colors"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                อีเมล
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-colors"
                placeholder="กรอกอีเมล"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                รหัสผ่าน
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isSignIn ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-colors"
                placeholder="กรอกรหัสผ่าน"
              />
            </div>

            {/* Turnstile for Sign Up only */}
            {!isSignIn && (
              <div className="flex justify-center">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => {
                    setTurnstileToken("");
                    setError("เกิดข้อผิดพลาดในการโหลด Turnstile");
                  }}
                  onExpire={() => setTurnstileToken("")}
                  options={{
                    theme: "dark"
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isSignIn && !turnstileToken)}
              className="w-full flex justify-center py-3 px-4 rounded-xl shadow-sm text-sm font-medium text-gray-100 bg-white/10 hover:bg-white/15 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isSignIn ? "กำลังเข้าสู่ระบบ..." : "กำลังสร้างบัญชี..."}
                </div>
              ) : isSignIn ? (
                "เข้าสู่ระบบ"
              ) : (
                "สร้างบัญชี"
              )}
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              {isSignIn ? "ยังไม่มีบัญชี?" : "มีบัญชีแล้ว?"}
              {" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setError("");
                  setTurnstileToken("");
                }}
                disabled={isLoading}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSignIn ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
