import "../global.css";
import { useEffect } from "react";
import { Stack, useSegments, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AuthProvider } from "../hooks/AuthProvider";
import { useAuth } from "../hooks/useAuth";
import { initNotifications } from "../lib/notifications";

SplashScreen.preventAutoHideAsync();
initNotifications();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace("/(tabs)/catalog");
    }
  }, [isLoggedIn, loading, segments]);

  return <>{children}</>;
}

function RootLayoutNav() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (insets.top > 0) {
      SplashScreen.hideAsync();
    } else {
      const timeout = setTimeout(() => SplashScreen.hideAsync(), 300);
      return () => clearTimeout(timeout);
    }
  }, [insets.top]);

  return (
    <AuthProvider>
      <AuthGuard>
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
      </AuthGuard>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RootLayoutNav />
    </SafeAreaProvider>
  );
}
