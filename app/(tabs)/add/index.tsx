import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "../../../components/ui/SearchBar";
import { PlantSearchResultCard } from "../../../components/PlantSearchResult";
import { mockSearchResults } from "../../../data/mockSearchResults";

export default function IdentifyScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = searchQuery
    ? mockSearchResults.filter(
        (r) =>
          r.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockSearchResults;

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
      <View className="px-6 pt-4 pb-5">
        <Text className="text-white text-2xl font-bold">
          Identify Your Plant
        </Text>
        <Text className="text-gray-text text-sm mt-1 mb-5">
          Search or snap a photo to identify
        </Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search plant name..."
        />
      </View>

      <TouchableOpacity
        className="mx-6 mb-5 flex-row items-center justify-center py-3.5 bg-sage-accent/10 border border-sage-accent rounded-xl"
        activeOpacity={0.7}
      >
        <Ionicons name="camera" size={20} color="#6B8F71" />
        <Text className="text-sage-accent font-semibold ml-2">
          Snap a photo to identify
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <PlantSearchResultCard
            result={item}
            onPress={() => {
              // Will add plant to catalog in future phase
            }}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Ionicons name="leaf-outline" size={48} color="#3A3A3C" />
            <Text className="text-gray-text text-base mt-4">
              No results found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
