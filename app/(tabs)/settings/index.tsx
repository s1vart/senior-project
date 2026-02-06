import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
      <View className="px-5 pt-2 pb-4">
        <Text className="text-white text-2xl font-bold">Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <Card className="mb-4">
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-violet-accent items-center justify-center mr-4">
              <Ionicons name="person" size={28} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">
                {user?.email ?? "Not logged in"}
              </Text>
              <Text className="text-gray-text text-sm">Plant OS Member</Text>
            </View>
          </View>
        </Card>

        <Card className="mb-4">
          <Text className="text-white text-lg font-semibold mb-3">
            Preferences
          </Text>

          <SettingsRow icon="location" label="Region" value="Florida (FL)" />
          <SettingsRow icon="notifications" label="Notifications" value="On" />
          <SettingsRow icon="moon" label="Theme" value="Dark" />
          <SettingsRow icon="language" label="Language" value="English" />
        </Card>

        <Card className="mb-4">
          <Text className="text-white text-lg font-semibold mb-3">About</Text>
          <SettingsRow icon="information-circle" label="Version" value="1.0.0" />
          <SettingsRow icon="school" label="Project" value="UF CIS4914" />
        </Card>

        <Button title="Log Out" onPress={logout} variant="outline" />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center py-3 border-b border-dark-border">
      <Ionicons name={icon} size={20} color="#9CA3AF" />
      <Text className="text-white flex-1 ml-3">{label}</Text>
      <Text className="text-gray-text">{value}</Text>
      <Ionicons
        name="chevron-forward"
        size={16}
        color="#3A3A3C"
        style={{ marginLeft: 8 }}
      />
    </View>
  );
}
