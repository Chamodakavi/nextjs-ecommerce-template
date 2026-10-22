"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Breadcrumb from "../Common/Breadcrumb";
import AddressModal from "./AddressModal";
import Orders from "../Orders";
import tabsData from "./tabsData";
import { getSupabaseBrowserClient, signOutUser } from "@/lib/supabase/auth";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Edit,
  ChevronDown,
} from "lucide-react";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [addressModal, setAddressModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<{
    full_name?: string;
    avatar_url?: string;
    created_at?: string;
  } | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const fetchUserProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, created_at")
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
  }, []);

  const openAddressModal = () => setAddressModal(true);
  const closeAddressModal = () => setAddressModal(false);

  const handleTabClick = async (tabId: string) => {
    if (tabId === "logout") {
      await signOutUser();
      window.location.href = "/signin";
      return;
    }
    setActiveTab(tabId);
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Valued Customer";

  const displayAvatar =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture;

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Member";

  return (
    <>
      <Breadcrumb title={"My Account"} pages={["My Account"]} />

      <section className="overflow-hidden py-12 sm:py-16 lg:py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col xl:flex-row gap-7.5 items-start">
            {/* Sidebar Menu */}
            <div className="xl:max-w-[320px] w-full bg-white rounded-xl shadow-1 overflow-hidden">
              <div className="flex items-center gap-4 p-6 border-b border-gray-3 bg-gray-1/50">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-3 bg-blue/10 flex items-center justify-center shrink-0">
                  {displayAvatar ? (
                    <Image
                      src={displayAvatar}
                      alt={displayName}
                      fill
                      className="object-cover"
                      unoptimized={displayAvatar.startsWith("http")}
                    />
                  ) : (
                    <UserIcon className="w-7 h-7 text-blue" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-dark text-base truncate">
                    {displayName}
                  </h3>
                  <p className="text-xs text-gray-500">Joined {joinDate}</p>
                </div>
              </div>

              <div className="p-4">
                <nav className="flex flex-col gap-1.5">
                  {tabsData.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
                          isActive
                            ? "bg-blue text-white shadow-sm"
                            : "text-dark-2 hover:bg-gray-1 hover:text-blue"
                        }`}
                      >
                        <IconComponent className="w-5 h-5 shrink-0" />
                        <span>{tab.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full">
              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="bg-white rounded-xl shadow-1 overflow-hidden">
                  <Orders />
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shipping Address */}
                  <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-gray-3 bg-gray-1/30">
                      <h4 className="font-semibold text-dark text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue" /> Shipping
                        Address
                      </h4>
                      <button
                        type="button"
                        onClick={openAddressModal}
                        className="text-gray-500 hover:text-blue p-1.5 rounded-md hover:bg-gray-1 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 space-y-3 text-sm text-dark-2">
                      <p className="flex items-center gap-2.5 font-medium text-dark">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        {displayName}
                      </p>
                      <p className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user?.email || "No email added"}
                      </p>
                      <p className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-gray-400" />
                        +94 77 123 4567
                      </p>
                      <p className="flex items-start gap-2.5 pt-1 border-t border-gray-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        7398 Main Road, Colombo, Sri Lanka
                      </p>
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
                    <div className="flex items-center justify-between p-5 border-b border-gray-3 bg-gray-1/30">
                      <h4 className="font-semibold text-dark text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue" /> Billing Address
                      </h4>
                      <button
                        type="button"
                        onClick={openAddressModal}
                        className="text-gray-500 hover:text-blue p-1.5 rounded-md hover:bg-gray-1 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 space-y-3 text-sm text-dark-2">
                      <p className="flex items-center gap-2.5 font-medium text-dark">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        {displayName}
                      </p>
                      <p className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {user?.email || "No email added"}
                      </p>
                      <p className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-gray-400" />
                        +94 77 123 4567
                      </p>
                      <p className="flex items-start gap-2.5 pt-1 border-t border-gray-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        7398 Main Road, Colombo, Sri Lanka
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Details Tab */}
              {activeTab === "account-details" && (
                <div className="bg-white rounded-xl shadow-1 p-6 sm:p-8">
                  <h3 className="font-semibold text-xl text-dark mb-6">
                    Account Information
                  </h3>

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col sm:flex-row gap-5 mb-5">
                      <div className="w-full">
                        <label
                          htmlFor="fullName"
                          className="block mb-2 text-sm font-medium text-dark"
                        >
                          Full Name <span className="text-red">*</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          defaultValue={displayName}
                          className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 text-sm outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                      </div>

                      <div className="w-full">
                        <label
                          htmlFor="accountEmail"
                          className="block mb-2 text-sm font-medium text-dark"
                        >
                          Email Address <span className="text-red">*</span>
                        </label>
                        <input
                          type="email"
                          id="accountEmail"
                          disabled
                          defaultValue={user?.email || ""}
                          className="rounded-md border border-gray-3 bg-gray-2 text-gray-500 w-full py-2.5 px-5 text-sm outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="mb-8">
                      <label
                        htmlFor="country"
                        className="block mb-2 text-sm font-medium text-dark"
                      >
                        Country / Region
                      </label>
                      <div className="relative">
                        <select
                          id="country"
                          defaultValue="LK"
                          className="w-full bg-gray-1 rounded-md border border-gray-3 text-dark py-2.5 pl-5 pr-10 text-sm appearance-none outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        >
                          <option value="LK">Sri Lanka</option>
                          <option value="AU">Australia</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md text-sm ease-out duration-200 hover:bg-blue-dark shadow-sm mb-10"
                    >
                      Save Changes
                    </button>

                    <h4 className="font-semibold text-lg text-dark mb-6 pt-6 border-t border-gray-3">
                      Password Change
                    </h4>

                    <div className="space-y-5 max-w-lg mb-6">
                      <div>
                        <label
                          htmlFor="oldPassword"
                          className="block mb-2 text-sm font-medium text-dark"
                        >
                          Old Password
                        </label>
                        <input
                          type="password"
                          id="oldPassword"
                          autoComplete="current-password"
                          className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 text-sm outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="newPassword"
                          className="block mb-2 text-sm font-medium text-dark"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          autoComplete="new-password"
                          className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 text-sm outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block mb-2 text-sm font-medium text-dark"
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          autoComplete="new-password"
                          className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 text-sm outline-none focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md text-sm ease-out duration-200 hover:bg-blue-dark shadow-sm"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <AddressModal isOpen={addressModal} closeModal={closeAddressModal} />
    </>
  );
};

export default MyAccount;
