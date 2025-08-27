"use client";

import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/app/loading";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return user ? (
    <>{children}</>
  ) : (
    <div className="flex justify-center items-center h-screen flex-col">
      <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
      <p className="text-center text-gray-600 mb-6">
        You must be logged in to view this content.
      </p>
      <Link href="/">
        <Button>Go to Login Page</Button>
      </Link>
    </div>
  );
};

export default PrivateRoute;
