"use client";

import supabase from "@/supabase/supabase";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string | undefined;
  name: string | null;
  bio: string | null;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkSessionAndFetchAuthor() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: author } = await supabase
          .from("authors")
          .select("name, bio, is_admin")
          .eq("id", session.user.id)
          .single();

        const combinedUser: User = {
          id: session.user.id,
          name: author?.name || "",
          email: session.user.email || "",
          bio: author?.bio || "",
          is_admin: author?.is_admin || false,
        };

        setUser(combinedUser);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (newSession?.user) {
          const { data: author } = await supabase
            .from("authors")
            .select("name, bio, is_admin")
            .eq("id", newSession.user.id)
            .single();

          const combinedUser: User = {
            id: newSession.user.id,
            name: author?.name || "",
            email: newSession.user.email || "",
            bio: author?.bio || "",
            is_admin: author?.is_admin || false,
          };
          setUser(combinedUser);
        } else {
          setUser(null);
        }
      });

      setLoading(false);
      
      return () => {
        subscription?.unsubscribe();
      };
    }

    checkSessionAndFetchAuthor();
  }, []);

  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
