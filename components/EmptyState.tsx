import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./ui/Button";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name={icon} size={64} color="#3A3A3C" />
      <Text className="text-white text-xl font-semibold mt-4 text-center">
        {title}
      </Text>
      <Text className="text-gray-text text-base mt-2 text-center">
        {description}
      </Text>
      {actionLabel && onAction && (
        <View className="mt-6 w-full">
          <Button title={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}
