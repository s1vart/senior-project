import { Stack } from "expo-router";

export default function ResourcesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1C1C1E" },
        animation: "fade",
      }}
    />
  );
}
