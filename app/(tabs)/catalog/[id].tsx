import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PlantPhoto } from "../../../components/PlantPhoto";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { mockPlants } from "../../../data/mockPlants";
import { mockReminders } from "../../../data/mockReminders";

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const plant = mockPlants.find((p) => p.id === id);
  const plantReminders = mockReminders.filter((r) => r.plantId === id);

  if (!plant) {
    return (
      <SafeAreaView className="flex-1 bg-dark-bg items-center justify-center">
        <Text className="text-white text-lg">Plant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Plant Details</Text>
        <TouchableOpacity
          onPress={() => router.push(`/(tabs)/catalog/${plant.id}/edit`)}
        >
          <Text className="text-violet-accent font-semibold">Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <View className="items-center mb-6">
          <PlantPhoto uri={plant.photoUrl} size={120} />
          <Text className="text-white text-2xl font-bold mt-4">
            {plant.nickname}
          </Text>
          <Text className="text-gray-text text-base">
            {plant.commonName}
          </Text>
          <Text className="text-gray-text text-sm italic">
            {plant.scientificName}
          </Text>
          {plant.completionPercent !== undefined && (
            <Badge
              label={`${plant.completionPercent}% Complete`}
              variant="info"
              className="mt-2"
            />
          )}
        </View>

        <Card className="mb-4">
          <Text className="text-white text-lg font-semibold mb-3">
            Care Info
          </Text>
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
          />
        </Card>

        {plantReminders.length > 0 && (
          <Card className="mb-4">
            <Text className="text-white text-lg font-semibold mb-3">
              Active Reminders
            </Text>
            {plantReminders.map((reminder) => (
              <View
                key={reminder.id}
                className="flex-row items-center py-2 border-b border-dark-border"
              >
                <Ionicons
                  name={reminder.careType === "water" ? "water" : "leaf"}
                  size={18}
                  color="#7C3AED"
                />
                <Text className="text-white ml-2 flex-1 capitalize">
                  {reminder.careType}
                </Text>
                <Text className="text-gray-text text-sm">
                  Every {reminder.frequencyDays} days
                </Text>
              </View>
            ))}
          </Card>
        )}

        {plant.notes && (
          <Card>
            <Text className="text-white text-lg font-semibold mb-2">Notes</Text>
            <Text className="text-gray-text text-base">{plant.notes}</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center py-2 border-b border-dark-border">
      <Ionicons name={icon} size={18} color="#9CA3AF" />
      <Text className="text-gray-text ml-2 flex-1">{label}</Text>
      <Text className="text-white">{value}</Text>
    </View>
  );
}
