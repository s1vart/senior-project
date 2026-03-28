import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeScreen } from "../../../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { ReminderCard } from "../../../components/ReminderCard";
import { Toggle } from "../../../components/ui/Toggle";
import { TextField } from "../../../components/ui/TextField";
import { useAuth } from "../../../hooks/useAuth";
import { fetchRemindersForUser } from "../../../lib/reminders";
import type { Reminder } from "../../../types";

const STORAGE_KEYS = {
  seasonalUpdates: "care_seasonal_updates",
  location: "care_location",
};

export default function ManageCareScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [seasonalUpdates, setSeasonalUpdates] = useState(true);
  const [location, setLocation] = useState("");
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // Load saved preferences
  useEffect(() => {
    (async () => {
      const [savedSeasonal, savedLocation] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.seasonalUpdates),
        AsyncStorage.getItem(STORAGE_KEYS.location),
      ]);
      if (savedSeasonal !== null) setSeasonalUpdates(savedSeasonal === "true");
      if (savedLocation !== null) setLocation(savedLocation);
    })();
  }, []);

  // Load user reminders for summary counts
  useEffect(() => {
    if (!user) return;
    fetchRemindersForUser(user.id)
      .then(setReminders)
      .catch(() => {});
  }, [user]);

  const handleSeasonalToggle = useCallback((value: boolean) => {
    setSeasonalUpdates(value);
    AsyncStorage.setItem(STORAGE_KEYS.seasonalUpdates, String(value));
  }, []);

  const handleLocationChange = useCallback((value: string) => {
    setLocation(value);
    AsyncStorage.setItem(STORAGE_KEYS.location, value);
  }, []);

  const waterCount = reminders.filter((r) => r.careType === "water").length;
  const fertilizerCount = reminders.filter(
    (r) => r.careType === "fertilize"
  ).length;

  return (
    <SafeScreen edges={["top"]}>
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
          description={`${waterCount} active water reminder${waterCount !== 1 ? "s" : ""}. Personalized to each plant based on plant type, pot size, and placement in home.`}
          icon="water"
          iconColor="#3B82F6"
          actionLabel="View Plants"
          onAction={() => router.push("/(tabs)/catalog")}
        />

        <ReminderCard
          title="Fertilizer Reminders"
          description={`${fertilizerCount} active fertilizer reminder${fertilizerCount !== 1 ? "s" : ""}. Based on your plant's appetite for nutrients. Fast growing plants need more grub.`}
          icon="leaf"
          iconColor="#22C55E"
          actionLabel="Select Plants"
          onAction={() => router.push("/(tabs)/catalog")}
        />

        <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 mt-6">
          Autopilot Care
        </Text>

        <View className="bg-dark-card rounded-2xl p-4 mb-3">
          <Toggle
            label="Seasonal Updates"
            description="Set your location to see how current sunlight levels affect plant growing potential."
            value={seasonalUpdates}
            onValueChange={handleSeasonalToggle}
          />
        </View>

        <View className="bg-dark-card rounded-2xl p-4">
          <Text className="text-white text-base font-semibold mb-3">
            Location
          </Text>
          <TextField
            label="Select City"
            value={location}
            onChangeText={handleLocationChange}
            placeholder="Enter your city"
            icon={<Ionicons name="location" size={18} color="#9CA3AF" />}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
