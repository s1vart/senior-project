import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { PlantSearchResultCard } from "../../../components/PlantSearchResult";
import { Card } from "../../../components/ui/Card";
import { identifyPlant, PlantIdError } from "../../../lib/plantId";
import type { PlantSearchResult } from "../../../types";

const ERROR_MESSAGES: Record<string, { icon: string; title: string; body: string }> = {
  NOT_PLANT: {
    icon: "leaf-outline",
    title: "Not a Plant",
    body: "This doesn't appear to be a plant. Try taking a clearer photo of the plant.",
  },
  RATE_LIMIT: {
    icon: "time-outline",
    title: "Rate Limit Reached",
    body: "Too many identification requests. Please try again in a few minutes.",
  },
  NETWORK: {
    icon: "cloud-offline-outline",
    title: "Connection Error",
    body: "Could not connect to the identification service. Check your internet connection.",
  },
  API_ERROR: {
    icon: "warning-outline",
    title: "Service Error",
    body: "The identification service encountered an error. Please try again later.",
  },
};

export default function IdentifyScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [results, setResults] = useState<PlantSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const router = useRouter();

  const runIdentification = async (uri: string, width: number, height: number) => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    setResults([]);
    try {
      const identified = await identifyPlant(uri, width, height);
      setResults(identified);
    } catch (e) {
      if (e instanceof PlantIdError) {
        setError(e.message);
        setErrorCode(e.code);
      } else {
        setError("An unexpected error occurred. Please try again.");
        setErrorCode("API_ERROR");
      }
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (source: "camera" | "library") => {
    if (source === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera access is needed to photograph your plants."
        );
        return;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Photo library access is needed to select plant photos."
        );
        return;
      }
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
          });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage(asset.uri);
      runIdentification(asset.uri, asset.width, asset.height);
    }
  };

  const handleCameraPress = () => {
    Alert.alert("Add a Photo", "Choose how you'd like to add a plant photo.", [
      { text: "Take Photo", onPress: () => pickImage("camera") },
      { text: "Choose from Library", onPress: () => pickImage("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const clearPhoto = () => {
    setSelectedImage(null);
    setResults([]);
    setError(null);
    setErrorCode(null);
  };

  const topConfidence = results.length > 0 ? results[0].confidence : 1;
  const errInfo = errorCode ? ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.API_ERROR : null;

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
      <View className="px-6 pt-4 pb-5">
        <Text className="text-white text-2xl font-bold">
          Identify Your Plant
        </Text>
        <Text className="text-gray-text text-sm mt-1 mb-5">
          Snap a photo to identify your plant
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleCameraPress}
        className="mx-6 mb-5 flex-row items-center justify-center py-3.5 bg-sage-accent/10 border border-sage-accent rounded-xl"
        activeOpacity={0.7}
      >
        <Ionicons name="camera" size={20} color="#6B8F71" />
        <Text className="text-sage-accent font-semibold ml-2">
          {selectedImage ? "Take a different photo" : "Snap a photo to identify"}
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
                {loading
                  ? "Identifying..."
                  : results.length > 0
                    ? `${results.length} result${results.length !== 1 ? "s" : ""} found`
                    : error
                      ? "Identification failed"
                      : "Processing..."}
              </Text>
            </View>
            <TouchableOpacity
              onPress={clearPhoto}
              className="w-8 h-8 rounded-full bg-dark-bg items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {loading && (
        <View className="items-center py-16">
          <ActivityIndicator size="large" color="#6B8F71" />
          <Text className="text-gray-text text-base mt-4">
            Identifying your plant...
          </Text>
        </View>
      )}

      {errInfo && !loading && (
        <Card className="mx-6 mb-5 border border-red-500/30">
          <View className="items-center py-4">
            <Ionicons name={errInfo.icon as any} size={40} color="#EF4444" />
            <Text className="text-white text-lg font-semibold mt-3">
              {errInfo.title}
            </Text>
            <Text className="text-gray-text text-sm text-center mt-2 px-4">
              {errInfo.body}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (selectedImage) {
                  runIdentification(selectedImage, 1024, 1024);
                }
              }}
              className="mt-4 px-6 py-2 bg-sage-accent/20 rounded-lg"
            >
              <Text className="text-sage-accent font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {!loading && !error && results.length > 0 && (
        <>
          {topConfidence < 0.4 && (
            <View className="mx-6 mb-4 flex-row items-start bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/30">
              <Ionicons
                name="alert-circle"
                size={18}
                color="#EAB308"
                style={{ marginTop: 1 }}
              />
              <Text className="text-yellow-400 text-sm ml-2 flex-1 leading-5">
                Low confidence results. The plant may not be clearly visible or
                may be an uncommon species.
              </Text>
            </View>
          )}

          <FlatList
            data={results}
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
          />
        </>
      )}

      {!loading && !error && results.length === 0 && !selectedImage && (
        <View className="items-center py-16">
          <Ionicons name="leaf-outline" size={48} color="#3A3A3C" />
          <Text className="text-gray-text text-base mt-4">
            Take a photo to get started
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
