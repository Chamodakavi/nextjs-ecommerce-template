import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmail, signInWithGoogle } from "@/lib/supabase/auth";

export function useSigninState() {
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
    const handleEmailLogin = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setErrorMessage(null);

            if (!email.trim() || !password) {
                setErrorMessage("Please enter both email and password.");
                return;
            }

            setLoading(true);

            try {
                await signInWithEmail(email.trim(), password);
                router.push(redirectTo);
                router.refresh();
            } catch (err: any) {
                setErrorMessage(
                    err?.message || "Invalid login credentials. Please check your email and password."
                );
            } finally {
                setLoading(false);
            }
        },
        [email, password, redirectTo, router]
    );

    // Google OAuth Login Handler
    const handleGoogleLogin = useCallback(async () => {
        setErrorMessage(null);
        setGoogleLoading(true);

        try {
            const origin =
                typeof window !== "undefined" && window.location.origin
                    ? window.location.origin
                    : process.env.NEXT_PUBLIC_SITE_URL || "";

            const redirectUrl = `${origin}/auth/callback?redirect=${encodeURIComponent(
                redirectTo
            )}`;

            await signInWithGoogle(redirectUrl);
        } catch (err: any) {
            setErrorMessage(err?.message || "Failed to initiate Google login.");
            setGoogleLoading(false);
        }
    }, [redirectTo]);

    return {
        state: {
            email,
            password,
            showPassword,
            loading,
            googleLoading,
            errorMessage,
        },
        setters: {
            setEmail,
            setPassword,
            setShowPassword,
        },
        actions: {
            handleEmailLogin,
            handleGoogleLogin,
        },
    };
}