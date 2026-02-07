import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { Card } from "../../../components/ui/Card";
import { mockResources } from "../../../data/mockResources";

const US_STATES = ["FL", "CA", "TX", "NY", "GA"];

export default function ResourcesScreen() {
  const [selectedState, setSelectedState] = useState("FL");
  const filtered = mockResources.filter((r) => r.state === selectedState);

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
      <View className="px-6 pt-4 pb-5">
        <Text className="text-white text-2xl font-bold">Resources</Text>
        <Text className="text-gray-text text-sm mt-1 mb-5">
          Credible extension services by state
        </Text>

        <View className="flex-row">
          {US_STATES.map((state) => (
            <TouchableOpacity
              key={state}
              onPress={() => setSelectedState(state)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                selectedState === state
                  ? "bg-sage-accent border-sage-accent"
                  : "bg-dark-card border-dark-border"
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-semibold ${
                  selectedState === state ? "text-white" : "text-gray-text"
                }`}
              >
                {state}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => WebBrowser.openBrowserAsync(item.url)}
            activeOpacity={0.7}
          >
            <Card>
              <View className="flex-row items-start">
                <View className="w-10 h-10 rounded-full bg-sage-accent/20 items-center justify-center mr-3">
                  <Ionicons name="library" size={20} color="#6B8F71" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-base font-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-gray-text text-sm mt-1 leading-5">
                    {item.description}
                  </Text>
                </View>
                <Ionicons
                  name="open-outline"
                  size={18}
                  color="#9CA3AF"
                  style={{ marginTop: 2 }}
                />
              </View>
            </Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Ionicons name="book-outline" size={48} color="#3A3A3C" />
            <Text className="text-gray-text text-base mt-4">
              No resources for {selectedState} yet
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
