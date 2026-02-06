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
      <View className="px-5 pt-2 pb-4">
        <Text className="text-white text-2xl font-bold mb-4">
          Identify Your Plant
        </Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search plant name..."
        />
      </View>

      <TouchableOpacity className="mx-5 mb-4 flex-row items-center justify-center py-3 border border-dashed border-violet-accent rounded-xl">
        <Ionicons name="camera" size={20} color="#7C3AED" />
        <Text className="text-violet-accent font-semibold ml-2">
          Can't find your plant? Add it to Snap!
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <PlantSearchResultCard
            result={item}
            onPress={() => {
              // Will add plant to catalog in future phase
            }}
          />
        )}
        ListEmptyComponent={
          <View className="items-center py-10">
            <Ionicons name="leaf-outline" size={48} color="#3A3A3C" />
            <Text className="text-gray-text text-base mt-3">
              No results found
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
