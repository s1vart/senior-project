import { View, Text, Switch } from "react-native";

interface ToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  description?: string;
}

export function Toggle({ label, value, onValueChange, description }: ToggleProps) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-1 mr-4">
        <Text className="text-white text-base font-medium">{label}</Text>
        {description && (
          <Text className="text-gray-text text-sm mt-0.5">{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#3A3A3C", true: "#7C3AED" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}
