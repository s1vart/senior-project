import { View, Text } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "info";
  className?: string;
}

export function Badge({ label, variant = "default", className = "" }: BadgeProps) {
  const variantClasses = {
    default: "bg-dark-border",
    success: "bg-green-600/20",
    warning: "bg-yellow-600/20",
    info: "bg-sage-accent/20",
  };

  const textClasses = {
    default: "text-gray-text",
    success: "text-green-400",
    warning: "text-yellow-400",
    info: "text-sage-light",
  };

  return (
    <View className={`rounded-full px-3 py-1 self-start ${variantClasses[variant]} ${className}`}>
      <Text className={`text-xs font-semibold uppercase ${textClasses[variant]}`}>
        {label}
      </Text>
    </View>
  );
}
