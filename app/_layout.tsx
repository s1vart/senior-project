import "../global.css";
import { useEffect, useCallback, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { AuthContext, AuthContextType } from "../hooks/useAuth";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<AuthContextType["user"]>({
    id: "user-1",
    email: "demo@plantos.app",
  });

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const login = useCallback((email: string, _password: string) => {
    setUser({ id: "user-1", email });
    setIsLoggedIn(true);
  }, []);

  const signup = useCallback((email: string, _password: string) => {
    setUser({ id: "user-1", email });
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#1C1C1E" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </AuthContext.Provider>
  );
}
