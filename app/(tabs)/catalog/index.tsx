import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
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
import { mockReminders } from "../../../data/mockReminders";
import { useAuth } from "../../../hooks/useAuth";
import { fetchPlants } from "../../../lib/plants";
import type { Plant } from "../../../types";

export default function CatalogScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Today");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlants = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await fetchPlants(user.id);
      setPlants(data);
    } catch {
      Alert.alert("Error", "Could not load your plants.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadPlants();
    }, [loadPlants])
  );

  const getNextReminderLabel = (plantId: string) => {
    const reminder = mockReminders.find((r) => r.plantId === plantId);
    if (!reminder) return null;
    const daysUntil = Math.ceil(
      (new Date(reminder.nextDue).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    );
    if (daysUntil <= 0) return "Today";
    if (daysUntil === 1) return "Tomorrow";
    if (daysUntil <= 7) return `In ${daysUntil} days`;
    return `In ${Math.ceil(daysUntil / 7)} weeks`;
  };

  return (
    <SafeScreen edges={["top"]}>
      <View className="px-6 pt-4 pb-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-white text-2xl font-bold">
              Smart Care Schedule
            </Text>
            <Text className="text-gray-text text-sm mt-1">
              {plants.length} plant{plants.length !== 1 ? "s" : ""} in your
              garden
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/catalog/manage")}
            className="w-10 h-10 rounded-full bg-dark-card border border-dark-border items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
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
      ) : (
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => {
            const reminderLabel = getNextReminderLabel(item.id);
            return (
              <View>
                {reminderLabel && activeTab === "Upcoming" && (
                  <Badge
                    label={reminderLabel}
                    variant="info"
                    className="mb-3"
                  />
                )}
                <PlantCard
                  plant={item}
                  onPress={() => router.push(`/(tabs)/catalog/${item.id}`)}
                />
              </View>
            );
          }}
        />
      )}
    </SafeScreen>
  );
}
