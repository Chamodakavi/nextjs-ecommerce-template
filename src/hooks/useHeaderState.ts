import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SelectOption } from "@/components/Header/CustomSelect";
import { getSupabaseBrowserClient } from "@/lib/supabase/auth";

export function useHeaderState() {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectOption>({
    label: "All Categories",
    value: "all",
  });

  const [navigationOpen, setNavigationOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{
    full_name?: string;
    avatar_url?: string;
  } | null>(null);

  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileToggleBtnRef = useRef<HTMLButtonElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Auth & Profile Listener
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const fetchUserProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single();

      if (data) setProfile(data);
    };

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUser(data.user);
        fetchUserProfile(data.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sticky Menu Scroll
  useEffect(() => {
    const handleStickyMenu = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  // Reset category dropdown when navigating away from shop-with-sidebar
  useEffect(() => {
    if (!pathname.startsWith("/shop-with-sidebar")) {
      setSelectedCategory({ label: "All Categories", value: "all" });
    }
  }, [pathname]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        navigationOpen &&
        mobileNavRef.current &&
        !mobileNavRef.current.contains(target) &&
        mobileToggleBtnRef.current &&
        !mobileToggleBtnRef.current.contains(target)
      ) {
        setNavigationOpen(false);
      }

      if (
        userDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(target)
      ) {
        setUserDropdownOpen(false);
      }

      if (
        searchDropdownOpen &&
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        setSearchDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigationOpen, userDropdownOpen, searchDropdownOpen]);

  // Handler when selecting a category from the dropdown
  const handleCategorySelect = useCallback(
    (option: SelectOption) => {
      setSelectedCategory(option);

      if (option.value === "all") {
        router.push("/shop-with-sidebar");
      } else {
        router.push(
          `/shop-with-sidebar?category=${encodeURIComponent(option.label)}`,
        );
      }
    },
    [router],
  );

  const clearSearchQuery = useCallback(() => {
    setSearchQuery("");
    setSearchDropdownOpen(false);
  }, []);

  const toggleNavigation = useCallback(
    () => setNavigationOpen((prev) => !prev),
    [],
  );
  const toggleMobileSearch = useCallback(
    () => setMobileSearchOpen((prev) => !prev),
    [],
  );
  const toggleUserDropdown = useCallback(
    () => setUserDropdownOpen((prev) => !prev),
    [],
  );
  const closeUserDropdown = useCallback(() => setUserDropdownOpen(false), []);
  const closeNavigation = useCallback(() => setNavigationOpen(false), []);

  return {
    state: {
      searchQuery,
      selectedCategory,
      navigationOpen,
      mobileSearchOpen,
      stickyMenu,
      userDropdownOpen,
      searchDropdownOpen,
      user,
      profile,
    },
    setters: {
      setSearchQuery,
      setSelectedCategory,
      setSearchDropdownOpen,
      setUserDropdownOpen,
    },
    refs: {
      mobileNavRef,
      mobileToggleBtnRef,
      userDropdownRef,
      searchRef,
    },
    actions: {
      handleCategorySelect,
      clearSearchQuery,
      toggleNavigation,
      toggleMobileSearch,
      toggleUserDropdown,
      closeUserDropdown,
      closeNavigation,
    },
  };
}
