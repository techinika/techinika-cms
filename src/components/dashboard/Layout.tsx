"use client";

import { Navbar } from "@/components/parts/NavBar";
import { checkLogin } from "@/lib/checkLogin";
import { AuthResponse } from "@/types/authData";
import React, { useEffect, useState } from "react";
import { AuthContext } from '../../lib/AuthContext';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [authData, setAuthData] = useState<AuthResponse>();
  useEffect(() => {
    const initData = async () => {
      const data = await checkLogin();
      setAuthData(data);
    };
    initData();
  }, []);

  return (
    <AuthContext.Provider value={authData}>
      <Navbar user={authData?.user ?? null} role={authData?.role ?? null} />
      {children}
    </AuthContext.Provider>
  );
}
