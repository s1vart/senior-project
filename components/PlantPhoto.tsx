import { View, Image } from "react-native";

interface PlantPhotoProps {
  uri: string;
  size?: number;
  borderColor?: string;
}

export function PlantPhoto({
  uri,
  size = 60,
  borderColor = "#7C3AED",
}: PlantPhotoProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>
  );
}
