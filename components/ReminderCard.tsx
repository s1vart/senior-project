import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReminderCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function ReminderCard({
  title,
  description,
  icon,
  iconColor = "#6B8F71",
  actionLabel = "Select Plants",
  onAction,
}: ReminderCardProps) {
  return (
    <View className="bg-dark-card rounded-2xl p-4 mb-3">
      <View className="flex-row items-start">
        <View
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-white text-base font-semibold">{title}</Text>
          <Text className="text-gray-text text-sm mt-1">{description}</Text>
        </View>
      </View>
      {onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="mt-3 border border-sage-accent rounded-xl py-2 items-center"
          activeOpacity={0.7}
        >
          <Text className="text-sage-accent font-semibold text-sm">
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
