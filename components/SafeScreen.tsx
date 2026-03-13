import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SafeScreenProps extends ViewProps {
  edges?: ("top" | "bottom")[];
  children: React.ReactNode;
}

/**
 * A replacement for SafeAreaView that applies insets synchronously via
 * inline style, preventing the brief flash behind the notch on Android.
 */
export function SafeScreen({
  edges = ["top"],
  style,
  children,
  ...rest
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: "#1C1C1E",
          paddingTop: edges.includes("top") ? insets.top : 0,
          paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
