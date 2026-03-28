import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen } from "../../../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { PlantPhoto } from "../../../components/PlantPhoto";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { ReminderCard } from "../../../components/ReminderCard";
import { fetchPlantById, deletePlant } from "../../../lib/plants";
import {
  fetchRemindersForPlant,
  completeReminder,
  snoozeReminder,
  skipReminder,
} from "../../../lib/reminders";
import { formatDue } from "../../../lib/dates";
import type { Plant, Reminder } from "../../../types";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [plantReminders, setPlantReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const refreshReminders = useCallback(async () => {
    const reminders = await fetchRemindersForPlant(id);
    setPlantReminders(reminders);
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const [data, reminders] = await Promise.all([
          fetchPlantById(id),
          fetchRemindersForPlant(id),
        ]);
        setPlant(data);
        setPlantReminders(reminders);
      } catch {
        setPlant(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Delete Plant",
      `Are you sure you want to delete "${plant?.nickname ?? "this plant"}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlant(id);
              router.back();
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : "Unknown error";
              Alert.alert("Error", msg);
            }
          },
        },
      ]
    );
  }, [id, plant?.nickname, router]);

  const handleAction = useCallback(
    async (
      reminder: Reminder,
      action: "done" | "snooze" | "skip"
    ) => {
      setActionLoading(reminder.id);
      try {
        if (action === "done") await completeReminder(reminder);
        else if (action === "snooze") await snoozeReminder(reminder);
        else await skipReminder(reminder);
        await refreshReminders();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        Alert.alert("Error", msg);
      } finally {
        setActionLoading(null);
      }
    },
    [refreshReminders]
  );

  if (loading) {
    return (
      <SafeScreen style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#6B8F71" />
      </SafeScreen>
    );
  }

  if (!plant) {
    return (
      <SafeScreen style={{ alignItems: "center", justifyContent: "center" }}>
        <Text className="text-white text-lg">Plant not found</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-dark-card border border-dark-border items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Plant Details</Text>
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/catalog/${plant.id}/edit`)}
          className="px-4 py-2 rounded-full bg-sage-accent/15"
        >
          <Text className="text-sage-accent font-semibold text-sm">Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
      >
        <View className="items-center mt-4 mb-8">
          <PlantPhoto uri={plant.photoUrl} size={120} />
          <Text className="text-white text-2xl font-bold mt-5">
            {plant.nickname}
          </Text>
          <Text className="text-gray-text text-base mt-1">
            {plant.commonName}
          </Text>
          <Text className="text-gray-text text-sm italic mt-0.5">
            {plant.scientificName}
          </Text>
          {plant.completionPercent !== undefined && (
            <Badge
              label={`${plant.completionPercent}% Complete`}
              variant="info"
              className="mt-3"
            />
          )}
        </View>

        <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
          Care Info
        </Text>
        <Card className="mb-6">
          <DetailRow
            icon="water"
            label="Last Watered"
            value={plant.lastWatered ?? "Not recorded"}
          />
          <DetailRow
            icon="beaker"
            label="Water Amount"
            value={plant.waterAmountMl ? `${plant.waterAmountMl} ml` : "--"}
          />
          <DetailRow
            icon="sunny"
            label="Direct Sunlight"
            value={plant.directSunlight ? "Yes" : "No"}
          />
          <DetailRow
            icon="time"
            label="Sunlight Hours"
            value={plant.sunlightHours ? `${plant.sunlightHours} hours` : "--"}
          />
          <DetailRow
            icon="resize"
            label="Distance from Window"
            value={
              plant.distanceFromWindow ? `${plant.distanceFromWindow} ft` : "--"
            }
          />
          <DetailRow
            icon="compass"
            label="Window Orientation"
            value={plant.windowOrientation ?? "--"}
            last
          />
          {plant.bestWatering && (
            <View className="pt-4 mt-3 border-t border-dark-border">
              <View className="flex-row items-center mb-2">
                <Ionicons name="water" size={18} color="#9CA3AF" />
                <Text className="text-gray-text ml-3 text-sm font-medium">
                  Watering Advice
                </Text>
              </View>
              <Text className="text-gray-text text-sm leading-5">
                {plant.bestWatering}
              </Text>
            </View>
          )}
        </Card>

        {plantReminders.length > 0 && (
          <>
            <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
              Active Reminders
            </Text>
            {plantReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                title={reminder.careType.charAt(0).toUpperCase() + reminder.careType.slice(1)}
                description={`Every ${reminder.frequencyDays} days`}
                icon={reminder.careType === "water" ? "water" : "leaf"}
                iconColor={reminder.careType === "water" ? "#3B82F6" : "#6B8F71"}
                dueLabel={formatDue(reminder.nextDue)}
                loading={actionLoading === reminder.id}
                onDone={() => handleAction(reminder, "done")}
                onSnooze={() => handleAction(reminder, "snooze")}
                onSkip={() => handleAction(reminder, "skip")}
              />
            ))}
          </>
        )}

        {plant.notes && (
          <>
            <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
              Notes
            </Text>
            <Card>
              <Text className="text-gray-text text-base leading-6">
                {plant.notes}
              </Text>
            </Card>
          </>
        )}

        <TouchableOpacity
          onPress={handleDelete}
          className="mt-8 py-4 rounded-2xl border border-red-500/30 bg-red-500/10 items-center"
        >
          <View className="flex-row items-center">
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text className="text-red-500 font-semibold text-base ml-2">
              Delete Plant
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
}

function DetailRow({
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
      <Ionicons name={icon} size={18} color="#9CA3AF" />
      <Text className="text-gray-text ml-3 flex-1">{label}</Text>
      <Text className="text-white font-medium">{value}</Text>
    </View>
  );
}
