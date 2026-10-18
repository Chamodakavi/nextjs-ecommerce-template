"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import CustomSelect from "./CustomSelect";
import { menuData } from "./menuData";
import Dropdown from "./Dropdown";
import { useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";

import {
  Search,
  PhoneCall,
  User,
  ShoppingBag,
  History,
  Heart,
  Menu,
  X,
} from "lucide-react";

import { WebData } from "@/types/webData";

const Header = ({ webData }: { webData: WebData | null }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);

  const mobileNavRef = useRef<HTMLDivElement>(null);
  const mobileToggleBtnRef = useRef<HTMLButtonElement>(null);

  const { openCartModal } = useCartModalContext();
  const product = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => {
      window.removeEventListener("scroll", handleStickyMenu);
    };
  }, []);

  // Close mobile navigation when clicking outside
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
    }

    if (navigationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigationOpen]);

  const options = [
    { label: "All Categories", value: "0" },
    { label: "Desktop", value: "1" },
    { label: "Laptop", value: "2" },
    { label: "Monitor", value: "3" },
    { label: "Phone", value: "4" },
    { label: "Watch", value: "5" },
  ];

  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 ${
        stickyMenu ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* Mobile Header Bar (Screen sizes < 1280px) */}
        <div className="flex xl:hidden items-center justify-between py-3">
          {/* Hamburger Menu Toggle Button */}
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

          {/* Centered Logo */}
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

          {/* Right Action Icons */}
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
              {product.length > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center text-[10px] font-bold bg-blue text-white w-4 h-4 rounded-full">
                  {product.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchOpen && (
          <div className="block xl:hidden py-2.5 pb-4 border-t border-gray-2">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative w-full"
            >
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

        {/* Desktop Header Bar (Screen sizes >= 1280px) */}
        <div
          className={`hidden xl:flex items-center justify-between gap-5 transition-all duration-200 ${
            stickyMenu ? "py-3" : "py-5"
          }`}
        >
          {/* Logo */}
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

          {/* Desktop Search Bar */}
          <div className="max-w-[475px] w-full">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex items-center">
                <CustomSelect options={options} />

                <div className="relative w-full">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-gray-4"></span>
                  <input
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                    type="search"
                    placeholder="I am shopping for..."
                    className="w-full rounded-r-[5px] bg-gray-1 border border-l-0 border-gray-3 py-2.5 pl-4 pr-10 outline-none text-sm focus:border-blue transition"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-4 hover:text-blue transition"
                  >
                    <Search className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Desktop Header Actions */}
          <div className="flex items-center gap-7.5">
            {/* Support Phone */}
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

            {/* Account & Cart */}
            <div className="flex items-center gap-6">
              <Link href="/signin" className="flex items-center gap-2.5 group">
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

              <button
                type="button"
                onClick={openCartModal}
                className="flex items-center gap-2.5 group"
              >
                <span className="inline-block relative">
                  <ShoppingBag className="w-6 h-6 text-blue group-hover:opacity-80 transition-opacity flex-shrink-0" />
                  <span className="flex items-center justify-center font-medium text-2xs absolute -right-2 -top-2 bg-blue w-4.5 h-4.5 rounded-full text-white">
                    {product.length}
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
            {/* Navigation Menu (Mobile Accordion Drawer / Desktop Inline) */}
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

            {/* Desktop Navigation Extra Links */}
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
