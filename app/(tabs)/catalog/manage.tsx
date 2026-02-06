import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ReminderCard } from "../../../components/ReminderCard";
import { Toggle } from "../../../components/ui/Toggle";
import { TextField } from "../../../components/ui/TextField";

export default function ManageCareScreen() {
  const router = useRouter();
  const [seasonalUpdates, setSeasonalUpdates] = useState(true);
  const [location, setLocation] = useState("Gainesville, FL");

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">
          Manage Care Schedule
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3">
          Smart Reminders
        </Text>

        <ReminderCard
          title="Water Reminders"
          description="Water Reminders are personalized to each plant based on plant type, pot size, and placement in home."
          icon="water"
          iconColor="#3B82F6"
          onAction={() => {}}
        />

        <ReminderCard
          title="Fertilizer Reminders"
          description="Fertilizer Reminders are based on your plant's appetite for nutrients. Fast growing plants need more grub."
          icon="leaf"
          iconColor="#22C55E"
          actionLabel="Select Plants"
          onAction={() => {}}
        />

        <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 mt-6">
          Autopilot Care
        </Text>

        <View className="bg-dark-card rounded-2xl p-4 mb-3">
          <Toggle
            label="Seasonal Updates"
            description="Set your location to see how current sunlight levels affect plant growing potential."
            value={seasonalUpdates}
            onValueChange={setSeasonalUpdates}
          />
        </View>

        <View className="bg-dark-card rounded-2xl p-4">
          <Text className="text-white text-base font-semibold mb-3">
            Location
          </Text>
          <TextField
            label="Select City"
            value={location}
            onChangeText={setLocation}
            placeholder="Enter your city"
            icon={<Ionicons name="location" size={18} color="#9CA3AF" />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
