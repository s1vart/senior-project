import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { PlantPhoto } from "../../../components/PlantPhoto";
import { ConfidenceIndicator } from "../../../components/ConfidenceIndicator";
import { Card } from "../../../components/ui/Card";
import { TextField } from "../../../components/ui/TextField";
import { Button } from "../../../components/ui/Button";

export default function ConfirmPlantScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    resultId: string;
    commonName: string;
    scientificName: string;
    confidence: string;
    imageUrl: string;
    userPhotoUri: string;
  }>();

  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);

  const confidence = parseFloat(params.confidence) || 0;
  const hasUserPhoto = params.userPhotoUri && params.userPhotoUri.length > 0;

  const handleSave = () => {
    if (!nickname.trim()) {
      Alert.alert("Nickname Required", "Please give your plant a nickname.");
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Plant Added!", `${nickname} has been added to your catalog.`, [
        {
          text: "View My Plants",
          onPress: () => router.replace("/(tabs)/catalog"),
        },
        {
          text: "Identify Another",
          onPress: () => router.replace("/(tabs)/add"),
        },
      ]);
    }, 800);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg" edges={["top"]}>
      <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-dark-card border border-dark-border items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Confirm Plant</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo display */}
        <View className="flex-row justify-center items-center mt-6 mb-8">
          {hasUserPhoto ? (
            <>
              <PlantPhoto uri={params.userPhotoUri} size={100} borderColor="#9CA3AF" />
              <View className="mx-4 items-center">
                <Ionicons name="arrow-forward" size={20} color="#6B8F71" />
                <Text className="text-gray-text text-xs mt-1">Match</Text>
              </View>
              <PlantPhoto uri={params.imageUrl} size={100} />
            </>
          ) : (
            <PlantPhoto uri={params.imageUrl} size={120} />
          )}
        </View>

        {/* Plant info */}
        <Card className="mb-6">
          <Text className="text-white text-xl font-bold">
            {params.commonName}
          </Text>
          <Text className="text-gray-text text-base italic mt-1">
            {params.scientificName}
          </Text>
          <View className="mt-3">
            <ConfidenceIndicator confidence={confidence} />
          </View>
        </Card>

        {confidence < 0.4 && (
          <View className="flex-row items-start bg-yellow-500/10 rounded-xl p-4 mb-6 border border-yellow-500/30">
            <Ionicons
              name="alert-circle"
              size={20}
              color="#EAB308"
              style={{ marginTop: 1 }}
            />
            <Text className="text-yellow-400 text-sm ml-2 flex-1 leading-5">
              This identification has low confidence. The plant may be misidentified
              — consider verifying with additional photos or sources.
            </Text>
          </View>
        )}

        {/* Nickname input */}
        <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
          Give it a name
        </Text>
        <TextField
          label="Nickname"
          value={nickname}
          onChangeText={setNickname}
          placeholder="e.g. Living Room Snake Plant"
          icon={<Ionicons name="pencil" size={18} color="#9CA3AF" />}
        />

        {/* Info banner */}
        <View className="flex-row items-start bg-sage-accent/10 rounded-xl p-4 mb-8 border border-sage-accent/20">
          <Ionicons
            name="information-circle"
            size={20}
            color="#6B8F71"
            style={{ marginTop: 1 }}
          />
          <Text className="text-sage-light text-sm ml-2 flex-1 leading-5">
            After adding to your catalog, you can fill in care details and set up
            reminders.
          </Text>
        </View>

        {/* Action buttons */}
        <Button
          title="Add to Catalog"
          onPress={handleSave}
          loading={saving}
          className="mb-3"
        />
        <Button
          title="Choose Different Match"
          onPress={() => router.back()}
          variant="ghost"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
