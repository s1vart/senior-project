import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Plant } from "../types";
import { PlantPhoto } from "./PlantPhoto";

interface PlantCardProps {
  plant: Plant;
  daysAgo?: number;
  onPress: () => void;
}

function getWaterStatus(days: number): {
  color: string;
  label: string;
} {
  if (days <= 3) return { color: "#22C55E", label: "Healthy" };
  if (days <= 7) return { color: "#EAB308", label: "Due soon" };
  return { color: "#EF4444", label: "Overdue" };
}

export function PlantCard({ plant, daysAgo, onPress }: PlantCardProps) {
  const daysSinceWatered = daysAgo ?? getDaysSinceWatered(plant.lastWatered);
  const waterStatus = getWaterStatus(daysSinceWatered);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-dark-card border border-dark-border rounded-2xl"
      activeOpacity={0.7}
      style={{ borderLeftWidth: 3, borderLeftColor: waterStatus.color }}
    >
      <View className="flex-row items-center px-4 py-4">
        <PlantPhoto uri={plant.photoUrl} size={52} />
        <View className="flex-1 ml-4">
          <Text className="text-white text-base font-bold">
            {plant.nickname}
          </Text>
          <Text className="text-gray-text text-sm mt-0.5">
            {plant.commonName}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#3A3A3C" />
      </View>

      <View className="flex-row items-center px-4 pb-3 pt-0">
        <View
          className="flex-row items-center rounded-full px-2.5 py-1"
          style={{ backgroundColor: `${waterStatus.color}15` }}
        >
          <Ionicons name="water" size={12} color={waterStatus.color} />
          <Text
            className="text-xs font-semibold ml-1"
            style={{ color: waterStatus.color }}
          >
            {waterStatus.label}
          </Text>
        </View>
        <Text className="text-gray-text text-xs ml-3">
          Watered {daysSinceWatered}d ago
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function getDaysSinceWatered(lastWatered?: string): number {
  if (!lastWatered) return 0;
  const diff = Date.now() - new Date(lastWatered).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
