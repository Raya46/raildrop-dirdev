import { User } from "@/types/user";
import { supabase } from "@/utils/supabase";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  session: Session | null;
  userData: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserData = useCallback(async (user: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*, pin")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error.message);
        setUserData(null);
      } else {
        setUserData(data as User);
      }
    } catch (e) {
      console.error("An unexpected error occurred in fetchUserData:", e);
      setUserData(null);
    }
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (session?.user) {
          await fetchUserData(session.user);
        } else {
          setUserData(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const refreshUserData = useCallback(async () => {
    if (session?.user) {
      await fetchUserData(session.user);
    }
  }, [session, fetchUserData]);

  const value = {
    session,
    userData,
    isLoading,
    isAuthenticated: !!session?.user,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
