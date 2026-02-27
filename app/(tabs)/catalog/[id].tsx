import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PlantPhoto } from "../../../components/PlantPhoto";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { mockReminders } from "../../../data/mockReminders";
import { fetchPlantById } from "../../../lib/plants";
import type { Plant } from "../../../types";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const plantReminders = mockReminders.filter((r) => r.plantId === id);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPlantById(id);
        setPlant(data);
      } catch {
        setPlant(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#6B8F71" />
      </SafeAreaView>
    );
  }

  if (!plant) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg items-center justify-center">
        <Text className="text-white text-lg">Plant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
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
        </Card>

        {plantReminders.length > 0 && (
          <>
            <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
              Active Reminders
            </Text>
            <Card className="mb-6">
              {plantReminders.map((reminder, index) => (
                <View
                  key={reminder.id}
                  className={`flex-row items-center py-3 ${
                    index < plantReminders.length - 1
                      ? "border-b border-dark-border"
                      : ""
                  }`}
                >
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{
                      backgroundColor:
                        reminder.careType === "water"
                          ? "#3B82F620"
                          : "#6B8F7120",
                    }}
                  >
                    <Ionicons
                      name={reminder.careType === "water" ? "water" : "leaf"}
                      size={16}
                      color={
                        reminder.careType === "water" ? "#3B82F6" : "#6B8F71"
                      }
                    />
                  </View>
                  <Text className="text-white flex-1 capitalize font-medium">
                    {reminder.careType}
                  </Text>
                  <Text className="text-gray-text text-sm">
                    Every {reminder.frequencyDays} days
                  </Text>
                </View>
              ))}
            </Card>
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
      </ScrollView>
    </SafeAreaView>
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
