import { createBrowserClient } from "@supabase/ssr";

/**
 * Lazily gets or instantiates the Supabase Browser Client.
 * Throws a clear error if environmental variables are missing.
 */
export const getSupabaseBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local",
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

/**
 * Initiates Google OAuth Sign In flow
 */
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = getSupabaseBrowserClient();

  // Always prefer the browser's active window origin (e.g. https://nextjs-ecommerce-template-lilac.vercel.app)
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : process.env.NEXT_PUBLIC_API_URL ||
        "https://nextjs-ecommerce-template-lilac.vercel.app";

  const targetRedirect = redirectTo || `${origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: targetRedirect,
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Signs in user with Email and Password
 */
export async function signInWithEmail(email: string, pass: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) throw error;
  return data;
}

/**
 * Signs out current authenticated user
 */
export async function signOutUser() {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
