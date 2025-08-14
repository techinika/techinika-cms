"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface SupabaseClient {
  auth: {
    getSession: () => Promise<{ data: { session: any } }>;
    onAuthStateChange: (
      callback: (event: string, session: any | null) => void
    ) => { data: { subscription: { unsubscribe: () => void } } };
  };
}

interface User {
  id: string;
  email: string | undefined;
  // Add other user properties here if needed
}

const mockSupabaseClient: SupabaseClient = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: (callback) => {
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.log("Unsubscribing from auth state changes.");
            },
          },
        },
      };
    },
  },
};

const supabase = mockSupabaseClient;

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen for changes in the authentication state.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // When a user signs in, set the user state.
        setUser(session.user as User);
      } else {
        // When a user signs out or there is no session, clear the user state.
        setUser(null);
      }
      setLoading(false);
    });

    // Clean up the subscription when the component unmounts.
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // The context value we will provide to all children.
  const value = { user, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * A custom hook to easily access the authentication context.
 * This is the recommended way to consume the context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
