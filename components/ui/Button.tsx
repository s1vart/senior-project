import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline" | "ghost";
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
    primary: "bg-violet-accent",
    outline: "border border-violet-accent bg-transparent",
    ghost: "bg-transparent",
  };

  const textClasses = {
    primary: "text-white font-semibold text-base",
    outline: "text-violet-accent font-semibold text-base",
    ghost: "text-violet-accent font-semibold text-base",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#7C3AED"} />
      ) : (
        <Text className={textClasses[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
