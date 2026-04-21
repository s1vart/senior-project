import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeScreen } from "../../../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { PlantCard } from "../../../components/PlantCard";
import { TabSelector } from "../../../components/ui/TabSelector";
import { Badge } from "../../../components/ui/Badge";
import { EmptyState } from "../../../components/EmptyState";
import { useAuth } from "../../../hooks/useAuth";
import { fetchPlants } from "../../../lib/plants";
import { fetchRemindersForUser } from "../../../lib/reminders";
import type { Plant, Reminder } from "../../../types";

/** Check whether a reminder's nextDue is today or earlier. */
function isDueOrOverdue(nextDue: string): boolean {
  const due = new Date(nextDue);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due <= today;
}

/** Return the nearest reminder for a plant. */
function getNearestReminder(
  plantId: string,
  reminders: Reminder[]
): Reminder | undefined {
  return reminders
    .filter((r) => r.plantId === plantId)
    .sort(
      (a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime()
    )[0];
}

/** Human-readable label for days until a reminder is due. */
function getDueLabel(nextDue: string): { label: string; color: string } {
  const due = new Date(nextDue);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff < 0) return { label: "Overdue", color: "#EF4444" };
  if (diff === 0) return { label: "Due today", color: "#EAB308" };
  if (diff === 1) return { label: "Due tomorrow", color: "#3B82F6" };
  if (diff <= 7) return { label: `Due in ${diff} days`, color: "#3B82F6" };
  return {
    label: `Due in ${Math.ceil(diff / 7)} weeks`,
    color: "#3B82F6",
  };
}

export default function CatalogScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Today");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      // Only show full-screen spinner on the very first load
      // so returning from a detail screen doesn't flash
      if (plants.length === 0) setLoading(true);

      const [plantData, reminderData] = await Promise.all([
        fetchPlants(user.id),
        fetchRemindersForUser(user.id),
      ]);
      setPlants(plantData);
      setReminders(reminderData);
    } catch {
      Alert.alert("Error", "Could not load your plants.");
    } finally {
      setLoading(false);
    }
  }, [user, plants.length]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // ── Filter & sort plants by tab ──
  const todayPlants = plants
    .filter((p) => {
      const plantReminders = reminders.filter((r) => r.plantId === p.id);
      return plantReminders.some((r) => isDueOrOverdue(r.nextDue));
    })
    .sort((a, b) => {
      const aDue = getNearestReminder(a.id, reminders)?.nextDue ?? "";
      const bDue = getNearestReminder(b.id, reminders)?.nextDue ?? "";
      return new Date(aDue).getTime() - new Date(bDue).getTime();
    });

  const upcomingPlants = plants
    .filter((p) => {
      const plantReminders = reminders.filter((r) => r.plantId === p.id);
      if (plantReminders.length === 0) return false;
      return plantReminders.every((r) => !isDueOrOverdue(r.nextDue));
    })
    .sort((a, b) => {
      const aDue = getNearestReminder(a.id, reminders)?.nextDue ?? "";
      const bDue = getNearestReminder(b.id, reminders)?.nextDue ?? "";
      return new Date(aDue).getTime() - new Date(bDue).getTime();
    });

  const displayPlants = activeTab === "Today" ? todayPlants : upcomingPlants;

  return (
    <SafeScreen edges={["top"]}>
      <View className="px-6 pt-4 pb-5">
        <View>
          <Text className="text-white text-2xl font-bold">
            Smart Care Schedule
          </Text>
          <Text className="text-gray-text text-sm mt-1">
            {plants.length} plant{plants.length !== 1 ? "s" : ""} in your
            garden
          </Text>
        </View>

        <View className="mt-5">
          <TabSelector
            tabs={["Today", "Upcoming"]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6B8F71" />
        </View>
      ) : plants.length === 0 ? (
        <EmptyState
          icon="leaf-outline"
          title="No plants yet"
          description="Add your first plant by identifying it with a photo"
          actionLabel="Identify a Plant"
          onAction={() => router.push("/(tabs)/add")}
        />
      ) : displayPlants.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons
            name={activeTab === "Today" ? "checkmark-circle-outline" : "calendar-outline"}
            size={48}
            color="#3A3A3C"
          />
          <Text className="text-gray-text text-base mt-4 text-center">
            {activeTab === "Today"
              ? "All caught up! No plants need care today."
              : "No upcoming reminders."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayPlants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item, index }) => {
            const nearest = getNearestReminder(item.id, reminders);
            const dueInfo = nearest ? getDueLabel(nearest.nextDue) : null;
            const dueDate = nearest?.nextDue.split("T")[0] ?? "";

            // Show section header only for Upcoming, and only for the first
            // plant in each due-date group
            let showHeader = false;
            if (activeTab === "Upcoming" && dueInfo) {
              if (index === 0) {
                showHeader = true;
              } else {
                const prevPlant = displayPlants[index - 1];
                const prevNearest = getNearestReminder(prevPlant.id, reminders);
                const prevDate = prevNearest?.nextDue.split("T")[0] ?? "";
                showHeader = dueDate !== prevDate;
              }
            }

            return (
              <View>
                {showHeader && dueInfo && (
                  <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 mt-2">
                    {dueInfo.label}
                  </Text>
                )}
                <PlantCard
                  plant={item}
                  onPress={() => router.push(`/(tabs)/catalog/${item.id}`)}
                  statusOverride={
                    activeTab === "Upcoming" && dueInfo
                      ? dueInfo
                      : undefined
                  }
                />
              </View>
            );
          }}
        />
      )}
    </SafeScreen>
  );
}
