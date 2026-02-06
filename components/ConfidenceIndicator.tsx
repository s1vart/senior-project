import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ConfidenceIndicatorProps {
  confidence: number;
}

export function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  const percent = Math.round(confidence * 100);
  const color =
    percent >= 80 ? "#22C55E" : percent >= 60 ? "#EAB308" : "#EF4444";
  const stars = percent >= 80 ? 5 : percent >= 60 ? 4 : 3;

  return (
    <View className="items-end">
      <View className="flex-row">
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < stars ? "star" : "star-outline"}
            size={12}
            color={i < stars ? color : "#3A3A3C"}
          />
        ))}
      </View>
      <Text style={{ color }} className="text-xs font-semibold mt-0.5">
        {percent}%
      </Text>
    </View>
  );
}
