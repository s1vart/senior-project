import { View, Text, Image, TouchableOpacity } from "react-native";
import { PlantSearchResult as PlantSearchResultType } from "../types";
import { ConfidenceIndicator } from "./ConfidenceIndicator";

interface PlantSearchResultProps {
  result: PlantSearchResultType;
  onPress: () => void;
}

export function PlantSearchResultCard({ result, onPress }: PlantSearchResultProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-dark-card rounded-2xl p-3 mb-3"
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: result.imageUrl }}
        className="w-16 h-16 rounded-xl"
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text className="text-white text-base font-semibold">
          {result.commonName}
        </Text>
        <Text className="text-gray-text text-sm italic">
          {result.scientificName}
        </Text>
      </View>
      <ConfidenceIndicator confidence={result.confidence} />
    </TouchableOpacity>
  );
}
