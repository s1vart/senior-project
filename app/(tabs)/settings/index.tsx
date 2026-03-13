import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeScreen } from "../../../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeScreen edges={["top"]}>
      <View className="px-6 pt-4 pb-5">
        <Text className="text-white text-2xl font-bold">Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
      >
        <Card className="mb-6">
          <View className="flex-row items-center">
            <View className="w-14 h-14 rounded-full bg-sage-accent/20 items-center justify-center mr-4">
              <Ionicons name="person" size={28} color="#6B8F71" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-semibold">
                {user?.email ?? "Not logged in"}
              </Text>
              <Text className="text-gray-text text-sm mt-0.5">
                Plant OS Member
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#3A3A3C" />
          </View>
        </Card>

        <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
          Preferences
        </Text>
        <Card className="mb-6">
          <SettingsRow icon="location" label="Region" value="Florida (FL)" />
          <SettingsRow icon="notifications" label="Notifications" value="On" />
          <SettingsRow icon="moon" label="Theme" value="Dark" />
          <SettingsRow icon="language" label="Language" value="English" last />
        </Card>

        <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
          About
        </Text>
        <Card className="mb-8">
          <SettingsRow icon="information-circle" label="Version" value="1.0.0" />
          <SettingsRow icon="school" label="Project" value="UF CIS4914" last />
        </Card>

        <Button title="Log Out" onPress={logout} variant="danger" />
      </ScrollView>
    </SafeScreen>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row items-center py-3 ${last ? "" : "border-b border-dark-border"}`}
    >
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
