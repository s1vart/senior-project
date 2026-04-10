import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReminderCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  /** Legacy single-action button label */
  actionLabel?: string;
  /** Legacy single-action callback */
  onAction?: () => void;
  /** Due date label shown below description */
  dueLabel?: string;
  /** Whether the reminder is currently due (nextDue <= today) */
  isDue?: boolean;
  /** Snooze callback — pushes reminder by 1 day */
  onSnooze?: () => void;
  /** Disables action buttons and shows spinner */
  loading?: boolean;
}

export function ReminderCard({
  title,
  description,
  icon,
  iconColor = "#6B8F71",
  actionLabel = "Select Plants",
  onAction,
  dueLabel,
  isDue = false,
  onSnooze,
  loading = false,
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
          {dueLabel && (
            <Text className="text-gray-text text-xs mt-1">{dueLabel}</Text>
          )}
        </View>
      </View>

      {onSnooze && (
        <View className="flex-row mt-3">
          <TouchableOpacity
            onPress={onSnooze}
            disabled={loading || !isDue}
            activeOpacity={0.7}
            className="flex-1 flex-row items-center justify-center rounded-xl py-2"
            style={{
              backgroundColor: "#EAB30815",
              borderWidth: 1,
              borderColor: "#EAB30840",
              opacity: loading || !isDue ? 0.4 : 1,
            }}
          >
            <Ionicons name="time" size={16} color="#EAB308" />
            <Text
              style={{ color: "#EAB308" }}
              className="font-semibold text-xs ml-1"
            >
              Snooze
            </Text>
          </TouchableOpacity>
          {loading && (
            <View className="items-center justify-center ml-2">
              <ActivityIndicator size="small" color="#6B8F71" />
            </View>
          )}
        </View>
      )}
      {/* Legacy single-action button (used by manage screen) */}
      {!onSnooze && onAction && (
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
