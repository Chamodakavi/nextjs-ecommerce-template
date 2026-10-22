"use client";

import React from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useSignupState } from "@/hooks/useSignupState";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";

const Signup = () => {
  const { state, setters, actions } = useSignupState();

  return (
    <>
      <Breadcrumb title="Signup" pages={["Signup"]} />

      <section className="overflow-hidden py-12 sm:py-16 lg:py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-6 sm:p-8 lg:p-10">
            <div className="text-center mb-8">
              <h2 className="font-semibold text-2xl sm:text-3xl text-dark mb-2">
                Create an Account
              </h2>
              <p className="text-gray-500 text-sm">
                Enter your details below to start shopping
              </p>
            </div>

            {state.errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm font-medium">
                {state.errorMessage}
              </div>
            )}

            {/* Google Signup Button */}
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={actions.handleGoogleSignup}
                disabled={state.googleLoading || state.loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-md border border-gray-3 bg-gray-1 hover:bg-gray-2 text-dark font-medium transition duration-200 disabled:opacity-60 cursor-pointer"
              >
                {state.googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-dark" />
                ) : (
                  <span className="font-bold text-lg text-blue">G</span>
                )}
                <span>
                  {state.googleLoading
                    ? "Redirecting to Google..."
                    : "Sign Up with Google"}
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-gray-3 w-full"></div>
              <span className="bg-white px-3 text-xs uppercase text-gray-400 font-medium absolute">
                Or
              </span>
            </div>

            {/* Email Signup Form */}
            <form onSubmit={actions.handleEmailSignup}>
              {/* Full Name */}
              <div className="mb-5">
                <label
                  htmlFor="fullName"
                  className="block mb-2.5 font-medium text-dark text-sm"
                >
                  Full Name <span className="text-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    value={state.fullName}
                    onChange={(e) => setters.setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 pl-11 pr-5 text-sm outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Email Address */}
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
                    value={state.email}
                    onChange={(e) => setters.setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 pl-11 pr-5 text-sm outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Password */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2.5 font-medium text-dark text-sm"
                >
                  Password <span className="text-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type={state.showPassword ? "text" : "password"}
                    id="password"
                    value={state.password}
                    onChange={(e) => setters.setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="new-password"
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 pl-11 pr-11 text-sm outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setters.setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
                  >
                    {state.showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2.5 font-medium text-dark text-sm"
                >
                  Re-type Password <span className="text-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type={state.showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={state.confirmPassword}
                    onChange={(e) => setters.setConfirmPassword(e.target.value)}
                    placeholder="Re-type your password"
                    required
                    autoComplete="new-password"
                    className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 pl-11 pr-11 text-sm outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                  />
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() =>
                      setters.setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
                  >
                    {state.showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={state.loading || state.googleLoading}
                className="w-full flex items-center justify-center gap-2 font-medium text-white bg-dark py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue shadow-sm disabled:opacity-70 cursor-pointer"
              >
                {state.loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {state.loading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center mt-6 text-sm text-gray-500">
                Already have an account?
                <Link
                  href="/signin"
                  className="font-medium text-blue hover:underline pl-1.5"
                >
                  Sign in Now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;