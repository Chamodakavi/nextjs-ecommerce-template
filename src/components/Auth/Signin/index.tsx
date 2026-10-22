"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase/auth";

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirect") || "/";

  // Email & Password Login Handler
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmail(email, password);
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login Handler
  const handleGoogleLogin = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);

    try {
      // Dynamically determine redirect URL based on current host environment (Vercel or Localhost)
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || "";

      const redirectUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(
        redirectTo,
      )}`;

      await signInWithGoogle(redirectUrl);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate Google login.");
      setGoogleLoading(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-2">
      <div className="max-w-[570px] w-full mx-auto px-4">
        <div className="bg-white rounded-xl shadow-1 p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-dark mb-2">
              Sign In to Premier Auto Hub
            </h2>
            <p className="text-gray-500 text-sm">
              Access your orders, saved items, and account preferences.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-md border border-gray-3 bg-gray-1 hover:bg-gray-2 text-dark font-medium transition duration-200 disabled:opacity-60 cursor-pointer mb-6"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-dark" />
            ) : (
              <span className="font-bold text-lg text-blue">G</span>
            )}
            <span>
              {googleLoading
                ? "Redirecting to Google..."
                : "Sign in with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-3 w-full"></div>
            <span className="bg-white px-3 text-xs uppercase text-gray-400 font-medium absolute">
              or sign in with email
            </span>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleEmailLogin}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2.5 font-medium text-dark text-sm"
              >
                Email Address <span className="text-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 pl-11 pr-5 text-sm outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
                <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-2.5">
                <label
                  htmlFor="password"
                  className="font-medium text-dark text-sm"
                >
                  Password <span className="text-red">*</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-blue hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 pl-11 pr-11 text-sm outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
                <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full inline-flex items-center justify-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark shadow-sm disabled:opacity-70 cursor-pointer mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Signin() {
  return (
    <>
      <Breadcrumb title="Sign In" pages={["Sign In"]} />
      <Suspense
        fallback={
          <div className="py-20 text-center text-gray-500">
            Loading sign in page...
          </div>
        }
      >
        <SigninForm />
      </Suspense>
    </>
  );
}
