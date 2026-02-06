import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Plant } from "../types";
import { PlantPhoto } from "./PlantPhoto";

interface PlantCardProps {
  plant: Plant;
  daysAgo?: number;
  onPress: () => void;
}

export function PlantCard({ plant, daysAgo, onPress }: PlantCardProps) {
  const daysSinceWatered = daysAgo ?? getDaysSinceWatered(plant.lastWatered);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-dark-card rounded-2xl p-4 mb-3"
      activeOpacity={0.7}
    >
      <PlantPhoto uri={plant.photoUrl} size={56} />
      <View className="flex-1 ml-3">
        <Text className="text-white text-base font-semibold">
          {plant.nickname}
        </Text>
        <Text className="text-gray-text text-sm">
          {plant.commonName}
        </Text>
      </View>
      <View className="items-end">
        <View className="flex-row items-center">
          <Ionicons name="water" size={14} color="#9CA3AF" />
          <Text className="text-gray-text text-sm ml-1">
            {plant.waterAmountMl ? `${(plant.waterAmountMl / 1000).toFixed(1)} cup` : "--"}
          </Text>
        </View>
        <Text className="text-gray-text text-xs mt-1">
          {daysSinceWatered} days ago
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
