import "../global.css";
import { useEffect, useCallback, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AuthContext, AuthContextType } from "../hooks/useAuth";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const insets = useSafeAreaInsets();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState<AuthContextType["user"]>({
    id: "user-1",
    email: "demo@plantos.app",
  });

  useEffect(() => {
    // Wait until safe area insets are measured before hiding splash screen.
    // This prevents the content from briefly rendering behind the status
    // bar / notch on Android before the insets kick in.
    if (insets.top > 0) {
      SplashScreen.hideAsync();
    } else {
      // Fallback for devices/emulators that may report 0 insets
      const timeout = setTimeout(() => SplashScreen.hideAsync(), 300);
      return () => clearTimeout(timeout);
    }
  }, [insets.top]);

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

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}
