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
  /** Tri-action callbacks — when provided, renders Done/Snooze/Skip row */
  onDone?: () => void;
  onSnooze?: () => void;
  onSkip?: () => void;
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
  onDone,
  onSnooze,
  onSkip,
  loading = false,
}: ReminderCardProps) {
  const hasTriActions = onDone || onSnooze || onSkip;

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

      {/* Tri-action row (Done / Snooze / Skip) */}
      {hasTriActions && (
        <View className="flex-row mt-3 gap-2">
          {onDone && (
            <ActionButton
              label="Done"
              icon="checkmark-circle"
              color="#22C55E"
              onPress={onDone}
              disabled={loading}
            />
          )}
          {onSnooze && (
            <ActionButton
              label="Snooze"
              icon="time"
              color="#EAB308"
              onPress={onSnooze}
              disabled={loading}
            />
          )}
          {onSkip && (
            <ActionButton
              label="Skip"
              icon="play-skip-forward"
              color="#9CA3AF"
              onPress={onSkip}
              disabled={loading}
            />
          )}
          {loading && (
            <View className="items-center justify-center ml-2">
              <ActivityIndicator size="small" color="#6B8F71" />
            </View>
          )}
        </View>
      )}

      {/* Legacy single-action button */}
      {!hasTriActions && onAction && (
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

function ActionButton({
  label,
  icon,
  color,
  onPress,
  disabled,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      className="flex-1 flex-row items-center justify-center rounded-xl py-2"
      style={{
        backgroundColor: `${color}15`,
        borderWidth: 1,
        borderColor: `${color}40`,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Ionicons name={icon} size={16} color={color} />
      <Text style={{ color }} className="font-semibold text-xs ml-1">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
