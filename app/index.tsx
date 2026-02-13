import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#6B8F71" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/catalog" />;
  }

  return <Redirect href="/(auth)/login" />;
}
