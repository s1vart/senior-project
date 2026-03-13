import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen } from "../../../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { PlantPhoto } from "../../../components/PlantPhoto";
import { ConfidenceIndicator } from "../../../components/ConfidenceIndicator";
import { Card } from "../../../components/ui/Card";
import { TextField } from "../../../components/ui/TextField";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../../../hooks/useAuth";
import { createPlant, uploadPlantPhoto } from "../../../lib/plants";
import { createReminder, suggestWateringFrequency } from "../../../lib/reminders";
import {
  requestNotificationPermissions,
  scheduleReminderNotification,
} from "../../../lib/notifications";

export default function ConfirmPlantScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    resultId: string;
    commonName: string;
    scientificName: string;
    confidence: string;
    imageUrl: string;
    userPhotoUri: string;
    bestWatering: string;
    wateringMin: string;
    wateringMax: string;
  }>();

  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [enableReminder, setEnableReminder] = useState(true);

  const confidence = parseFloat(params.confidence) || 0;
  const hasUserPhoto = params.userPhotoUri && params.userPhotoUri.length > 0;

  const wateringMin = params.wateringMin ? parseFloat(params.wateringMin) : undefined;
  const wateringMax = params.wateringMax ? parseFloat(params.wateringMax) : undefined;
  const suggestedDays = suggestWateringFrequency(wateringMin, wateringMax);

  const handleSave = async () => {
    if (!nickname.trim()) {
      Alert.alert("Nickname Required", "Please give your plant a nickname.");
      return;
    }
    if (!user) {
      Alert.alert("Error", "You must be logged in to save a plant.");
      return;
    }

    setSaving(true);
    try {
      let photoUrl = params.imageUrl;
      if (hasUserPhoto) {
        photoUrl = await uploadPlantPhoto(user.id, params.userPhotoUri);
      }

      const savedPlant = await createPlant({
        userId: user.id,
        nickname: nickname.trim(),
        commonName: params.commonName,
        scientificName: params.scientificName,
        confidence,
        photoUrl,
        bestWatering: params.bestWatering || undefined,
        wateringMin,
        wateringMax,
      });

      if (enableReminder) {
        const granted = await requestNotificationPermissions();
        const now = new Date();
        const nextDue = new Date(now.getTime() + suggestedDays * 24 * 60 * 60 * 1000);
        const reminder = await createReminder({
          plantId: savedPlant.id,
          userId: user.id,
          careType: "water",
          frequencyDays: suggestedDays,
          timeOfDay: "09:00",
          nextDue: nextDue.toISOString(),
          isActive: true,
        });
        if (granted) {
          await scheduleReminderNotification(reminder, nickname.trim());
        }
      }

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
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save your plant. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeScreen edges={["top"]}>
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

        {/* Watering reminder opt-in */}
        <Text className="text-gray-text text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
          Watering Reminder
        </Text>
        <Card className="mb-8">
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: "#3B82F620" }}
            >
              <Ionicons name="water" size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold">
                Water every {suggestedDays} days
              </Text>
              {params.bestWatering ? (
                <Text className="text-gray-text text-sm mt-0.5" numberOfLines={2}>
                  {params.bestWatering}
                </Text>
              ) : (
                <Text className="text-gray-text text-sm mt-0.5">
                  Suggested based on this species
                </Text>
              )}
            </View>
            <Switch
              value={enableReminder}
              onValueChange={setEnableReminder}
              trackColor={{ false: "#3A3A3C", true: "#6B8F71" }}
              thumbColor="white"
            />
          </View>
        </Card>

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
    </SafeScreen>
  );
}
