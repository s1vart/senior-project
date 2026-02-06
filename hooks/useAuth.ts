import { createContext, useContext } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  user: { id: string; email: string } | null;
  login: (email: string, password: string) => void;
  signup: (email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: true,
  user: { id: "user-1", email: "demo@plantos.app" },
  login: () => {},
  signup: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}
