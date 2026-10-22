import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, getSupabaseBrowserClient } from "@/lib/supabase/auth";

export function useSignupState() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Inside src/hooks/useSignupState.ts

    const handleEmailSignup = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setErrorMessage(null);

            if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
                setErrorMessage("Please fill in all required fields.");
                return;
            }

            if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match.");
                return;
            }

            setLoading(true);

            try {
                const supabase = getSupabaseBrowserClient();
                const { data, error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: {
                        data: {
                            full_name: fullName.trim(),
                        },
                    },
                });

                if (error) throw error;

                // If user was created successfully, sign them in directly
                if (data.user) {
                    const { error: signInError } = await supabase.auth.signInWithPassword({
                        email: email.trim(),
                        password,
                    });

                    if (signInError) throw signInError;

                    router.push("/");
                    router.refresh();
                }
            } catch (err: any) {
                setErrorMessage(
                    err.message || "An unexpected error occurred during signup."
                );
            } finally {
                setLoading(false);
            }
        },
        [fullName, email, password, confirmPassword, router]
    );

    const handleGoogleSignup = useCallback(async () => {
        setErrorMessage(null);
        setGoogleLoading(true);

        try {
            const origin =
                typeof window !== "undefined" && window.location.origin
                    ? window.location.origin
                    : process.env.NEXT_PUBLIC_SITE_URL || "";

            await signInWithGoogle(`${origin}/auth/callback`);
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to initiate Google sign up.");
            setGoogleLoading(false);
        }
    }, []);

    return {
        state: {
            fullName,
            email,
            password,
            confirmPassword,
            showPassword,
            showConfirmPassword,
            loading,
            googleLoading,
            errorMessage,
        },
        setters: {
            setFullName,
            setEmail,
            setPassword,
            setConfirmPassword,
            setShowPassword,
            setShowConfirmPassword,
        },
        actions: {
            handleEmailSignup,
            handleGoogleSignup,
        },
    };
}