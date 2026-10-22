"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/auth";
import { syncReduxCartToSupabase } from "@/lib/supabase/cartSync";
import { store } from "@/redux/store";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // Helper to fetch user profile & sync Redux cart with Supabase
    const loadUserDataAndSync = async (userId: string) => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (data) setProfile(data);

        // Sync local Redux cart with Supabase database cart
        await syncReduxCartToSupabase(userId);
      } catch (err) {
        console.error("Error loading profile or syncing cart:", err);
      }
    };

    // Check active session on initial mount
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        loadUserDataAndSync(data.user.id);
      }
      setLoading(false);
    });

    // Subscribe to Auth State changes (Login, Token Refresh, Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          await loadUserDataAndSync(session.user.id);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();

      // Clear user state & Redux cart on logout
      setUser(null);
      setProfile(null);
      store.dispatch(removeAllItemsFromCart());

      if (typeof window !== "undefined") {
        localStorage.removeItem("cart_items");
        window.location.href = "/signin";
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
