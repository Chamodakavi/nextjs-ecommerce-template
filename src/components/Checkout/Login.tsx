"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const Login = () => {
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      <div
        onClick={() => setDropdown(!dropdown)}
        className={`cursor-pointer flex items-center gap-0.5 py-5 px-5.5 select-none ${
          dropdown ? "border-b border-gray-3" : ""
        }`}
      >
        Returning customer?
        <span className="flex items-center gap-2.5 pl-1 font-medium text-dark">
          Click here to login
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              dropdown ? "rotate-180" : ""
            }`}
          />
        </span>
      </div>

      <div
        className={`${
          dropdown ? "block" : "hidden"
        } pt-7.5 pb-8.5 px-4 sm:px-8.5`}
      >
        <p className="text-custom-sm mb-6">
          If you are not logged in, please log in first.
        </p>

        <div className="mb-5">
          <label htmlFor="login-username" className="block mb-2.5">
            Username or Email
          </label>
          <input
            type="text"
            name="username"
            id="login-username"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="login-password" className="block mb-2.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="login-password"
            autoComplete="current-password"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <button
          type="button"
          className="inline-flex font-medium text-white bg-blue py-3 px-10.5 rounded-md ease-out duration-200 hover:bg-blue-dark"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
