import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}: ButtonProps) {
  const baseClasses = "rounded-xl py-3.5 px-6 items-center justify-center";

  const variantClasses = {
    primary: "bg-sage-accent",
    outline: "border border-sage-accent bg-transparent",
    ghost: "bg-transparent",
    danger: "bg-dark-card border border-dark-border",
  };

  const textClasses = {
    primary: "text-white font-semibold text-base",
    outline: "text-sage-accent font-semibold text-base",
    ghost: "text-sage-accent font-semibold text-base",
    danger: "text-red-400 font-semibold text-base",
  };

  const indicatorColor =
    variant === "primary" ? "#fff" : variant === "danger" ? "#F87171" : "#6B8F71";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={indicatorColor} />
      ) : (
        <Text className={textClasses[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
