"use client";

import { createContext, useContext } from "react";
import { AuthResponse } from "@/types/authData";

export const AuthContext = createContext<AuthResponse | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}
