"use client";

import { Navbar } from "@/components/parts/NavBar";
import { MOCK_USER } from "@/lib/utils";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div>
      <Navbar user={MOCK_USER} />
      {children}
    </div>
  );
}
