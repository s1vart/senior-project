import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PlantCard } from "../../../components/PlantCard";
import { TabSelector } from "../../../components/ui/TabSelector";
import { Badge } from "../../../components/ui/Badge";
import { mockPlants } from "../../../data/mockPlants";
import { mockReminders } from "../../../data/mockReminders";

export default function CatalogScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Today");

  const getNextReminderLabel = (plantId: string) => {
    const reminder = mockReminders.find((r) => r.plantId === plantId);
    if (!reminder) return null;
    const daysUntil = Math.ceil(
      (new Date(reminder.nextDue).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntil <= 0) return "Today";
    if (daysUntil === 1) return "Tomorrow";
    if (daysUntil <= 7) return `In ${daysUntil} days`;
    return `In ${Math.ceil(daysUntil / 7)} weeks`;
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
      <View className="px-5 pt-2 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-bold">
            Smart Care Schedule
          </Text>
          <Ionicons name="notifications-outline" size={24} color="#9CA3AF" />
        </View>

        <TabSelector
          tabs={["Today", "Upcoming"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </View>

      <FlatList
        data={mockPlants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => {
          const reminderLabel = getNextReminderLabel(item.id);
          return (
            <View>
              {reminderLabel && activeTab === "Upcoming" && (
                <Badge
                  label={reminderLabel}
                  variant="info"
                  className="mb-2"
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
    </SafeAreaView>
  );
}
