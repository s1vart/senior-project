import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen } from "../../../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { ReminderCard } from "../../../components/ReminderCard";
import { useAuth } from "../../../hooks/useAuth";
import { fetchRemindersForUser } from "../../../lib/reminders";
import type { Reminder } from "../../../types";

export default function ManageCareScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchRemindersForUser(user.id)
      .then(setReminders)
      .catch(() => {});
  }, [user]);

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

      </ScrollView>
    </SafeScreen>
  );
}
