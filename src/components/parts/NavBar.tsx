"use client";

import { User as UserType } from "@/types/authData";
import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const Navbar = ({
  user,
  role,
}: {
  user: UserType | null;
  role: string | null;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    alert("Signing out user: " + user?.email);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-primary tracking-tight">
              Techinika
            </span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 pl-3 py-2 my-2 rounded-md hover:bg-gray-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-400 capitalize">{role}</p>
              </div>
              <div className="rounded-full overflow-hidden w-10 h-10 ring-2 ring-primary/50 flex-shrink-0">
                {/* <img
                  src={user?.image_url || "/default-profile.png"}
                  alt={user.name}
                  className="w-full h-full object-cover"
                /> */}
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-tech-dark truncate">
                    {user?.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{role}</p>
                </div>

                <Link
                  href={`${process.env.NEXT_PUBLIC_AUTH_URL}/status`}
                  target="_blank"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-primary transition duration-150"
                >
                  <User className="h-4 w-4 mr-2" />
                  Manage User Profile
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
