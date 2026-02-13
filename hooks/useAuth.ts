import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  signup: async () => false,
  logout: async () => {},
  resetPassword: async () => false,
  clearError: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
