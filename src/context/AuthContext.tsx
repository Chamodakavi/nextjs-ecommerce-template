"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/auth";
import {
  syncReduxCartToSupabase,
  subscribeToCartChanges,
  setActiveCartUserId,
} from "@/lib/supabase/cartSync";
import {
  syncReduxWishlistToSupabase,
  subscribeToWishlistChanges,
  setActiveWishlistUserId,
} from "@/lib/supabase/wishlistSync";
import { store } from "@/redux/store";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { removeAllItemsFromWishlist } from "@/redux/features/wishlist-slice";

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

  // In-flight synchronization lock to prevent duplicate concurrent runs
  const syncingUserIdRef = useRef<string | null>(null);
  const unsubscribeRealtimeCartRef = useRef<(() => void) | undefined>(undefined);
  const unsubscribeRealtimeWishlistRef = useRef<(() => void) | undefined>(undefined);

  const cleanupSubscriptions = () => {
    if (unsubscribeRealtimeCartRef.current) {
      unsubscribeRealtimeCartRef.current();
      unsubscribeRealtimeCartRef.current = undefined;
    }
    if (unsubscribeRealtimeWishlistRef.current) {
      unsubscribeRealtimeWishlistRef.current();
      unsubscribeRealtimeWishlistRef.current = undefined;
    }
  };

  const handleSignOutCleanup = () => {
    // 1. Unset active syncing IDs so clearing local state does NOT touch Supabase
    setActiveCartUserId(null);
    setActiveWishlistUserId(null);
    syncingUserIdRef.current = null;

    // 2. Tear down realtime subscriptions
    cleanupSubscriptions();

    // 3. Clear local Redux store and localStorage for guest safety
    store.dispatch(removeAllItemsFromCart());
    store.dispatch(removeAllItemsFromWishlist());

    if (typeof window !== "undefined") {
      localStorage.removeItem("cart_items");
      localStorage.removeItem("wishlist_items");
    }
  };

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // Helper to fetch user profile, sync cart & wishlist, and subscribe to realtime updates
    const loadUserDataAndSync = async (userId: string) => {
      if (syncingUserIdRef.current === userId) {
        return;
      }
      syncingUserIdRef.current = userId;

      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (data) setProfile(data);

        // Set active user IDs for background synchronization
        setActiveCartUserId(userId);
        setActiveWishlistUserId(userId);

        // 1. Sync Redux cart and wishlist with Supabase database
        await syncReduxCartToSupabase(userId);
        await syncReduxWishlistToSupabase(userId);

        // 2. Clean up previous listeners if any
        cleanupSubscriptions();

        // 3. Subscribe to real-time cart & wishlist changes across devices
        unsubscribeRealtimeCartRef.current = subscribeToCartChanges(userId);
        unsubscribeRealtimeWishlistRef.current = subscribeToWishlistChanges(userId);
      } catch (err) {
        console.error("Error loading profile or syncing cart/wishlist:", err);
      } finally {
        syncingUserIdRef.current = null;
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
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
          await loadUserDataAndSync(session.user.id);
        }
      } else {
        setUser(null);
        setProfile(null);
        handleSignOutCleanup();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      cleanupSubscriptions();
    };
  }, []);

  const signOut = async () => {
    try {
      handleSignOutCleanup();
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();

      setUser(null);
      setProfile(null);

      if (typeof window !== "undefined") {
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
