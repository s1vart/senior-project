import "../global.css";
import { useEffect } from "react";
import { Stack, useSegments, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../hooks/AuthProvider";
import { useAuth } from "../hooks/useAuth";
import { RegionProvider } from "../hooks/RegionProvider";
import { initNotifications } from "../lib/notifications";

const AppTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#1C1C1E",
    card: "#1C1C1E",
  },
};

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
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <RegionProvider>
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
      </RegionProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={AppTheme}>
        <RootLayoutNav />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
