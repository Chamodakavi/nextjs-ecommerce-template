"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomSelect, { SelectOption } from "./CustomSelect";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { getSupabaseBrowserClient, signOutUser } from "@/lib/supabase/auth";

import { useProducts } from "@/context/ProductContext";
import { useCatData } from "@/context/WebCatProvider";

import { Product } from "@/types/product";
import { Category } from "@/types/category";

import {
  Search,
  PhoneCall,
  User,
  ShoppingBag,
  History,
  Heart,
  Menu,
  X,
  LogOut,
} from "lucide-react";

import { WebData } from "@/types/webData";

const Header = ({ webData }: { webData: WebData | null }) => {
  const router = useRouter();

  // Retrieve categories and products directly from providers
  const rawCategories = useCatData();
  const rawProducts = useProducts();

  const categories: Category[] = Array.isArray(rawCategories)
    ? (rawCategories as unknown as Category[])
    : [];
  const products: Product[] = Array.isArray(rawProducts) ? rawProducts : [];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SelectOption>({
    label: "All Categories",
    value: "all",
  });

  const [navigationOpen, setNavigationOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{
    full_name?: string;
    avatar_url?: string;
  } | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileToggleBtnRef = useRef<HTMLButtonElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { openCartModal } = useCartModalContext();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  // 1. Build category options for the search dropdown
  const categoryOptions: SelectOption[] = [
    { label: "All Categories", value: "all" },
    ...categories.map((cat: any) => ({
      label: cat.title || cat.name || cat.category_name || "Category",
      value: String(cat.id || cat.slug || cat.title || cat.name),
    })),
  ];

  // 2. Filter products based on category select & product name input
  const filteredProducts = products.filter((product) => {
    const productName = product.name?.toLowerCase() || "";
    const matchesSearch = productName.includes(
      searchQuery.toLowerCase().trim(),
    );

    const matchesCategory =
      selectedCategory.value === "all" ||
      String(product.category) === selectedCategory.value ||
      product.category === selectedCategory.label;

    return matchesSearch && matchesCategory;
  });

  // Handle submit action on form
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchDropdownOpen(false);
    setMobileSearchOpen(false);

    router.push(
      `/shop-with-sidebar?search=${encodeURIComponent(
        searchQuery.trim(),
      )}&category=${selectedCategory.value}`,
    );
  };

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
      (event, session) => {
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

  // Sticky header on scroll
  useEffect(() => {
    const handleStickyMenu = () => {
      setStickyMenu(window.scrollY >= 80);
    };
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  // Handle outside clicks to close active menus
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

  const handleSignOut = async () => {
    await signOutUser();
    setUserDropdownOpen(false);
    window.location.reload();
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const displayAvatar =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 ${
        stickyMenu ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* Mobile Header Bar (< 1280px) */}
        <div className="flex xl:hidden items-center justify-between py-3">
          <button
            ref={mobileToggleBtnRef}
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setNavigationOpen(!navigationOpen)}
            className="p-1.5 rounded-md text-dark hover:text-blue hover:bg-gray-1 transition"
          >
            {navigationOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Link href="/" className="flex-shrink-0 my-auto">
            <Image
              src="/images/logo/logo2.png"
              alt={webData?.site_name || "Premier Auto Hub"}
              width={160}
              height={32}
              className="object-contain h-8 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Search"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="p-1.5 rounded-md text-dark hover:text-blue transition"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={openCartModal}
              aria-label="Open cart modal"
              className="relative p-1.5 text-dark hover:text-blue transition"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center text-[10px] font-bold bg-blue text-white w-4 h-4 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {mobileSearchOpen && (
          <div className="block xl:hidden py-2.5 pb-4 border-t border-gray-2 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="I am shopping for..."
                className="w-full rounded-md bg-gray-1 border border-gray-3 py-2 pl-4 pr-10 text-sm outline-none focus:border-blue"
              />
              <button
                type="submit"
                aria-label="Search button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-4 hover:text-blue"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Desktop Header Bar (>= 1280px) */}
        <div
          className={`hidden xl:flex items-center justify-between gap-5 transition-all duration-200 ${
            stickyMenu ? "py-3" : "py-5"
          }`}
        >
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo/logo2.png"
              alt={webData?.site_name || "Premier Auto Hub"}
              width={200}
              height={40}
              className="object-contain h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Search Section */}
          <div className="max-w-[475px] w-full relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center">
                {/* Categories Dropdown on Left */}
                <CustomSelect
                  options={categoryOptions}
                  selectedOption={selectedCategory}
                  onSelect={(opt) => setSelectedCategory(opt)}
                />

                {/* Main Product Search Input */}
                <div className="relative w-full">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-gray-4"></span>
                  <input
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchDropdownOpen(e.target.value.trim().length > 0);
                    }}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0)
                        setSearchDropdownOpen(true);
                    }}
                    value={searchQuery}
                    type="search"
                    placeholder="I am shopping for..."
                    className="w-full rounded-r-[5px] bg-gray-1 border border-l-0 border-gray-3 py-2.5 pl-4 pr-10 outline-none text-sm focus:border-blue transition"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-4 hover:text-blue transition cursor-pointer"
                  >
                    <Search className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Predictive Products Search List */}
            {searchDropdownOpen && searchQuery.trim() !== "" && (
              <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-3 z-50 max-h-80 overflow-y-auto p-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 6).map((product) => {
                    const previewImg =
                      product.image_url ||
                      product.image_urls?.[0] ||
                      "/images/product/product-01.jpg";

                    return (
                      <Link
                        key={product.id}
                        href={`/shop/${product.id}`}
                        onClick={() => {
                          setSearchDropdownOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-gray-1 rounded-md transition-colors"
                      >
                        <div className="relative w-10 h-10 rounded bg-gray-2 shrink-0 overflow-hidden">
                          <Image
                            src={previewImg}
                            alt={product.name || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-dark truncate">
                            {product.name}
                          </p>
                          <p className="text-xs font-semibold text-blue">
                            Rs.{" "}
                            {Number(
                              product.selling_price || 0,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-7.5">
            <div className="flex items-center gap-3.5">
              <PhoneCall className="w-6 h-6 text-blue flex-shrink-0" />
              <div>
                <span className="block text-2xs text-dark-4 uppercase">
                  24/7 Support
                </span>
                <p className="font-medium text-custom-sm text-dark">
                  {webData?.phone || "+94 77 123 4567"}
                </p>
              </div>
            </div>

            <span className="w-px h-7.5 bg-gray-4"></span>

            {/* Account / Profile Button */}
            <div className="flex items-center gap-6">
              {user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
                  >
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-3 bg-blue/10 flex items-center justify-center shrink-0">
                      {displayAvatar ? (
                        <Image
                          src={displayAvatar}
                          alt={displayName}
                          fill
                          className="object-cover"
                          unoptimized={displayAvatar.startsWith("http")}
                        />
                      ) : (
                        <span className="font-bold text-blue text-sm uppercase">
                          {displayName.charAt(0)}
                        </span>
                      )}
                    </div>

                    <div className="text-left">
                      <span className="block text-2xs text-dark-4 uppercase">
                        Welcome
                      </span>
                      <p className="font-medium text-custom-sm text-dark group-hover:text-blue transition-colors line-clamp-1 max-w-[110px]">
                        {displayName}
                      </p>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl border border-gray-3 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <Link
                        href="/my-account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-dark hover:bg-gray-1 hover:text-blue transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        My Account
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red hover:bg-gray-1 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="flex items-center gap-2.5 group"
                >
                  <User className="w-6 h-6 text-blue group-hover:opacity-80 transition-opacity flex-shrink-0" />
                  <div>
                    <span className="block text-2xs text-dark-4 uppercase">
                      Account
                    </span>
                    <p className="font-medium text-custom-sm text-dark group-hover:text-blue transition-colors">
                      Sign In
                    </p>
                  </div>
                </Link>
              )}

              {/* Cart Button */}
              <button
                type="button"
                onClick={openCartModal}
                className="flex items-center gap-2.5 group cursor-pointer"
              >
                <span className="inline-block relative">
                  <ShoppingBag className="w-6 h-6 text-blue group-hover:opacity-80 transition-opacity flex-shrink-0" />
                  <span className="flex items-center justify-center font-medium text-2xs absolute -right-2 -top-2 bg-blue w-4.5 h-4.5 rounded-full text-white">
                    {cartItems.length}
                  </span>
                </span>
                <div className="text-left">
                  <span className="block text-2xs text-dark-4 uppercase">
                    Cart
                  </span>
                  <p className="font-medium text-custom-sm text-dark group-hover:text-blue transition-colors">
                    Rs. {Number(totalPrice || 0).toLocaleString()}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-gray-3 bg-white">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          <div className="flex items-center justify-between">
            <div
              ref={mobileNavRef}
              className={`w-full xl:w-auto left-0 top-full xl:static xl:flex items-center justify-between ${
                navigationOpen
                  ? "block absolute bg-white shadow-lg border-b border-gray-3 p-5 z-50"
                  : "hidden xl:flex"
              }`}
            >
              <nav>
                <ul className="flex xl:items-center flex-col xl:flex-row gap-4 xl:gap-6">
                  {menuData.map((menuItem, i) =>
                    menuItem.submenu ? (
                      <Dropdown
                        key={i}
                        menuItem={menuItem}
                        stickyMenu={stickyMenu}
                      />
                    ) : (
                      <li key={i}>
                        <Link
                          href={menuItem.path}
                          onClick={() => setNavigationOpen(false)}
                          className="hover:text-blue text-custom-sm font-medium text-dark block py-1.5 xl:py-4 transition-colors"
                        >
                          {menuItem.title}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </nav>
            </div>

            <div className="hidden xl:block">
              <ul className="flex items-center gap-5.5">
                <li className="py-4">
                  <a
                    href="#"
                    className="flex items-center gap-1.5 font-medium text-custom-sm text-dark hover:text-blue transition-colors"
                  >
                    <History className="w-4 h-4 flex-shrink-0" />
                    Recently Viewed
                  </a>
                </li>

                <li className="py-4">
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-1.5 font-medium text-custom-sm text-dark hover:text-blue transition-colors"
                  >
                    <Heart className="w-4 h-4 flex-shrink-0" />
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
