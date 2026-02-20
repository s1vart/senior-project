import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { SearchBar } from "../../../components/ui/SearchBar";
import { PlantSearchResultCard } from "../../../components/PlantSearchResult";
import { Card } from "../../../components/ui/Card";
import { mockSearchResults } from "../../../data/mockSearchResults";

export default function IdentifyScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const filteredResults = searchQuery
    ? mockSearchResults.filter(
        (r) =>
          r.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockSearchResults;

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera access is needed to photograph your plants."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const openLibrary = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Photo library access is needed to select plant photos."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCameraPress = () => {
    Alert.alert("Add a Photo", "Choose how you'd like to add a plant photo.", [
      { text: "Take Photo", onPress: openCamera },
      { text: "Choose from Library", onPress: openLibrary },
      { text: "Cancel", style: "cancel" },
    ]);
  };

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
        onPress={handleCameraPress}
        className="mx-6 mb-5 flex-row items-center justify-center py-3.5 bg-sage-accent/10 border border-sage-accent rounded-xl"
        activeOpacity={0.7}
      >
        <Ionicons name="camera" size={20} color="#6B8F71" />
        <Text className="text-sage-accent font-semibold ml-2">
          Snap a photo to identify
        </Text>
      </TouchableOpacity>

      {selectedImage && (
        <Card className="mx-6 mb-5">
          <View className="flex-row items-center">
            <Image
              source={{ uri: selectedImage }}
              className="w-16 h-16 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1 ml-3">
              <Text className="text-white font-semibold">Your Photo</Text>
              <Text className="text-gray-text text-sm mt-0.5">
                Tap a result below to confirm
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              className="w-8 h-8 rounded-full bg-dark-bg items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </Card>
      )}

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <PlantSearchResultCard
            result={item}
            onPress={() => {
              router.push({
                pathname: "/(tabs)/add/confirm",
                params: {
                  resultId: item.id,
                  commonName: item.commonName,
                  scientificName: item.scientificName,
                  confidence: item.confidence.toString(),
                  imageUrl: item.imageUrl,
                  userPhotoUri: selectedImage ?? "",
                },
              });
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
