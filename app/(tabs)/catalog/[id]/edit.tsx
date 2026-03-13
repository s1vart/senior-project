import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen } from "../../../../components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { PlantPhoto } from "../../../../components/PlantPhoto";
import { TextField } from "../../../../components/ui/TextField";
import { Toggle } from "../../../../components/ui/Toggle";
import { Card } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/Button";
import { fetchPlantById, updatePlant, deletePlant } from "../../../../lib/plants";
import type { Plant } from "../../../../types";

export default function EditPlantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nickname, setNickname] = useState("");
  const [plantType, setPlantType] = useState("");
  const [lastWatered, setLastWatered] = useState("");
  const [directSunlight, setDirectSunlight] = useState(false);
  const [sunlightHours, setSunlightHours] = useState("");
  const [distanceFromWindow, setDistanceFromWindow] = useState("");
  const [windowOrientation, setWindowOrientation] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPlantById(id);
        if (data) {
          setPlant(data);
          setNickname(data.nickname);
          setPlantType(data.commonName);
          setLastWatered(data.lastWatered ?? "");
          setDirectSunlight(data.directSunlight ?? false);
          setSunlightHours(data.sunlightHours?.toString() ?? "");
          setDistanceFromWindow(data.distanceFromWindow?.toString() ?? "");
          setWindowOrientation(data.windowOrientation ?? "");
          setNotes(data.notes ?? "");
        }
      } catch {
        setPlant(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePlant(id, {
        nickname,
        commonName: plantType,
        lastWatered: lastWatered || undefined,
        directSunlight,
        sunlightHours: parseFloat(sunlightHours) || undefined,
        distanceFromWindow: parseFloat(distanceFromWindow) || undefined,
        windowOrientation: windowOrientation || undefined,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Plant",
      `Are you sure you want to remove ${plant?.nickname ?? "this plant"} from your catalog?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePlant(id);
              router.replace("/(tabs)/catalog");
            } catch {
              Alert.alert("Error", "Failed to delete plant.");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeScreen style={{ alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#6B8F71" />
      </SafeScreen>
    );
  }

  if (!plant) {
    return (
      <SafeScreen style={{ alignItems: "center", justifyContent: "center" }}>
        <Text className="text-white text-lg">Plant not found</Text>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen edges={["top"]}>
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">
          Edit Plant Details
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          <Text className="text-sage-accent font-semibold">
            {saving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-6">
          <PlantPhoto uri={plant.photoUrl} size={100} />
          {plant.completionPercent !== undefined && (
            <Text className="text-sage-light text-sm font-semibold mt-2">
              {plant.completionPercent}% Complete
            </Text>
          )}
        </View>

        <TextField
          label="Name"
          value={nickname}
          onChangeText={setNickname}
          placeholder="Plant nickname"
          icon={<Ionicons name="pencil" size={18} color="#9CA3AF" />}
        />

        <TextField
          label="Plant Type"
          value={plantType}
          onChangeText={setPlantType}
          placeholder="e.g. Bredasdorp Gasteria"
          icon={<Ionicons name="leaf" size={18} color="#9CA3AF" />}
        />

        <TextField
          label="Last Watered On"
          value={lastWatered}
          onChangeText={setLastWatered}
          placeholder="YYYY-MM-DD"
          icon={<Ionicons name="calendar" size={18} color="#9CA3AF" />}
        />

        <Card className="mt-2">
          <View className="flex-row items-center mb-3">
            <Ionicons name="sunny" size={20} color="#EAB308" />
            <Text className="text-white text-lg font-semibold ml-2">Light</Text>
          </View>

          <Toggle
            label="Direct Sunlight?"
            value={directSunlight}
            onValueChange={setDirectSunlight}
          />

          <TextField
            label="Hours of Direct Sunlight"
            value={sunlightHours}
            onChangeText={setSunlightHours}
            placeholder="e.g. 4"
            keyboardType="numeric"
            icon={<Ionicons name="time" size={18} color="#9CA3AF" />}
          />

          <TextField
            label="Distance from Window"
            value={distanceFromWindow}
            onChangeText={setDistanceFromWindow}
            placeholder="e.g. 2.0 ft"
            keyboardType="numeric"
            icon={<Ionicons name="resize" size={18} color="#9CA3AF" />}
          />

          <TextField
            label="Window Orientation"
            value={windowOrientation}
            onChangeText={setWindowOrientation}
            placeholder="e.g. South"
            icon={<Ionicons name="compass" size={18} color="#9CA3AF" />}
          />
        </Card>

        <TextField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Add notes about your plant..."
          multiline
          icon={<Ionicons name="document-text" size={18} color="#9CA3AF" />}
        />

        <View className="mt-6">
          <Button
            title="Delete Plant"
            onPress={handleDelete}
            variant="danger"
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
