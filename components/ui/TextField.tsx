import { View, Text, TextInput, TextInputProps } from "react-native";

interface TextFieldProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
}

export function TextField({ label, icon, ...props }: TextFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-text text-sm mb-1.5 font-medium">{label}</Text>
      <View className="flex-row items-center bg-dark-card rounded-xl px-4 py-3 border border-dark-border">
        {icon && <View className="mr-2">{icon}</View>}
        <TextInput
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-white text-base"
          {...props}
        />
      </View>
    </View>
  );
}
