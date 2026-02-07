import { View } from "react-native";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <View className={`bg-dark-card rounded-2xl p-4 border border-dark-border ${className}`}>
      {children}
    </View>
  );
}
